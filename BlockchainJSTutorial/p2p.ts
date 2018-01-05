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
	publicc data: any;
}

// this sets up our websocket server - good ol' websocket library,
// the real question is what we do now tbh
const initP2PServer = function(port: number) {
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