const fs = require("fs");
const path = require("path");

// Load the contract ABI

const abiPath = path.join(__dirname, "../../../artifacts/contracts/SongBirdzLifeList.sol");

const { abi } = JSON.parse(fs.readFileSync(`${abiPath}/SongBirdzLifeList.json`));

// Load the encoded data
//const dataToUpload = JSON.parse(fs.readFileSync(path.join(
//	__dirname,
//	'../../../private/life-list-data/species-parsed.json'
//)));

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

	const speciesId = 0;

	const tx = await contract.publicGenerateSpecies(
		speciesId,
		"0x000000AD2F451B1F21F5FFE8A3A7C2DFE0E82C354D0000000000000000000000",
		"0x0000000000000000000000000111000000000000112310000000000011221444000000001111100000000001111100000000002225111000000002222251100000002222225510000002322222552000000233222255000000223332255500002222233555500000000225555200000000000600600000000000066066000000",
		[1, 2, 3, 4, 5],
		"Red-bellied Woodpecker",
	);

	const receipt = await tx.wait();

	// The transaction is now on chain!
	console.log(`Tx=${receipt.hash}, gas=${receipt.gasUsed}, is mined in block ${receipt.blockNumber}`);

	console.log('-------------------------------------------------------');

	const tx2 = await contract.publicMintLifeListRecord(0);

	const receipt2 = await tx2.wait();

	// The transaction is now on chain!
	console.log(`Tx=${receipt2.hash}, gas=${receipt2.gasUsed}, is mined in block ${receipt2.blockNumber}`);

	const tokenURI = await contract.tokenURI(0);

	console.log(tokenURI);

	/*
	for (let i = 0; i < dataToUpload.length; i++) {

		console.log(`--------------------- i=${i} ----------------------------`);

		const trophy = dataToUpload[i];

		console.log(trophy);

		// Publish the transaction
		const tx = await contract.publicGenerateTrophy(
			trophy.to,
			trophy.place,
			trophy.points,
			trophy.colors1,
			trophy.colors2,
			trophy.pixels,
			trophy.name,
			trophy.season,
			trophy.species
		);

		const receipt = await tx.wait();

		// The transaction is now on chain!
		console.log(`Tx=${receipt.hash}, gas=${receipt.gasUsed}, is mined in block ${receipt.blockNumber}`);

		console.log('-------------------------------------------------------');

	}
	*/

});

module.exports = {};
