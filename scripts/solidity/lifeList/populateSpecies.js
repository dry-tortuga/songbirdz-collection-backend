const fs = require("fs");
const path = require("path");

// Load the contract ABI

const abiPath = path.join(__dirname, "../../../artifacts/contracts/SongBirdzLifeList.sol");

const { abi } = JSON.parse(fs.readFileSync(`${abiPath}/SongBirdzLifeList.json`));

// Load the encoded data
const dataToUpload = JSON.parse(fs.readFileSync(path.join(
	__dirname,
	'../../../private/life-list-data/final.json'
)));

const TASK_NAME = "populateLifeListSpecies";
const TASK_DESCRIPTION = "Populate the 800 species for the SongBirdz Life List contract";

// Task action function receives the Hardhat Runtime Environment as second argument
task(TASK_NAME, TASK_DESCRIPTION, async (_, { ethers }) => {

	// Get the account used to sign the transaction
	const [signer] = await ethers.getSigners();

	// Get an instance of the contract
	const contract = await ethers.getContractAt(
		abi,
		process.env.LIFELIST_CONTRACT_ADDRESS,
		signer,
	);

	console.log(
		`---- populating ${process.env.NODE_ENV} species for the Life List ----`
	);

	for (let i = 0; i < dataToUpload.length; i++) {

		const species = dataToUpload[i];

		if (!species.colors1 ||
			!species.colors2 ||
			!species.pixels ||
			!species.birdIds ||
			species.birdIds.length === 0) {
			continue;
		}

		console.log(`--------------------- i=${i} ----------------------------`);

		console.log(species);

		// Publish the transaction
		const tx = await contract.publicGenerateSpecies(
			species.id,
			species.colors1,
			species.colors2,
			species.pixels,
			species.birdIds,
			species.name,
			species.family
		);

		const receipt = await tx.wait();

		// The transaction is now on chain!
		console.log(`Tx=${receipt.hash}, gas=${receipt.gasUsed}, is mined in block ${receipt.blockNumber}`);

		console.log('-------------------------------------------------------');

	}

	console.log('-------------------------------------------------------');

	const tx2 = await contract.publicMintLifeListRecord(0);

	const receipt2 = await tx2.wait();

	// The transaction is now on chain!
	console.log(`Tx=${receipt2.hash}, gas=${receipt2.gasUsed}, is mined in block ${receipt2.blockNumber}`);

	const tokenURI = await contract.tokenURI(0);

	console.log(tokenURI);

});

module.exports = {};
