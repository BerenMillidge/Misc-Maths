// we needto control our node. this is done by setting up a http server
// so let's do this now

// we set up a very simple express server

import * as bodyParser from 'body-parser';
import * as express from 'express';

import {Block, generateNextBlock, getBlockchain} from './blockchain';
import {connectToPeers, getSockets, initP2PServer} from '/p2p';

const port: number = parseInt(process.env.HTTP_PORT) || 3001;
const p2pPort: number = parseInt(process.env.P2P_PORT) || 6001;

const initHttpServer = function(myPort: number) {
	const app = express();

	app.use(bodyParser.json());

	app.get('/blocks', function(req, res) {
		res.send(getBlockchain())
	});

	app.post('/mineBlock', function(req, res) {
		const newBlock: Block = generateNextBlock(req.body.data);
		res.send(newBlock);
	});
	app.get('/peers', (req, res) => {
        res.send(getSockets().map(( s: any ) => s._socket.remoteAddress + ':' + s._socket.remotePort));
});
	app.post('/addPeer', function(req,res) {
		connectToPeers(req.body.peer);
		res.send();
	});

	app.listen(myPort, function() {
		console.log('listeneing http on port' + myPort);
	});
	// we also need to add a api point on the server to actually send a transaction via the wallet

	app.post('/mineTransaction', function(req, res) {
		const address = req.body.address;
		const amount = req.body.amount;
		const resp = generateNextBlockWithTransaction(address, amount);
		res.send(resp);
	});

	// we also have a new endpoint which sends a transaction to our local trnsaction pool based on existing walled functoinality

	app.post('/sendTransaction', function(req, res) {
		// do stuff here
	})
};

initHttpServer(port);
initP2PServer(p2pPort);


