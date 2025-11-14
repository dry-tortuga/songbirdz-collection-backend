const fs = require("fs");
const path = require("path");

const destFile = path.join(__dirname, "../../../server/constants/alreadyIdentified.json");

// Load the contract ABI

const { abi } = JSON.parse(fs.readFileSync(path.join(
	__dirname,
	'../../../artifacts/contracts/SongBirdz.sol/SongBirdz.json')
));

// Load the existing results from the file

const existingResults = JSON.parse(fs.readFileSync(path.join(
	__dirname,
	'../../../server/constants/alreadyIdentified.json')
));

const TASK_NAME = "fetchIdentifiedBirds";
const TASK_DESCRIPTION = "Fetch a list of all birds (IDs) that have been identified in the SongBirdz collection";

const START_INDEX = 6308;
const TOTAL_SUPPLY = 6313;

// Task action function receives the Hardhat Runtime Environment as second argument
task(TASK_NAME, TASK_DESCRIPTION, async (_, { ethers }) => {

	// Get the account used to sign the transaction
	const [signer] = await ethers.getSigners();

	// Get an instance of the contract
	const contract = await ethers.getContractAt(
		abi,
		process.env.SONGBIRDZ_CONTRACT_ADDRESS,
		signer,
	);

	const result = { ...existingResults };

	console.log(result);

	for (let i = START_INDEX; i < TOTAL_SUPPLY; i++) {

		// Fetch the token by index from the contract
		const tokenId = await contract.tokenByIndex(i);

		console.log(`i=${i},tokenId=${tokenId}`);

		result[tokenId] = true;

	}

	console.log(`Found ${Object.keys(result).length} identified birds!`);

	// Store the final JSON data

	fs.writeFileSync(destFile, JSON.stringify(result), (err) => {
		if (err) {
			throw err;
		}
	});

});

module.exports = {};
