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

const COLLECTION_KEYS = ["picasso", "waterfowl-1"];
const COLLECTION_NAMES = ["Picasso Genesis", "Deep Blue"];
const COLLECTION_SIZE = 1000;

const MIN_BIRD_ID = 0;
const MAX_BIRD_ID = 1999;

// Build data map of ID -> name|collection for all the birds

const KEY_BIRD_DATA = {};

// Build data map of name -> ID for all the species

const SOURCE_SPECIES_DATA = {};

// Build an array of merkle tree data for all the collections

const MERKLE_TREE_DATA = [];

COLLECTION_KEYS.forEach((cKey, cIndex) => {

	fs.readFileSync(
		`${PRIVATE_PATH.COLLECTIONS}/${cKey}/key.txt`,
		"utf8",
	).split(/\r?\n/).forEach((speciesName, birdIndex) => {

		// Get the unique ID of the bird relative to the entire 10,000
		const finalIndex = (cIndex * COLLECTION_SIZE) + birdIndex;

		KEY_BIRD_DATA[finalIndex] = {
			name,
			collectionName: COLLECTION_NAMES[cIndex],
			collectionNumber: cIndex,
		};

	});

	if (Object.keys(KEY_BIRD_DATA).length !== COLLECTION_SIZE) {
		throw new Error(`Invalid size=${Object.keys(KEY_BIRD_DATA).length} received for KEY_BIRD_DATA!`);
	}

	// Picasso Genesis collection had 200 unique species, all others will have 50
	if (cIndex === 0) {

		fs.readFileSync(
			`${PRIVATE_PATH.COLLECTIONS}/${cKey}/source.txt`,
			"utf8",
		).split(/\r?\n/).forEach((sName, sIndex) => {

			const SPECIES_START_INDEX = 0;

			// Get the unique ID of the species relative to the entire set
			const finalIndex = SPECIES_START_INDEX + sIndex;

			SOURCE_SPECIES_DATA[sName] = finalIndex;

		});

		if (Object.keys(SOURCE_SPECIES_DATA).length !== 200) {
			throw new Error(`Invalid size received for SOURCE_SPECIES_DATA!`);
		}

	} else {

		fs.readFileSync(
			`${PRIVATE_PATH.COLLECTIONS}/${cKey}/source.json`,
		).forEach((sBird, sIndex) => {

			const SPECIES_START_INDEX = 200 + (50 * (cIndex - 1));

			// Get the unique ID of the species relative to the entire set
			const finalIndex = SPECIES_START_INDEX + sIndex;

			SOURCE_SPECIES_DATA[sBird.name] = finalIndex;

		});

		if (Object.keys(SOURCE_SPECIES_DATA).length !== (200 + (50 * cIndex))) {
			throw new Error(`Invalid size=${Object.keys(SOURCE_SPECIES_DATA).length} received for SOURCE_SPECIES_DATA!`);
		}

	}

	MERKLE_TREE_DATA.push(StandardMerkleTree.load(JSON.parse(fs.readFileSync(
		`${PRIVATE_PATH.COLLECTIONS}/${cKey}/tree.json`,
		"utf8",
	))));

	if (Object.keys(MERKLE_TREE_DATA).length !== (cIndex + 1)) {
		throw new Error(`Invalid size=${Object.keys(MERKLE_TREE_DATA).length} received for MERKLE_TREE_DATA!`);
	}

});

module.exports = {
	UNIDENTIFIED_NAME,
	COLLECTION_SIZE,
	MIN_BIRD_ID,
	MAX_BIRD_ID,
	KEY_BIRD_DATA,
	SOURCE_SPECIES_DATA,
	MERKLE_TREE_DATA,
	SONGBIRDZ_CONTRACT_ABI,
	PRIVATE_PATH,
};
