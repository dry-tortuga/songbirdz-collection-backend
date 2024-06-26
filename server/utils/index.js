const debug = require("debug")("server");
const { ethers } = require("ethers");

const {	SONGBIRDZ_CONTRACT_ABI } = require("../constants");

const provider = new ethers.JsonRpcProvider(process.env.BASE_NETWORK_RPC_URL);

const contract = new ethers.Contract(
	process.env.SONGBIRDZ_CONTRACT_ADDRESS,
	SONGBIRDZ_CONTRACT_ABI.abi,
	provider,
);

// Store identification results locally in simple cache to
// speed-up lookup for birds that are already identified
const BIRD_ID_RESULTS = {};

const isBirdIdentified = async (id) => {

	// Check if the bird has already been successfully identified
	if (BIRD_ID_RESULTS[id]) {

		debug(`isBirdIdentified=true,id=${id},owner=hit`);
		return true;

	}

	try {

		// Fetch the owner data
		const owner = await contract.ownerOf(id);

		debug(`isBirdIdentified=true,id=${id},owner=${owner}`);

		// Store the result in the cache
		BIRD_ID_RESULTS[id] = true;

		return true;

	} catch (error) {
		// Does not have owner yet
	}

	debug(`isBirdIdentified=false,id=${id},owner=null`);

	return false;

};

module.exports = {
	isBirdIdentified,
};
