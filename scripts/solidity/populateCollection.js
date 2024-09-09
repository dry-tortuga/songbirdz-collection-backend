const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");
const path = require("path");

const abiPath = path.join(__dirname, "../../artifacts/contracts/SongBirdz.sol");
const privatePath = path.join(__dirname, `../../private/${process.env.NODE_ENV}`);

const COLLECTIONS_TO_POPULATE = [{
	name: "picasso",
	number: 0,
	merkleTreeRoot: "0x5eb5e6c29aeeeca6d18591b5857bb3732385b031b324a4a7e5ce0d93be4f2b96",
}, {
	name: "waterfowl-1",
	number: 1,
	merkleTreeRoot: "0x0fd31aa0cf9ce48e13dd99ecda792226242ce7c5e98bf99fc19c124f815b67db",
}, {
	name: "small-and-mighty-2",
	number: 2,
	merkleTreeRoot: "0xa0f7b9e7f1e8429b619ed5656b695085e10244be698636097f519ea4e789777e",
}, {
	name: "night-and-day-3",
	number: 3,
	merkleTreeRoot: "TBD",
}];

// Load the contract ABI

const { abi } = JSON.parse(fs.readFileSync(`${abiPath}/SongBirdz.json`));

const TASK_NAME = "populateCollection";
const TASK_DESCRIPTION = "Populate a collection of birds in the SongBirdz contract";

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

	for (let i = 0; i < COLLECTIONS_TO_POPULATE.length; i++) {

		const collection = COLLECTIONS_TO_POPULATE[i];

		console.log(`---- populating birds for the ${collection.name} collection ----`);

		// Load the merkle tree

		const merkleTree = StandardMerkleTree.load(JSON.parse(fs.readFileSync(
			`${privatePath}/collections/${collection.name}/tree.json`,
			"utf8",
		)));

		console.log('Merkle Root:', merkleTree.root);

		if (merkleTree.root !== collection.merkleTreeRoot) {
			throw new Error(`Invalid value=${merkleTree.root} for the merkle tree root!`);
		}

		// Publish the transaction
		const tx = await contract.publicGenerateBirds(collection.number, merkleTree.root);

		const receipt = await tx.wait();

		console.log(receipt);

		// The transaction is now on chain!
		console.log(`Tx=${receipt.hash} is mined in block ${receipt.blockNumber}`);

	}

});

module.exports = {};
