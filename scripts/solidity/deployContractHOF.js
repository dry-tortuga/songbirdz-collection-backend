const fs = require("fs");
const { ethers } = require("hardhat");

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

	// Get an instance of the contract
	const contract = await ethers.getContractAt(
		abi,
        tx.target,
		deployer,
	);

	// Add 1 trophy
	await contract.publicGenerateTrophy(
		owner,
		1, // place
		850, // points
		"0xeab3081c1917b45309f5f3ff0000000000000000000000000000000000000000",
		// 8 colors:
		// "0x0000000000000000000011100000000000213231000000000221223310000000022103331000000000001111110000000000311111100000000333011111000000033301111100000003333111111000000033301111110000000333311111100000003333233300000000200020000000002220222000000000000000000000",
		// 4 colors:
		"0x000000000054000009ed000029af4000293f40000055500000d5540003f1550003f1550003fd554000fc5550003fd554000ffbf00008080000a8a80000000000",
		"Big Onchain Spring 2025", // season
		"Atlantic Puffin", // species
	);

	// Log the URL for the token
	const result0 = await contract.tokenURI(0);

	console.log(result0);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
