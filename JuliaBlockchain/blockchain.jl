#hello

#okay, this is a very quick test of a basic blockchain in julia
# for educational purpoess probably

#first we set up our types

abstract type CryptoPrimitive end

abstract type Hash <: CryptoPrimitive end
abstract type MAC <: CryptoPrimitive end
abstract type Signature <: CryptoPrimitive end

abstract type AbstractBlockChain end
abstract type AbstractBlock end

abstract type AbstractGenesisBlock <: AbstractBlock end

abstract type AbstractBlockData end
abstract type AbstractMessage <:AbstractBlockData end

primitive type 256Hash <: Hash 256 end
primitive type 512Hash <: Hash 512 end

primitive type 256MAC <: MAC 256 end
primitive type 512MAC <: MAC 512 end

primitive type 256Signature <: Signature end
primitive type 512Signature <: Signature end

#now for our more complex types

const genesis_message = "This is how the world begins: not with a whimper, but with a bang!"

type Blockchain <: AbstractBlockChain
	blocks:: Array{AbstractBlock}
	timeCreated:: Date
	Description:: AbstractString
	id:: Hash
	sig:: Signature
	MAC:: MAC
end

type Block <: AbstractBlock
	index:: Integer
	hash:: Hash
	previousHash:: Hash
	timestamp:: Date
	data:: Array{Message}
	difficulty:: Integer
	nonce:: Integer


	function Block(index, hash, previousHash, timestamp, data, difficulty, nonce)
		return new(index, hash, previousHash, timestamp, data, difficulty,nonce)
	end

end

type GenesisBlock <: AbstractGenesisBlock
	index:: Integer
	hash:: Hash
	previousHash:: Hash
	timestamp:: Date
	data::Array{Message}
	difficulty:: Integer
	nonce:: Integer

	function GenesisBlock()
		const genesis_message = getGenesisMessage()
		index = 0
		data = Message(0, genesis_message)
		difficulty = 0
		nonce = 0
		previousHash = Hash(0)
		timestamp = 1 # pass
		hash=  caluclate_hash(index, data[0].data, difficulty, nonce, previousHash, timestamp)
		return new(index, hash, previousHash, timestamp, data, difficulty, nonce)
	end
end



type Message <: AbstractMessage
	id:: AbstractString
	data:: AbstractString
	MAC:: MAC

	function Message(id:: Integer, data::AbstactString)
		mac = calculate_MAC(id, data)
		return new(id, data, mac)
	end
	function Message(id:: Integer, data::AbstractString, encrypt_func:: function) {
		encrypt_data = encrypt_func(data)
		mac = calculate_MAC(id, encrypt_data)
		return new(id, encrypt_data, mac)
	end

	function Message(data)
		id = calculate_id()
		mac = calculate_MAC(id, data)
		return new(id, data, mac)
	end
	function Message(data, encrypt_func:: function)
		id = calculate_id()
		encrypt_data = encrypt_func(data)
		mac = calculate_MAC(id, encrypt_data)
		return new(id, encrypt_data, mac)
	end

end


function calculate_hash(inputs) 
	# so originally we're going to d something here
	# but I don't know how
	#either use a crypto implementation or roll our own
	# so now we're just going to return
	return inputs
	end

function calculate_MAC(id, data)
	#no idea how to implement this either
	return MAC()
end


function getGenesisMessage()
	return genesis_message
end
# okay, now we do operations on the block chain and functoins thereby

function getLatestBlock(blockchain:: AbstractBlockChain)
	return blockchain.blocks[-1]
end

function getBlocks(blockchain:: AbstractBlockChain)
	return blockchain.blocks
end

function generateNextBlock(blockchain:: AbstractBlockChain, blockData:: Array{Message})
	prevBlock = getLatestBlock(blockchain)
	nextIndex = prevBlock.index +1
	timestamp = getDateTime()
	nextHash = calculate_hash((nextIndex, prevBlock.hash,timestamp, blockData))
	difficulty = getDifficulty()
	nonce = getNonce()
	newBlock = Block(index, hash, previousHash, timestamp, blockData, difficulty,nonce)
	return newBlock
end


function getDateTime()
	Error("not implemented yet")
end

function getDifficulty()
	Error("not implemented yet")
end

function getNonce()
	Error("not implemented yet")
end



function isValidBlock(block:: AbstractBlock, prevBlock::AbstractBlock)
	if prevBlock.index +1 != block.index
		Error('New block index does not match')
		return false
	end
	if block.previousHash != prevBlock.hash
		Error('Block previous hash does not match')
		return false
	end
	if calculateHash(block) != block.hash
		Error('Block hash invalid')
		return false
	end
	if !isValidTimestamp(block.timestamp, prevBlock.timestamp)
		Error('Block timestamp is invalid')
		return false
	end
	return true
end

function isValidGenesis(proposedGenesis:: AbstractGenesisBlock)
	if proposedGenesis.index != 0
		Error('Genesis does not start at 0')
		return false
	end
	if proposedGenesis.hash != calculate_hash(getGenesisMessage())
		Error('Genesis block hash invalid')
		return false
	end
	if proposedGenesis.previousHash != Hash(0)
		Error('Genesis block previous hash invalid')
		return false
	end
	#we might need to validate timestamp, but not sure how
	return true
end

function validateBlockChainBlocks(blocks:: Array{AbstractBlock})
	len = lengh(blocks)
	if !isValidGenesis(blocks[0])
		return false
	end
	for i in 1:len
		if !isValidBlock(blocks[i], blocks[i-1])
			return false
		end
	end
	return true
end

function validateBlockChainProperties(blockchain:: AbstractBlockChain)
	#need to implement properly
	return true
end

function validateBlockChain(blockchain:: AbstractBlockChain)
	return validateBlockChainProperties(blockchain) && validateBlockChainBlocks(blockchain.blocks)
end


function addBlockToChain(blockchain:: AbstractBlockChain, block:: AbstractBlock)
	#do we assume chain is valid here - we might as well
	if !isValidBlock(block, getLatestBlock(blockchain))
		Error('Tried to add invalid block')
		return false
	end
	push!(blockchain.blocks, block)
	# we may need to recalibrate the MAC or something of the chain
	# if so do that here!
	return true
end


function calculateBlockchainSignature(blockchain<: AbstractBlockChain)
	#we're not sure how to implement that AbstractMessage
	# so instead we're just filling this with a placeholder
	return blockchain.Signature
end

# get the cumulative difficulty of a blockchain to see if it works!
function getCumulativeDifficulty = function(blockchain:: AbstractBlockChain)
	blocks = blockchain.blocks
	if length(blocks) <=0
		Error('Blockchain has no length!')
	end
	total = 0
	for block in blocks
		hash = block.hash
		diff = block.difficulty
		if hashMatchesDifficulty(hash, diff)
			total += 2**diff
		end
	else
		Error('not matching hash/difficulty found')
		return -1
	end
	return total
end

function getDifficulty(blockchain:: AbstractBlockChain, difficulty_adjustment_interval, block_generation_interval)
	latestBlock = getLatestBlock(blockchain)
	if latestBlock.index % difficulty_adjustment_interval ==0 && latestBlock.index>=0
		return getAdjustedDifficulty(latestBlock, blockchain,difficulty_adjustment_interval,block_generation_interval)
	end
	return latestBlock.difficulty
end



function getAdjustedDifficulty(latestBlock:: AbstractBlock, blockchain::AbstractBlockChain, difficulty_adjustment_interval, block_generation_interval)
	const blockTimeAdjustmentFactor = 2
	blocks = blockchain.blocks
	prevAdjustmentBlock = blocks[length(blocks)-difficulty_adjustment_interval]
	timeExpected = block_generation_interval* difficulty_adjustment_interval
	if isValidTimestamp(latestBlock) && isValidTimestamp(prevAdjustmentBlock)
		timeTaken = latestBlock.timestamp - prevAdjustmentBlock.timestamp
		if timeTaken < timeExpected /blockTimeAdjustmentFactor
			return prevAdjustmentBlock.difficulty +1
		end
		if timeTaken > timeExpected * blockTimeAdjustmentFactor
			return prevAdjustmentBlock.difficulty -1
		end
		return prevAdjustmentBlock.difficulty
	Error('One of the block timestamps is not valid')
end