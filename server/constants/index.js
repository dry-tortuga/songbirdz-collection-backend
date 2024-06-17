const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");
const path = require("path");

const ABI_FOLDER = path.join(__dirname, "../../artifacts/contracts/SongBirdz.sol");
const PRIVATE_FOLDER = path.join(__dirname, `../../private/${process.env.NODE_ENV}`);

const PRIVATE_PATH = {
	COLLECTIONS: path.join(PRIVATE_FOLDER, "collections"),
	IMAGES: path.join(PRIVATE_FOLDER, "images-hidden"),
};

const SONGBIRDZ_CONTRACT_ABI = require(`${ABI_FOLDER}/SongBirdz.json`);

const UNIDENTIFIED_NAME = "UNIDENTIFIED";

const COLLECTIION_SIZE = 1000;

const MIN_BIRD_ID = 0;
const MAX_BIRD_ID = 999;

// Build data map of ID -> name|collection for all the birds

const KEY_BIRD_DATA = {};

// Build data map of name -> ID for all the species

const SOURCE_SPECIES_DATA = {};

// Build an array of merkle tree data for all the collections

const MERKLE_TREE_DATA = [];

// Add the Picasso collection

fs.readFileSync(
	`${PRIVATE_PATH.COLLECTIONS}/picasso/key.txt`,
	"utf8",
).split(/\r?\n/).forEach((name, index) => {

	const COLLECTION_NAME = "Picasso";
	const COLLECTION_NUMBER = 0;
	const COLLECTION_START_INDEX = 0;

	// Get the unique ID of the bird relative to the entire 10000
	const finalIndex = COLLECTION_START_INDEX + index;

	KEY_BIRD_DATA[finalIndex] = {
		name,
		collectionName: COLLECTION_NAME,
		collectionNumber: COLLECTION_NUMBER,
	};

});

if (Object.keys(KEY_BIRD_DATA).length !== 1000) {
	throw new Error(`Invalid size received for KEY_BIRD_DATA!`);
}

fs.readFileSync(
	`${PRIVATE_PATH.COLLECTIONS}/picasso/source.txt`,
	"utf8",
).split(/\r?\n/).forEach((name, index) => {

	const SPECIES_START_INDEX = 0;

	// Get the unique ID of the species relative to the entire set
	const finalIndex = SPECIES_START_INDEX + index;

	SOURCE_SPECIES_DATA[name] = finalIndex;

});

if (Object.keys(SOURCE_SPECIES_DATA).length !== 200) {
	throw new Error(`Invalid size received for SOURCE_SPECIES_DATA!`);
}

MERKLE_TREE_DATA.push(StandardMerkleTree.load(JSON.parse(fs.readFileSync(
	`${PRIVATE_PATH.COLLECTIONS}/picasso/tree.json`,
	"utf8",
))));

if (Object.keys(MERKLE_TREE_DATA).length !== 1) {
	throw new Error(`Invalid size received for MERKLE_TREE_DATA!`);
}

module.exports = {
	UNIDENTIFIED_NAME,
	COLLECTIION_SIZE,
	MIN_BIRD_ID,
	MAX_BIRD_ID,
	KEY_BIRD_DATA,
	SOURCE_SPECIES_DATA,
	MERKLE_TREE_DATA,
	SONGBIRDZ_CONTRACT_ABI,
	PRIVATE_PATH,
};
