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