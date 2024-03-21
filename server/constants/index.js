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

// Build data map of ID -> name for all the species

const SPECIES_DATA = {};

// Build data map of ID -> merkle tree for all the collections

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

	SPECIES_DATA[finalIndex] = {
		name,
		collectionName: COLLECTION_NAME,
		collectionNumber: COLLECTION_NUMBER,
	};

});

MERKLE_TREE_DATA.push(StandardMerkleTree.load(JSON.parse(fs.readFileSync(
	`${PRIVATE_PATH.COLLECTIONS}/picasso/tree.json`,
	"utf8",
))));

module.exports = {
	UNIDENTIFIED_NAME,
	COLLECTIION_SIZE,
	MIN_BIRD_ID,
	MAX_BIRD_ID,
	SPECIES_DATA,
	MERKLE_TREE_DATA,
	SONGBIRDZ_CONTRACT_ABI,
	PRIVATE_PATH,
};
