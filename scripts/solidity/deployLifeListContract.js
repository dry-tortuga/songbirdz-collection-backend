const fs = require("fs");
const { ethers } = require("hardhat");

// Load the contract ABI

const { abi } = JSON.parse(fs.readFileSync("./artifacts/contracts/SongBirdzLifeList.sol/SongBirdzLifeList.json"));

async function main() {

	const [deployer] = await ethers.getSigners();

	const owner = deployer.address;

	console.log("---------------------------------------------------------------")

	console.log(`Deploying LifeList contract with account=${owner}...`);

	const tx = await ethers.deployContract("SongBirdzLifeList", [owner]);

	await tx.waitForDeployment();

	console.log(`SongBirdz contract with owner=${owner} deployed to ${tx.target}!`);

	// Get an instance of the contract
	const contract = await ethers.getContractAt(
		abi,
        tx.target,
		deployer,
	);

	// Add 2 birds
	await contract.publicGenerateSpecies(0, 2, 1, 0, 3, 0, "Atlantic Puffin");
	await contract.publicGenerateSpecies(1, 0, 1, 2, 3, 2, "Rockhopper Penguin");

	// Set the URL for the audio file
	const result0 = await contract.tokenURI(0);

	console.log(result0);

	// Set the URL for the audio file
	const result1 = await contract.tokenURI(1);

	console.log(result1);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
