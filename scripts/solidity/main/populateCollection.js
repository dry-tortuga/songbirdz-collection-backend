const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");
const path = require("path");

const abiPath = path.join(__dirname, "../../../artifacts/contracts/SongBirdz.sol");
const privatePath = path.join(__dirname, `../../../private/${process.env.NODE_ENV}`);

let COLLECTIONS_TO_POPULATE = [{
	name: "picasso-genesis-0",
	number: 0,
	merkleTreeRoot: "0x5eb5e6c29aeeeca6d18591b5857bb3732385b031b324a4a7e5ce0d93be4f2b96",
}, {
	name: "deep-blue-1",
	number: 1,
	merkleTreeRoot: "0x0fd31aa0cf9ce48e13dd99ecda792226242ce7c5e98bf99fc19c124f815b67db",
}, {
	name: "small-and-mighty-2",
	number: 2,
	merkleTreeRoot: "0xa0f7b9e7f1e8429b619ed5656b695085e10244be698636097f519ea4e789777e",
}, {
	name: "night-and-day-3",
	number: 3,
	merkleTreeRoot: "0xc5a013e8cdd4cdeb9179693293f7aca4047af04aa941dacf12a5347fc0b09477",
}, {
	name: "fire-and-ice-4",
	number: 4,
	merkleTreeRoot: "0x7d91627265e4a50df86e7b074cab652f298ab617b65c1f0a3a149aa786a1d504",
}, {
	name: "predator-and-prey-5",
	number: 5,
	merkleTreeRoot: "0xa28dd33ab13f6eaf5f28a9d444ed2b9ae3fd3be437babede46ed9266e9e7b82c",
}, {
	name: "love-birds-6",
	number: 6,
	merkleTreeRoot: "0x1119ce5125d4ccc90d4d8a21139b87ec4e168c711b68e90772537a0a5cd40a7e",
}, {
	name: "hatchlings-7",
	number: 7,
	merkleTreeRoot: "0xda2070ef627da6f6395a1a7c08cd115d7d2d0aa83456cf90d2cc52077e2bb36f",
}, {
	name: "masters-of-disguise-8",
	number: 8,
	merkleTreeRoot: "0x96931597d1e46bf69bad810d9aba52eb71b2353cb1451ba6c2823632c0116572",
}, {
	name: "final-migration-9",
	number: 9,
	merkleTreeRoot: "0x386ddd7d8be8918468d64f7c72b21c90ecaef6d835263c939eb229d32db72f8c",
}];

if (process.env.NODE_ENV === 'production') {
	COLLECTIONS_TO_POPULATE = [COLLECTIONS_TO_POPULATE.pop()];
}

// Load the contract ABI

const { abi } = JSON.parse(fs.readFileSync(`${abiPath}/SongBirdz.json`));

const TASK_NAME = "populateMainCollection";
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

		console.log(
			`---- populating ${process.env.NODE_ENV} birds for the ${collection.name} collection ----`
		);

		// Load the merkle tree

		const merkleTree = StandardMerkleTree.load(JSON.parse(fs.readFileSync(
			`${privatePath}/collections/${collection.name}/tree.json`,
			"utf8",
		)));

		console.log('Collection Number:', collection.number);
		console.log('Merkle Root:', merkleTree.root);

		if (merkleTree.root !== collection.merkleTreeRoot) {
			throw new Error(`Invalid value=${merkleTree.root} for the merkle tree root!`);
		}

		// Publish the transaction
		const tx = await contract.publicGenerateBirds(collection.number, merkleTree.root);

		const receipt = await tx.wait();

		// The transaction is now on chain!
		console.log(`Tx=${receipt.hash}, gas=${receipt.gasUsed}, is mined in block ${receipt.blockNumber}`);

		console.log('--------------------------------------------------');

	}

});

module.exports = {};
