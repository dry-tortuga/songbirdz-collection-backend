const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");
const path = require("path");

const abiPath = path.join(__dirname, "../../artifacts/contracts/SongBirdz.sol");
const privatePath = path.join(__dirname, `../../private/${process.env.NODE_ENV}`);

const COLLECTION_NAME = "picasso";
const COLLECTION_NUMBER = 0;

// Load the contract ABI

const { abi } = JSON.parse(fs.readFileSync(`${abiPath}/SongBirdz.json`));

// Load the merkle tree

const merkleTree = StandardMerkleTree.load(JSON.parse(fs.readFileSync(
	`${privatePath}/collections/${COLLECTION_NAME}/tree.json`,
	"utf8",
)));

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

	console.log(`---- populating birds for the ${COLLECTION_NAME} collection ----`);

	console.log('Merkle Root:', merkleTree.root);

	// Publish the transaction
	const tx = await contract.publicGenerateBirds(COLLECTION_NUMBER, merkleTree.root);

	const receipt = await tx.wait();

	console.log(receipt);

	// The transaction is now on chain!
	console.log(`Tx=${receipt.hash} is mined in block ${receipt.blockNumber}`);

});

module.exports = {};
