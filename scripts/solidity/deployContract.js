const { ethers } = require("hardhat");

async function main() {

	const [deployer] = await ethers.getSigners();

	const owner = deployer.address;

	console.log("---------------------------------------------------------------")

	console.log(`Deploying SongBirdz contract with account=${owner}...`);

	const tx = await ethers.deployContract("SongBirdz", [owner]);

	await tx.waitForDeployment();

	console.log(`SongBirdz contract with owner=${owner} deployed to ${tx.target}!`);
	console.log(tx);

	console.log("---------------------------------------------------------------")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
