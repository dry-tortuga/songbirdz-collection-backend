const fs = require("fs");
const { ethers } = require("hardhat");
const path = require("path");

// Load the contract ABI

const { abi } = JSON.parse(fs.readFileSync("./artifacts/contracts/SongBirdzHOF.sol/SongBirdzHOF.json"));

// Load the encoded data

const dataToUpload = JSON.parse(fs.readFileSync(path.join(
	__dirname,
	'../../private/development/hof-data.json'
)));

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

	for (let i = 0; i < dataToUpload.length; i++) {

		const trophy = dataToUpload[i];

		// Add the trophy to the Hall of Fame
		await contract.publicGenerateTrophy(
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

		// Log the URL for the token
		const resultURI = await contract.tokenURI(i);

		fs.writeFileSync(
			path.join(
				__dirname,
				`../../private/development/hof-token-uri-output-${i}.json`,
			),
			JSON.stringify(resultURI), (err) => {

				if (err) {
					throw new err;
				}

			},
		);

	}

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
