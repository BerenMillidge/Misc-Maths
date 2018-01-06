// okay, now it's time to implement wallet fucntionality to add a simple interface
// for the end user, which is very kind of important ... idk

// so basically a user with a node must be able to create a new wallet - i.e. private key
// view balance of his wallet
// and send coins to other addresses
// so it shouldn't be that difficult hopefully...
// but who even knows to be honest? I'm not sure an open source chat app
// would be a good thing to do on blockchain for julia
// I mean it would be really cool and fun, but developing it further will be annoying
// but I just don't know to be honest... I don't know at all
// let's try and write this up to see if we understand it generally
// who even knows
// we would have it implementing algorand for relatively massive chat transaciton volume
// and cuold give people clients and so forth in react
// could be fun hopefully perhaps... who would know?

// okay, so first we need to geneate an unencrypted private key when needed
// we're putting it to file node/wallet/private_key

import {ec} from 'elliptic';
import {existsSync, readFileSync, unlinkSync, writeFileSync} from 'fs';
import * as  from 'loadsh';

import {getPublicKey, getTransactionId, signTxIn, Transaction, TxIn, TxOut, UnspentTxOut} from './transaction';

const privateKeyLocation = "node/wallet/private_key";
const EC = new ec('secp256k1');


// a wallet is just a generally recognised private key, without any issues thereby
// it's kind of cool to be honest, and I really have no idea how it would work
// which is great, but idk so much really argh


const generatePrivateKey = function(): string {
	const keyPair = EC.genKeyPair();
	const privateKey =  keyPair.getPrivate();
	return privateKey.toString(16);
}

const initWallet = function() {
	if(existsSync(privateKeyLocation)){
		// we don't want to override existing private keys
		return;
	}
	const newPrivateKey = generatePrivateKey();
	writeFileSync(privateKeyLocation, newPrivateKey);
	console.log('new wallet with private key created');
}

// we also need to be ale to retrieve our public and private keys

const getPrivateFromWallet = function(): string {
	const buffer = readFileSync(privateKeyLocation, "utf8");
	return buffer.toString();
}

const getPublicFromWallet = function(): string {
	const privateKey = getPrivateFromWallet();
	const key = EC.keyFromPrivate(privateKey, 'hex');
	return key.getPublic().encode('hex');
}

// and get a balaance which requres using the blockchain

const getBalance = function(address: string, unspentTxOuts: UnspentTxOut[]): number {
	return unspentTxOuts.filter((uTxO: UnspentTxOut) => uTxO.address === address)
						.map((uTxO: UnspentTxOut) => uTxO.amount)
						.sum();
}


// so for the sending transactions what we do is as follows
// basically we can't just split it generally, we must use all our txouts at the same time
// so we basically gather all our money and then split it and sendthe amount we want to the person
// and the rest back to us
// but first we need to find alll our different transaction unspent outputs we can use

// this function does that
const findTxOutsForAmount = function(amount: number, myUnspentTxOuts: UnspentTxOut[]) {
	var currentAmount: number = 0;
	const includedUnspentTxOuts: UnspentTxOut[] = [];
	for (const myUnspentTxOut of myUnspentTxOuts) {
		includedUnspentTxOuts.push(myUnspentTxOuts);
		currentAmount += myUnspentTxOut.amount;
		if(currentAmount >= amount) {
			const leftoverAmount = currentAmount - amount;
			return {includedUnspentTxOuts, leftoverAmount}
		}
	}

}

// we send the leftover amount back to our address
