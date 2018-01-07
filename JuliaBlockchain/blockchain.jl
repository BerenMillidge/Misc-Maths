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

