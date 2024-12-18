const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const privatePath = path.join(__dirname, `../../private/${process.env.NODE_ENV}`);

const COLLECTION_NAME = "predator-and-prey-5";
const COLLECTION_START_INDEX = 5000;
const COLLECTION_SIZE = 1000;

// Get the list of species names to use as answer key for the collection

const speciesNames = fs.readFileSync(
	`${privatePath}/collections/${COLLECTION_NAME}/key.txt`, "utf8"
).split(/\r?\n/);

const values = [];

for (let i = 0; i < COLLECTION_SIZE; i++) {

	// Get the unique ID of the bird relative to the entire 10000
	const birdId = COLLECTION_START_INDEX + i;

	const name = speciesNames[i];

	// Load the audio file for the bird
	const audioFile = fs.readFileSync(`${privatePath}/audio-hidden/${birdId}.mp3`);

	// Load the image file for the bird
	const imageFile = fs.readFileSync(`${privatePath}/images-hidden/${birdId}.jpg`);

	// Generate hash values for the species name, audio file, and image file

	const species = name;

	const audioFileBytes = new Uint8Array(audioFile);

	const imageFileBytes = new Uint8Array(imageFile);

	console.log(`${birdId}: ${species}`);
	console.log(audioFileBytes.length);
	console.log(imageFileBytes.length);

	// Add hash values as leafs to the merkle tree

	values.push([ethers.keccak256(ethers.toUtf8Bytes(species)), `${birdId}-species`]);

	values.push([ethers.keccak256(audioFileBytes), `${birdId}-audio`]);

	values.push([ethers.keccak256(imageFileBytes), `${birdId}-image`]);

}

console.log(`---- generating merkle tree for the ${COLLECTION_NAME} collection ----`);

if (values.length != (COLLECTION_SIZE * 3)) {
	throw new Error(`Each collection must contain exactly ${COLLECTION_SIZE} birds!`);
}

const tree = StandardMerkleTree.of(values, ["bytes32", "string"]);

console.log('Merkle Root:', tree.root);

// Store the merkle tree in a file
fs.writeFileSync(
	`${privatePath}/collections/${COLLECTION_NAME}/tree.json`,
	JSON.stringify(tree.dump())
);

process.exit(0);
