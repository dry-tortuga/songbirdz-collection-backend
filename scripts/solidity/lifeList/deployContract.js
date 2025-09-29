const fs = require("fs");
const { ethers } = require("hardhat");
const path = require("path");

// Load the contract ABI

const { abi } = JSON.parse(fs.readFileSync("./artifacts/contracts/SongBirdzLifeList.sol/SongBirdzLifeList.json"));

async function main() {

	const [deployer] = await ethers.getSigners();

	const owner = deployer.address;

	console.log("---------------------------------------------------------------")

	console.log(`Deploying SongBirdzLifeList contract with account=${owner}...`);

	const tx = await ethers.deployContract(
		"SongBirdzLifeList",
		[
			process.env.SONGBIRDZ_CONTRACT_ADDRESS,
		],
		{
			address: process.env.LIFELIST_CONTRACT_ADDRESS
		},
	);

	const receipt = await tx.waitForDeployment();

	console.log(`Tx=${receipt.hash}, gas=${receipt.gasUsed}, is mined in block ${receipt.blockNumber}`);

	console.log(`SongBirdzLifeList contract with owner=${owner} deployed to ${tx.target}!`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
