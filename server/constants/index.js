const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");
const path = require("path");

const ABI_FOLDER = path.join(
	__dirname,
	"../../artifacts/contracts/SongBirdz.sol"
);
const PRIVATE_FOLDER = path.join(
	__dirname,
	`../../private/${process.env.NODE_ENV}`
);

const PRIVATE_PATH = {
	COLLECTIONS: path.join(PRIVATE_FOLDER, "collections"),
	IMAGES: path.join(PRIVATE_FOLDER, "images-hidden"),
};

const DB_COLLECTION_IDS = [
	"point_logs",
	"point_logs_2",
	"point_logs_3",
	"point_logs_4",
	"point_logs_5",
];

const SONGBIRDZ_CONTRACT_ABI = require(`${ABI_FOLDER}/SongBirdz.json`);

const FAMILIES_DATA = require("./families.json");

const UNIDENTIFIED_NAME = "UNIDENTIFIED";

const COLLECTION_KEYS = [
	"picasso-genesis-0",
	"deep-blue-1",
	"small-and-mighty-2",
	"night-and-day-3",
	"fire-and-ice-4",
	"predator-and-prey-5",
	"love-birds-6",
	"hatchlings-7",
	"masters-of-disguise-8",
	"final-roost-9",
];

const COLLECTION_NAMES = [
	"Picasso Genesis",
	"Deep Blue",
	"Small & Mighty",
	"Night & Day",
	"Fire & Ice",
	"Predator & Prey",
	"Lovebirds",
	"Hatchlings",
	"Masters of Disguise",
	"Final Roost",
];

const COLLECTION_SIZE = 1000;

const MIN_BIRD_ID = 0;
const MAX_BIRD_ID = (COLLECTION_NAMES.length * COLLECTION_SIZE) - 1;

const FIRST_ID_TO_IDENTIFY = 2402;

// Build data map of ID -> name|collection|answer-choices for all the birds

const KEY_BIRD_DATA = {};

// Build data map of name -> ID|family for all the species

const SOURCE_SPECIES_DATA = {};

// Build an array of merkle tree data for all the collections

const MERKLE_TREE_DATA = [];

// Keep track of the starting index for the species in the current collection
let speciesStartIndex = 0;

COLLECTION_KEYS.forEach((cKey, cIndex) => {
	fs.readFileSync(`${PRIVATE_PATH.COLLECTIONS}/${cKey}/key.txt`, "utf8")
		.split(/\r?\n/)
		.forEach((speciesName, birdIndex) => {

			// Get the unique ID of the bird relative to the entire 10,000
			const finalIndex = cIndex * COLLECTION_SIZE + birdIndex;

			KEY_BIRD_DATA[finalIndex] = {
				name: speciesName,
				collectionName: COLLECTION_NAMES[cIndex],
				collectionNumber: cIndex,
				options: [],
			};

		});

	if (
		Object.keys(KEY_BIRD_DATA).length !==
		COLLECTION_SIZE + COLLECTION_SIZE * cIndex
	) {
		throw new Error(
			`Invalid size=${
				Object.keys(KEY_BIRD_DATA).length
			} received for KEY_BIRD_DATA!`
		);
	}

	// Add the list of possible answer choices for each bird to the final data

	const answerChoicesList = require(`${PRIVATE_PATH.COLLECTIONS}/${cKey}/answer-choices.json`);

	answerChoicesList.forEach((aData, aIndex) => {

		// Get the unique ID of the bird relative to the entire 10,000
		const finalIndex = cIndex * COLLECTION_SIZE + aIndex;

		let optionsCopy = [...aData.options];

		const name = KEY_BIRD_DATA[finalIndex].name;

		const matchingIndex = optionsCopy.findIndex((tOption) => tOption === name);

		optionsCopy.splice(matchingIndex, 1);

		optionsCopy = optionsCopy.slice(0, 3);

		rOptions = [...optionsCopy, name];

		shuffle(rOptions);
		shuffle(rOptions);

		KEY_BIRD_DATA[finalIndex].options = [...rOptions];

	});

	// Determine the number of unique species in this collection
	let expectedSpeciesCount;

	if (cIndex === 0 || cIndex === (COLLECTION_KEYS.length - 1)) {
		expectedSpeciesCount = 200;
	} else {
		expectedSpeciesCount = 50;
	}

	const sourceList = require(`${PRIVATE_PATH.COLLECTIONS}/${cKey}/source.json`);

	sourceList.forEach((sBird, sIndex) => {

		// Get the unique ID of the species relative to the entire set
		const finalIndex = speciesStartIndex + sIndex;

		SOURCE_SPECIES_DATA[sBird.name] = {
			id: finalIndex,
			family: getFamily(sBird.name),
		};

	});

	speciesStartIndex + expectedSpeciesCount;

	if (Object.keys(SOURCE_SPECIES_DATA).length !== speciesStartIndex) {
		throw new Error(
			`Invalid size=${
				Object.keys(SOURCE_SPECIES_DATA).length
			} received for SOURCE_SPECIES_DATA!`
		);
	}

	MERKLE_TREE_DATA.push(
		StandardMerkleTree.load(
			JSON.parse(
				fs.readFileSync(`${PRIVATE_PATH.COLLECTIONS}/${cKey}/tree.json`, "utf8")
			)
		)
	);

	if (Object.keys(MERKLE_TREE_DATA).length !== cIndex + 1) {
		throw new Error(
			`Invalid size=${
				Object.keys(MERKLE_TREE_DATA).length
			} received for MERKLE_TREE_DATA!`
		);
	}

});

module.exports = {
	UNIDENTIFIED_NAME,
	COLLECTION_SIZE,
	DB_COLLECTION_IDS,
	MIN_BIRD_ID,
	MAX_BIRD_ID,
	FIRST_ID_TO_IDENTIFY,
	KEY_BIRD_DATA,
	SOURCE_SPECIES_DATA,
	MERKLE_TREE_DATA,
	SONGBIRDZ_CONTRACT_ABI,
	PRIVATE_PATH,
};

function getFamily(speciesName) {

	const match = FAMILIES_DATA.find((group) => {

		const isSpeciesIncluded = Boolean(
			group.species.find((item) => item.label === speciesName)
		);

		return isSpeciesIncluded;

	});

	return match.name;

}

function shuffle(array) {

	let currentIndex = array.length,  randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];

	}

	return array;

}
