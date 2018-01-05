// okay, so this is where we write up the peer to peer server code
// this is actually going to be very itneresting to be honeset because it's websockets
// and stuff and I haev no idea how that works, so hopefully working through this code
// will give me some kind of idea?

import * as WebSocket from 'ws';
import {Server} from 'ws';

import {addBlockToChain, Block, getBlockchain, getLatestBlock, isValidBlockStructure, replaceChain} from './blockchain';

const sockets: WebSocket[] = [];

// our variable consts
enum MessageType {
QUERY_LATEST = 0,
QUERY_ALL = 1;,
RESPONSE_BLOCKCHAIN = 2,

};

class Message {
	public type: MessageType;
	public data: any;
}

// this sets up our websocket server - good ol' websocket library,
// the real question is what we do now tbh
const initP2PServer = function(port: number): void {
	const server: Server = new Websocket.Server({port: port});
	server.on('connection', function(ws: WebSocket) {
		initConnection(ws);
	});
	console.log('listening websocket p2p port on : ' + port);
};

const getSockets = function(): WebSocket[]{
	return sockets;
}

// this inits the connection by initialising a whole host of different stuff
const initConnection = function(ws: WebSocket) {
	sockets.push(ws);
	initMessageHandler(ws);
	initErrorHandler(ws);
	write(ws, queryChainLengthMsg());
};

// thi suses parametric types which is really cool. I'm really really liking typescript actually
// which is really fun to be hoenst. andcool in web server internals also

const JSONToObject = function<T>(data: string): T {
	try {
		return JSON.parse(data):
	} catch (e) {
		console.log('JSON parsing error: ' + e);
		return null;
	}
}

// so this does everything here to do our message handler, this whole protocol thing
// is very open and interesting generally even if not fully understandable at first
const initMessagehandler = function(ws: WebSocket): void {
	// so upon receiving a message
	ws.on('message', handleMessage);
	// this is very simple now I've extracted the message handling functoinality into it's own function
}


// basically this says that the message to the server can have three types
// done in an enum
// and that it handles them in a switch statement
// this is undoubtedly a better way than parsing a bunch of json first to figure out
// what to do with each mesasge
// so yeah, that's rather nice tbh
const handleMessage= function(data:string) {
		const message: Message = JSONToObject<Message>(data);
		if(message ===null) {
			console.log('could not parse received json message: ' + data);
			return;
		}
		console.log('received message: ' + JSON.stringify(message));
		switch(message.type) {
			case MessageType.QUERY_LATEST:
				write(ws, responseLatestMsg());
				break;
			case MessageType.QUERY_ALL:
				write(ws, responseChainMsg());
				break;
			case MessageType.RESPONSE_BLOCKCHAIN:
				const receivedBlocks: Block[] = JSONToObject<Block[]>(message.data);
				if(receivedBlocks===null) {
					console.log('invalid blocks received');
					console.log(message.data)
					break;
				}
				handleBlockchainResponse(receivedBlocks);
				break;
		}
	}

// some utility functoins

const write = function(ws: WebSocket, message: Message): void {
	ws.send(JSON.stringify(message));
}

const broadcast = function(message: Message): void {
	sockets.forEach(function(socket) {
		write(socket,message);
	});
}

const broadcastLatest = function(): void {
	broadcast(responseLatestMsg());
}
const connectToPeers = function(newPeer: String): void {
	/// set up new socket to new peer)
	const ws: WebSocket = new WebSocket(newPeer);
	ws.on('open', function() {
		initConnection(ws);
	})
	ws.on('error', function(){
		console.log('connectoin failed');
		initErrorHandler(ws);
	});
};

// these are our differet message responses to be sent over the web socket

const queryChainLengthMsg = function(): Message {
	return {'type': MessageType.QUERY_LATEST, 'data': null};
}

const queryAllMsg = function(): Message {
	return ({'type': MessageType.QUERY_ALL, 'data':null});
}

const responseChainMsg = function():Message {
	return ({'type': MessageType.RESPONSE_BLOCKCHAIN, 'data':JSON.stringify(getBlockchain())});
}

const responseLatestMsg = function(): Message {
	return ({
		'type': MessageType.RESPONSE_BLOCKCHAIN,
		'data': JSON.stringify([getLatestBlock()])
	});
}


const initErrorHandler = function(ws:WebSocket): void {
	const closeConnection = function(myws: WebSocket) {
		console.log('connection failed to peer: ' + myws.url);
		sockets.splice(sockets.indexOf(myws),1);
	};
	ws.on('close', function() {
		return closeConnection(ws);
	});
	ws.on('error', function() {
		return closeConnection(ws);
	});
}

const handleBlockchainResponse = function(receivedBlocks: Block[]) {
	if (receivedBlocks.length ===0) {
		console.log('received block chain size of 0, exiting');
		return;
	}
	const latestBlockReceived: Block = receivedBlocks[receivedBlocks.length-1];
	if(!isValidBlockStructure(latestBlockReceived)) {
		console.log('block structure not valid');
		return;
	}
	const latestBlockHeld: Block = getLatestBlock();
	if(latestBlockReceived.index > latestBlockHeld.index) {
		console.log('our blockchain might be behind. We are at' + latestBlockHeld.index.toString()
			+ 'they are at: ' + latestBlockReceived.index.toString());
		if(latestBlockHeld.hash === latestBlockReceived.previousHash) {
			if(addBlockToChain(latestBlockReceived)) {
				broadcast(responseLatestMsg());
			}
		} else if (receivedBlocks.length ===1) {
			console.log('we have to query chain from our peer');
			broadcast(queryAllMsg());
		} else {
			console.log('received blockchain is longerthan current blockchain');
			replaceChain(receivedBlocks);
		}
	} else {
		console.log('received blockchain is not longer than ours: do nothing');
		return;
	}
};


// so overall this doesn't actually seem that difficult, basicaly websockets handles everything for us
// we just receive messages and process them as the server requires and then send tem back
// it doesn't look to actually be that hard at all. maybe I should start doign everything in typescript
// and see if it is at all useful!
// I really like typescipt
// but also it's just really cool ! I don't actually know!

