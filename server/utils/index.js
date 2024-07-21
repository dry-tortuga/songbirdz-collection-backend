const debug = require("debug")("server");
const { ethers } = require("ethers");

const { SONGBIRDZ_CONTRACT_ABI } = require("../constants");

const provider = new ethers.JsonRpcProvider(process.env.BASE_NETWORK_RPC_URL);

const contract = new ethers.Contract(
	process.env.SONGBIRDZ_CONTRACT_ADDRESS,
	SONGBIRDZ_CONTRACT_ABI.abi,
	provider,
);

const isBirdIdentified = async (id, cachedResults) => {

	// Check if the bird's collection has been 100% identified as a whole
	if (id <= 1999) {
		debug(`isBirdIdentified=true,id=${id},collection=100%`);
		return true;
	}

	// Check if the bird has already been successfully identified
	if (cachedResults[id]) {

		debug(`isBirdIdentified=true,id=${id},owner=hit`);
		return true;

	}

	try {

		// Fetch the owner data
		const owner = await contract.ownerOf(id);

		debug(`isBirdIdentified=true,id=${id},owner=${owner}`);

		// Store the result in the cache
		cachedResults[id] = true;

		return true;

	} catch (error) {
		// Does not have owner yet
	}

	debug(`isBirdIdentified=false,id=${id},owner=null`);

	return false;

};

module.exports = { isBirdIdentified };
