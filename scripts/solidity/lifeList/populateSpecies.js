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
		"0x386024000000E6453921181BF5FFE88F4D573D2936CF752B0000000000000000",
		"0xDFE0E80000000000000000000000000000000000000000000000000000000000",
		"0x0000000000000000011111111222111001111111234251100111111123355660011111122552211001111115222211100111155525225110011155555252211001115555525221100115555552722110015555552777511005555222777711100112277777711110011118111811111001111181118111100000000000000000",
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
		"Atlantic Puffin",
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
