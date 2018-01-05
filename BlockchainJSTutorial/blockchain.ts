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
import {hexTobinary} from './util';

class Block {
	public index: number;
	public hash: string;
	public previousHash: string;
	public timestamp: number;
	public data: string;
	public difficulty: number;
	public nonce: number;

	constructor(index: number, hash: string, previousHash: string,
	 timestamp: number, data:string, difficulty: number, nonce: number) {
		this.index = index;
		this.previousHash = previousHash;
		this.timestamp = timestamp;
		this.data = data;
		this.hash = hash;
		this.difficulty = difficulty;
		this.nonce = nonce;
	}

	// we have a functoin which calculates the has for us

}

// a function to calcualte the hash of a block
const calculateHash = function(index: number, previousHash: string, timestamp: number, data: string, difficulty: number, nonce: number): string {
		CryptoJS.SHA256(index + previousHash + timestamp + data + difficulty + nonce).toString();
	}

// this is our first ever block, programmatically created!
const genesisBlock: Block = new Block(
	0,'816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7',null, 1465154705, "my genesis block!!",0,0);


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



// now we add the proof of work, the none to the thing

// basically our very simple proof of work task is to giuess at hashes randomly
// and find one with the requisite number of zeros - but it must be a valid hash
// I don't understand what's to stop us randoly submitting a hash like object directly
// is there a way to stop that?
// ah I get it, that's what the nonce is for. So basicaly we need to loop through nonces
// to find a hash, and then anyone given the block has the nonce and can then recreate the hash to check it
// but what's to stop us simply reusing nonces. there must be a rule somewhere saying it's not allowed
// or perhaps we need to have a nonce greater than the previous nonce, thus guaranteeing an upward climb?


const hashMatchesDifficulty = function(hash: string, difficulty:number): boolean {
	const hashInBinary:string = hexToBinary(hash);
	var str: string = "";
	for (var i = 0; i<difficulty; i++) {
		str +="0";
	}
	const requiredPrefix: string = str;
	return hashInBinary.startsWith(requiredPrefix);

}

// in any case, our work function on the nonces is as follows
const findBlock = function(index: number, previousHash: string, timestamp: number, data: string,
					difficulty: number): Block {
	var nonce =0;
	while(true) {
		const hash: string = calculateHash(index, previousHash, timestamp,data, difficulty, nonce);
		if(hashMatchesDifficulty(hash, difficulty)) {
			return new Block(index, hash, previousHash, timestamp, data,difficulty,nonce);
		}
		nonce ++;
	}
}

// now we can find a block we need some way for everyone to coordinate on the dfificulty
// so this isvery hard

// we need soem rules. let's define this as follow - we need some generally agreed constant

const BLOCK_GENERATION_INTERVAL = 1000;
const DIFFICULTY_ADJUSTMENT_INTERVAL = 50;

// so basically we adjust the difficulty as follows: whenever we receive a block upadte
// we calculate the dificuly and see what's up there and we either increase the difficulty by one if time taken is at least two times greater or smaller

// so this is the code - and we calcualte it by block generatoin interval * block difficulty adjustment interval


const getDifficulty = function(aBlockchain: Block[]): number {
	const latestBlock: Block = aBlockchain[aBlockchain.length-1];
	if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL ===0 && latestBlock.index!==0) {
		return getAdjustedDifficulty(latestBlock, aBlockchain);
	} else {
		return latestBlock.difficulty;
	}
};

const getAdjustedDifficulty = function(latestBlock: Block, aBlockchain: Block[]): number {
	const prevAdjustmentBlock: Block = aBlockchain[blockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
	const timeExpected: number = BLOCK_GENERATION_INTERVAL* DIFFICULTY_ADJUSTMENT_INTERVAL;
	const timeTaken: number = latestBlock.timestamp - prevAdjustmentBlock.timestamp;
	if(timeTaken < timeExpected/2) {
		return prevAdjustmentBlock.difficulty +1;
	} else if (timeTaken > timeExpected *2 ){
		return prevAdjustmentBlock.difficulty -1;
	} else {
		return prevAdjustmentBlock.difficulty;
	}
};
// the trouble is that we are using timestamps for these difficulty calculations 
// and currently they are entirely arbitrary and hackable. we need to verifythem somehow
// and we do this in a simple brute force way by not accepting a timestamp more than 1 min in the future
// from the time we perceive - i.e. not more than 1 min in the future or past of the previous block

// this implements that
const isTimestampValid = function(newBlock: Block, previousBlock: Block): boolean {
	return (previousBlock.timestamp - 60 < newBlock.timestamp) && (newBlock.timestamp -60 < getCurrentTimestamp());
};

const getCurrentTimestamp = function(): number {
	return getLatestBlock().timestamp;
}



// we also want to adjust things so that it's thecumulative difficulty ofthe total blockchain submitted that matters
// and not the simple length, since that is easier with loer difficulty

// here's a function to do that

const getCumulativeDifficulty = function(chain: Block[]): number {
	if(chain.length<=0) {
		console.log('invalid chain found length <=0');
		return 0;
	}
	var total = 0;
	for (var i = 0; i< chain.length; i++) {
		const hash = chain[i].hash;
		const diff = chain[i].difficulty;
		if(hashMatchesDifficulty(hash, diff)) {
			total += 2^diff;

		} else {
			console.log('invalid hash/difficulty found!');
			return -1;
		}
	}
	return total;
}

export {Block, getBlockChain, getLatestBlock, generateNextBlock, isValidGenesis, isValidBlockStructure, replaceChain, addBlockToChain };
// we also needto communicate with other nodees here over a network

// so we need to keep everyone in sync idealy (or at least all in a state where they can
// programatically agree eventally to sync to some solution)
// these are the rules we use to enforce this
// when a node generates a new block, it broadcasts it to hte network
// when a node connects to a new peer it querys for the latest block
// when a node encounters a block with an index larger than the current known block, it either
// adds the block to its chain, or querys for the full chain

// we communicate via websockets, and each node is a http server!

