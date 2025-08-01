const fs = require("fs");
const path = require("path");

// Load the contract ABI

const abiPath = path.join(__dirname, "../../../artifacts/contracts/SongBirdzLifeList.sol");

const { abi } = JSON.parse(fs.readFileSync(`${abiPath}/SongBirdzLifeList.json`));

// Load the encoded data
/*
const dataToUpload = JSON.parse(fs.readFileSync(path.join(
	__dirname,
	'../../../private/development/hof-data.json'
)));
*/

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

	const tx = await contract.publicGenerateSpecies(
		0,
		2,
		1,
		0,
		3,
		0,
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		"Atlantic Puffin",
	);

	const receipt = await tx.wait();

	// The transaction is now on chain!
	console.log(`Tx=${receipt.hash}, gas=${receipt.gasUsed}, is mined in block ${receipt.blockNumber}`);

	console.log('-------------------------------------------------------');

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
