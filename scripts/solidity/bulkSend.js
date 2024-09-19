const fs = require("fs");
const path = require("path");

const FROM_ADDRESS = process.env.LEDGER_HARDWARE_WALLET_PUB_KEY;

const destinations = [{
	to: "0x0000000000000000000000000000",
	tokenId: 2076,
}];

// Load the contract ABI

const { abi } = JSON.parse(fs.readFileSync(path.join(
	__dirname,
	"../../artifacts/contracts/SongBirdz.sol/SongBirdz.json")
));

// Create the hardhat task

const TASK_NAME = "bulkSend";
const TASK_DESCRIPTION = "Send ERC-721 tokens in bulk, i.e. \"transferFrom\" for the SongBirdz collection";

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

	for (let i = 0; i < destinations.length; i++) {

		console.log(`------------- i=${i} --------------`);

		const transferData = destinations[i];

		// Transfer the token from one account to the final destination
		const tx = await contract.transferFrom(
			FROM_ADDRESS,
			transferData.to,
			transferData.tokenId,
		);

		const receipt = await tx.wait();

		console.log(receipt);

		console.log('--------------------------------------');

	}

});

module.exports = {};
