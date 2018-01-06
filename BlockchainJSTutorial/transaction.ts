// okay, this is where we put our transaction logic
// the actual logic behind it is fairly simple 

// okay this how I think transactions work. So to input a transation you sign it with your private key
// which generates the string and can be verified from that. and it's given a number or amount
// and then the message has a shas

// so the output goes to the public key of the recipient which can only be unlocked with their 
// private key, and an amount
// the input is the id of the recipient - their public key, and a idnex of a transactoin where they
// received the keys in the first place and a signature proving it's actually the thing

import * as  CryptoJS from 'crypto-js';

class TxOut {
	public address: string;
	public amount: number;

	constructor(address: string, amount: number) {
		this.address = address;
		this.amount = amount;
	}
}

class TxIn {
	public txOutId: string;
	public txOutIndex: number;
	public signature: string;

	constructor(txoutid: string, txoutindex: number, signature: string) {
		this.txOutId = txoutid;
		this.txOutIndex = txoutindex;
		this.signature = signature;
	}
}

// a transactino consists of a transaction id and a list of public inputs and outputs
// which I assume are parrallel arrays

class Transaction {
	public id: string;
	public txIns: TxIn[];
	public txOuts: TxOut[];

	constructor(id: string, txIns: TxIn[], txOuts: TxOut[]) {
		this.id = id;
		this.txIns = txIns;
		this.txOuts = txOuts;
	}
}

class UnspentTxOut {
	public readonly txOutId: string;
	public readonly txOutIndex: number;
	public readonly address: string;
	public readonly amount: number;

	constructor(txOutId: string, txOutIndex: number, address: string, amount: number) {
		this.txOutId = txOutId;
		this.txOutIndex = txOutIndex;
		this.address = address;
		this.amount = amount;
	}
}

// this is a list which holds all unspent outputs inthe blockchain
// so basically everyone's balances is entirely public, as expected
// wecould perhaps hash it with the private key or something if we want
// to make it private and to be honest it probably does that realistically!
// although it's only a fairly small level of privacy really as once found once
// the entire thing will collapse, and perhaps the key can be recovered!
var unspentTxOuts: UnspentTxOut[] = [];



// the transaction id is calculated forom a hash of all the contents but not the signatures
// of the txids as they will be added onto later in the transation

const getTransactionId = function(transaction: Transaction): string {
	const txInContent: string = transaction.txIns
		.map(function(txIn: TxIn) {
			return txIn.txOutId + txIn.txOutIndex;
		})
		.reduce(function(a,b) {
			return a + b;
		},"");

	const txOutContent: string = transaction.txOuts
		.map(function(txOut: TxOut) {
			return txOut.address + txOut.amount;
		})
		.reduce(function(a, b) {
			return a + b;
		},"");
		return CryptoJS.SHA256(txInContent + txOutContent).toString();
}

// we also need a transation signature above the transactoin id
// this will just include the hash of the transactino in the first place
// we only really sign the hash as if the contents is changed, so must the hash be
// making it invalid
// i.e. its' really difficult to figure uot both a signature and a hash of it to make it work
// as the problem is basically that of finding the hash collision, which is difficult!

const signTxIn = function(transaction: Transaction, txInIndex: number,
				privateKey: string, aUnspentTxOuts: UnspentTxOut[]): string {
	const txIn: TxIn = transaction.txIns[txInIndex];
	const dataToSign = transaction.id;
	const referencedUnspentTxOut: UnspentTxOut = findUnspentTxOut(txIn.txOutId,txIn.txOutIndex, aUnspentTxOuts);
	const referencedAddress = referencedUnspentTxOut.address;
	const key = ec.keyFromPrivate(privateKey, 'hex');
	const signature: string = toHexString(key.sign(dataToSign).toDER());
	return signature;

}



// what's going on with the unspents? well, apprenly a transactoin must refer to an unspenct transaction
// output so that's our balance as such really, so it's just a list of things which can be updated
// fromthe current blockchain. let's write that

// so, every time a new block is added to the chain, we need to udate our list of unspent 
// transactoin outputs since we're spending things and shuffling it around
// so first we need to get the transactoins, then see what are consumed and the update the resulting

// we also now need to lay out our transaction validatoin rules, which isn't so bad or difficult
// or horrendous generally, but it could be

const isValidTransactionStructure = function(transaction:Transaction) {
	if (typeof transaction.id !== 'string') {
		console.log('invalid transaction id');
		return false;
	}
	if (typeof transaction.txIns !==TxIn[]) {
		console.log('invalid transaction inputs');
		return false;
	}
	if (typeof transaction.txOuts !== TxOut[]) {
		console.log('invalid transaction outputs');
		return false;
	}
	if (!transaction.txIns
            .map(isValidTxInStructure)
            .reduce((a, b) => (a && b), true)) {
        return false;
}

		//we also need the transaction id to be valid


	// we also need the signatures to be valid
}



// and the general for multiple, using functional programming style instead of proper standard loop
// which makes way more sense, but probably not to mathematicians

const isValidTransactionsStructure = (transactions: Transaction[]): boolean => {
    return transactions
        .map(isValidTransactionStructure)
        .reduce((a, b) => (a && b), true);
};

// we need to be ale to sign input transactions which couldcause issues!

const hasDuplicates = function(txIns: TxIn[]): boolean {
	const groups = _.countBy(txIns, function(txIn) {
		return txIn.txOutId + txIn.txOutId:
	});
	return groups.map(function(value, key) {
		if(value > 1) {
			console.log('duplicate txIn: ' + key);
			return true;
		} else {
			return false;
		}
	})
	.includes(true);
	}

// this gets a transaction given a string orsomething. surely we need the thing
// or it I honestly don't know, shouldn't thie be querying the blockchain???
// who even knows?

const getCoinbaseTransaction = function(address: string, blockIndex: number): Transaction {
	const t = new Transaction();
	const txIn: TxIn = new TxIn();
	txIn.signature = "";
	txIn.txOutId = "";
	txIn.txOutIndex = blockIndex;

	t.txIns = [txIn];
	t.txOuts = [new TxOut(address, 'COINBASE_AMOUNT')];
	t.id = getTransactionId(t);
	return t;
}


const validateTxIn = function(txIn: TxIn, transaction: Transaction, aUnspentTxOuts: UnspentTxOut[]): boolean {
	const referencedUTxOut: UnspentTxOut = aUnspentTxOuts.find(function(uTxO) {
		return UTxO.txOutId === txIn.txOutId && uTxO.txOut ===txIn.txOutId;
	});
}

const isValidAddress = function(address: string): boolean {
	const address_regexp = '^[a-fA-F0-9]+$';
	if(address.length !==130) {
		console.log('invalid public ket length');
		return false;
	}
	else if (address.match(address_regexp) === null) {
		console.log('public key fails regex match');
		return false;
	} else if (!address.startsWith('04')) {
		console.log('public key must start with 04');
		return false;
	}
	return true;
}

const tohexString = function(byteArray): string {
	return Array.from(byteArray, function(byte:any) {
		return ('0' + (byte & 0xFF).toString(16)).slice(-2);
	}).join('');
}

const processTransactions = function(transactions: Transaction[], aUnspentTxOuts: UnspentTxOut[], blockIndex: number) {
	if(!isValidTransactionsStructure(transactions)) {
		return null;
	}
	if(!validateBlockTransactions(transactions, aUnspentTxOuts, blockIndex)) {
		console.log('invalid block transactions');
		return null;
	}
	return updateUnspentTxOuts(transactions, aUnspentTxOuts);

}
const getPublicKey = function(aPriveyKey: string): string {
	return ec.keyFromPrivate(aPrivateKey, 'hex').getPublic().encode('hex');
}

const updateUnspentTxOuts = function(newTransactions: Transaction[], aUnspentTxOuts: UnspentTxOut[]): UnspentTxOut[] {
	const newUnspentTxOuts: UnspentTxOut[] = newTransactions
		.map(function(t){
			return t.txOuts.map(function(txOut,index){
				return new UnspentTxOut(t.id, index, txOut.address, txOut.amount;
			});
		})
		.reduce(function(a,b){
			return a.concat(b);
		},[]);
	const consumedTxOuts: UnspentTxOut[] = newTransactions
		.map(function(t){
			return t.txIns;
		})
		.reduce(function(a,b){
			return a.concat(b);
		},[]);
	const resultingUnspentTxOuts = aUnspentTxOuts
		.filter(function(uTxO) {
			return !findUnspentTxOut(uTxO.txOutId, uTxO.txOutIndex, consumedTxOuts);
		})
		.concat(newUnspentTxOuts);
		return resultingUnspentTxOuts;
}








