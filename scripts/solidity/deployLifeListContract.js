const fs = require("fs");
const { ethers } = require("hardhat");

// Load the contract ABI

const { abi } = JSON.parse(fs.readFileSync("./artifacts/contracts/SongBirdzLifeList.sol/SongBirdzLifeList.json"));

async function main() {

	const [deployer] = await ethers.getSigners();

	const owner = deployer.address;

	/*

	console.log("---------------------------------------------------------------")

	console.log(`Deploying LifeList contract with account=${owner}...`);

	const tx = await ethers.deployContract("SongBirdzLifeList", [owner]);

	await tx.waitForDeployment();

	console.log(`SongBirdz contract with owner=${owner} deployed to ${tx.target}!`);

	*/

	// Get an instance of the contract
	const contract = await ethers.getContractAt(
		abi,
	    '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
		deployer,
	);

	// Set the URL for the audio file
	const tx1 = await contract.tokenURI(0);

	const receipt1 = await tx1.wait();

	console.log(receipt1);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
