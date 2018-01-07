// okay, so now we implement mining and stuff
// basically whenever a transaction is sent, it's not included in the blockchain but in a pool
// and then when blocks are mined hopefully it will be done in the thing
// so let's do that idk

// we simply implement this as a list of all transaction we know baout

var transactionPool: Transaction[] = [];
// we add a transaction to the poool here

const sendTransaction = function(address: string, amount: number): Transaction {
	const tx: Transaction = createTransaction(address, amount, getPrivateFromWallet(), getUnspentTxOuts(), getTransactionPool());
	addToTransactionPool(tx, getUnspentTxOuts());
	return tx;
}

// so we need to check if a transaction is valid for the pool
// so basically we add that it can't be added if any of the transaction inputs are already
// in the pool

const isValidTxForPool = (tx: Transaction, aTtransactionPool: Transaction[]): boolean => {
    const txPoolIns: TxIn[] = getTxPoolIns(aTtransactionPool);

    const containsTxIn = (txIns: TxIn[], txIn: TxIn) => {
        return _.find(txPoolIns, (txPoolIn => {
            return txIn.txOutIndex === txPoolIn.txOutIndex && txIn.txOutId === txPoolIn.txOutId;
        }))
    };

    for (const txIn of tx.txIns) {
        if (containsTxIn(txPoolIns, txIn)) {
            console.log('txIn already found in the txPool');
            return false;
        }
    }
    return true;
};

// we now need a way from the unconfirmed transaction to find it's way from local pool to block
// mined by the same node, so basically when a node starts to mine
// it includes transaction pools to new candidate

const generateNextBlock() {
	const coinbaseTx: Transaction = getCoinbaseTransaction(getPublicFromWallet(),getLatestBlock().index + 1);
	const blockdata: Transaction[] = [coinbaseTx].concat(getTransactoinPool());
	return generateRawNextBlock(blockdata);
};

// we also need to update the transaction pool
const updateTransactionPool = (unspentTxOuts: UnspentTxOut[]) => {
    const invalidTxs = [];
    for (const tx of transactionPool) {
        for (const txIn of tx.txIns) {
            if (!hasTxIn(txIn, unspentTxOuts)) {
                invalidTxs.push(tx);
                break;
            }
        }
    }
    if (invalidTxs.length > 0) {
        console.log('removing the following transactions from txPool: %s', JSON.stringify(invalidTxs));
        transactionPool = _.without(transactionPool, ...invalidTxs)
    }
};