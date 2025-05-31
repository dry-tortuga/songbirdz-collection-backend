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

	for (let i = 0; i < dataToUpload.length; i++) {

		console.log(`--------------------- i=${i} ----------------------------`);

		const trophy = dataToUpload[i];

		// Publish the transaction
		const tx = await contract.publicGenerateTrophy(
			// trophy.to,
			'0x2d437771f6fbedf3d83633cbd3a31b6c6bdba2b1',
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

		/*

		// Get the token ID from the transaction receipt
		const tokenId = receipt.logs[0].topics[3]; // Transfer event tokenId is typically the 4th topic

		// Get the tokenURI
		const tokenURI = await contract.tokenURI(tokenId);

		// Write tokenURI to file
		const outputPath = path.join(__dirname, `../../../private/development/${i}.json`);
		fs.writeFileSync(outputPath, JSON.stringify({ tokenURI }, null, 2));

		*/

		// The transaction is now on chain!
		console.log(`Tx=${receipt.hash}, gas=${receipt.gasUsed}, is mined in block ${receipt.blockNumber}`);

		console.log('-------------------------------------------------------');

	}

});

module.exports = {};
