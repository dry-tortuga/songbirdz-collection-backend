const fs = require("fs");
const path = require("path");

const destFile = path.join(__dirname, "../../../../sounds-of-summer-2024/constants/allowListInput.json");

// Load the contract ABI

const { abi } = JSON.parse(fs.readFileSync(path.join(
	__dirname,
	'../../../artifacts/contracts/SongBirdz.sol/SongBirdz.json')
));

// Load the existing results

const existingResults = JSON.parse(fs.readFileSync(destFile));

const addresses = existingResults.addresses;

const TASK_NAME = "fetchHolders";
const TASK_DESCRIPTION = "Fetch a list of all holders for the SongBirdz collection";

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

	const foundAdresses = {};

	const allowListJSON = { addresses };

	for (let i = 0; i < 10000; i++) {

		// Fetch the token by index from the contract
		const tokenId = await contract.tokenByIndex(i);

		// Fetch the owner from the contract
		const result = await contract.ownerOf(tokenId);

		const alreadyLogged = allowListJSON.addresses.includes(result);

		console.log(`i=${i},tokenId=${tokenId},exists=${alreadyLogged}`);

		if (!alreadyLogged) {
			allowListJSON.addresses.push(result);
		}

	}

	console.log(`Found ${allowListJSON.addresses.length} unique holders!`);

	// Store the final JSON data

	fs.writeFileSync(destFile, JSON.stringify(allowListJSON), (err) => {
		if (err) {
			throw err;
		}
	});

});

module.exports = {};
