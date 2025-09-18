const fs = require("fs");
const path = require("path");

// Load the contract ABI

const abiPath = path.join(__dirname, "../../../artifacts/contracts/SongBirdzHOF.sol");

const { abi } = JSON.parse(fs.readFileSync(`${abiPath}/SongBirdzHOF.json`));

// Load the encoded data

const dataToUpload = JSON.parse(fs.readFileSync(path.join(
	__dirname,
	'../../../private/development/hof-data.json'
)));

const TASK_NAME = "populateHOFCollection";
const TASK_DESCRIPTION = "Populate the HOF trophies for the SongBirdz contract";

const START_INDEX = 12;
const END_INDEX = dataToUpload.length;

// Task action function receives the Hardhat Runtime Environment as second argument
task(TASK_NAME, TASK_DESCRIPTION, async (_, { ethers }) => {

	// Get the account used to sign the transaction
	const [signer] = await ethers.getSigners();

	// Get an instance of the contract
	const contract = await ethers.getContractAt(
		abi,
		process.env.HOF_CONTRACT_ADDRESS,
		signer,
	);

	console.log(
		`---- populating ${process.env.NODE_ENV} trophies for the Hall of Fame ----`
	);

	for (let i = START_INDEX; i < END_INDEX; i++) {

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

		const tokenURI = await contract.tokenURI(i);

		console.log(tokenURI);

		console.log('-------------------------------------------------------');

	}

});

module.exports = {};
