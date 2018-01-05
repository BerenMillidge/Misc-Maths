//this uses typescript for everything hopefully!?
//okay great we installed the typescript package for sublime, that's great
// at some point we'll ahve to learn sublime scripting for my linters and so forth
// but for now our aim is to understand the blockchain in typescript, so let's do this

// okay, so we'regoing to create a toy blockchain here for fun
// itshouldn't be that difficult hopefully
// all it is is a trustless distributed database, well, really an append only log
// which is what we want really
// I wonder if we can do more databases generally
// but you can build a lot off an append only log
// so that's what matters. knowing about these technologies at the concrete level will
// likely help consideraly - at least that's the hope


// okay, let's get started - in TypeScript!!!


// yeah, the syntax is very javalike - well, it is javascript lol!

import * as CryptoJS from 'crypto-js';
import {broadcastLatest} from './p2p';
class Block {
	public index: number;
	public hash: string;
	public previousHash: string;
	public timestamp: number;
	public data: string;

	constructor(index: number, hash: string, previousHash: string, timestamp: number, data:string) {
		this.index = index;
		this.previousHash = previousHash;
		this.timestamp = timestamp;
		this.data = data;
		this.hash = hash;
	}

	// we have a functoin which calculates the has for us

}

// a function to calcualte the hash of a block
const calculateHash = function(index: number, previousHash: string, timestamp: number, data: string): string {
		CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
	}

// this is our first ever block, programmatically created!
const genesisBlock: Block = new Block(
	0,'816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7',null, 1465154705, "my genesis block!!" );


// our generate next block function
const generateNextBlock = function(blockData: string) {
	const previousBlock: Block = getLatestBlock();
	const nextIndex: number = previousBlock.index +1;
	const nextTimestamp: number = new Date().getTime() / 1000;
	const nextHash: string = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
	const newBlock: Block = new Block(nextIndex, nextHash, previousBlock.hash, nextTimestamp, blockData);
	return newBlock;
}

// a utility function which does the hash calculations for us
const calculateHashForBlock = function(block:Block): string {
	return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
}

// for now we use an in memory javascript array to store the lbockchain, so it won't persist upon program termination

var blockchain: Block[] = [genesisBlock];

const getBlockChain = function(): Block[] {
	return blockchain;
}

const getLatestBlock = function(): Block {
	return blockchain[blockchain.length-1];
}

// we need the way to check the validity of a chain of blocks
// the first step is to check the validity of a new block

const isValidNewBlock = function(newBlock: Block, previousBlock: Block): boolean {
	if (previousBlock.index + 1 !== newBlock.index) {
		console.log('invalid index in new block');
		return false;
	} else if (previousBlock.hash!== newBlock.previousHash) {
		console.log('invalid previous hash')
		return false;
	} else if (calculateHashForBlock(newBlock)!== newBlock.hash) {
		console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
		return false;
	}
	return true;
}

// a fairly basic validaiton. really we'd need much more ecaping and greater validation and so forth and I love you so much mycah!
const isValidBlockStructure = function(block:Block): boolean {
	return typeof block.index ==='number'
		&& typeof block.hash ==='string'
		&& typeof block.previousHash ==='string'
		&& typeof block.timestamp ==='number'
		&& typeof block.data ==='string';
};

// I'm really liking typescript also. I especially think the function returns are cool
// they are quite cool, andwould make function testing significantly easier tbh

// yeah a proper bombardier fortypescirpt would be considerably more helpful
// as that's just what it does really

const isValidGenesis = function(proposedGenesis): boolean {
	return JSON.stringify(proposedGenesis)===JSON.stringify(genesisBlock);
}


// okay, now we have the tools we can make the valid chain functioer
//the IDE is also seriously helpful to ehlp me catch errors - that's not something js 
// has ever done for me!
const isValidChain = function(blocksToValidate: Block[]): boolean {
	if(!isValidGenesis(blocksToValidate[0])) {
		return false;
	}
	for (var i = 1; i< blocksToValidate.length; i++) {
		if(!isValidNewBlock(blocksToValidate[i],blocksToValidate[i-1])){
			return false;
		}
	}
	return true;
}

// in the chain there should always be one explicit blocks. in case of conflicts we always choose
// the longes tnumber of blocks
const replaceChain = function(newBlocks: Block[]): boolean {
	if(isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
		console.log('Received blockchain is valid. Replacing current blockchain');
		blockchain = newBlocks;
		broadcastLatest();
		return true;
	} else {
		console.log('Received blockchain failed');
		return false;
	}
};

const addBlockToChain = function(newBlock: Block): boolean {
	if(isValidNewBlock(newBlock, getLatestBlock())) {
		blockchain.push(newBlock);
		return true;
	}
	return false;
}

export {Block, getBlockchain, getLatestBlock, generateNextBlock, isValidGenesis, isValidBlockStructure, replaceChain, addBlockToChain };
// we also needto communicate with other nodees here over a network

// so we need to keep everyone in sync idealy (or at least all in a state where they can
// programatically agree eventally to sync to some solution)
// these are the rules we use to enforce this
// when a node generates a new block, it broadcasts it to hte network
// when a node connects to a new peer it querys for the latest block
// when a node encounters a block with an index larger than the current known block, it either
// adds the block to its chain, or querys for the full chain

// we communicate via websockets, and each node is a http server!