const fs = require("fs");
const { ethers } = require("hardhat");
const path = require("path");

// Load the contract ABI

const { abi } = JSON.parse(fs.readFileSync("./artifacts/contracts/SongBirdzHOF.sol/SongBirdzHOF.json"));

async function main() {

	const [deployer] = await ethers.getSigners();

	const owner = deployer.address;

	console.log("---------------------------------------------------------------")

	console.log(`Deploying HOF contract with account=${owner}...`);

	const tx = await ethers.deployContract("SongBirdzHOF", [owner]);

	await tx.waitForDeployment();

	console.log(`HOF contract with owner=${owner} deployed to ${tx.target}!`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
