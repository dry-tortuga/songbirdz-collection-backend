const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const {
	COLLECTION_KEYS,
	COLLECTION_NAMES,
	COLLECTION_SIZE,
	MIN_BIRD_ID,
	MAX_BIRD_ID,
	FIRST_ID_TO_IDENTIFY,
	KEY_BIRD_DATA,
	SOURCE_SPECIES_DATA,
	MERKLE_TREE_DATA,
	PRIVATE_PATH,
} = require("../../server/constants");

const privatePath = path.join(__dirname, `../../private/${process.env.NODE_ENV}`);

const IPFS_ROOT_IMAGES = "bafybeicjzy2uaenpe3my4ns6ma5ihotru4o26jadbx5ijpj5op4bux5nha";
const IPFS_ROOT_AUDIO = "babcbeicjzy2uaenpe3my4ns6ma5ihotru4o26jadbx5ijpj5op4bux1ccc";

console.log(`---- generating metadata for the songbirdz collection ----`);

for (let i = 0; i < COLLECTION_KEYS.length; i++) {

	console.log(`---- ${COLLECTION_NAMES[i]} flock ----`)

	for (let j = 0; j < COLLECTION_SIZE; j++) {

		// Get the unique ID of the bird relative to the entire 10000
		const birdId = (i * COLLECTION_SIZE) + j;

		const species = KEY_BIRD_DATA[birdId].name;
		const description = null;
		const family = SOURCE_SPECIES_DATA[KEY_BIRD_DATA[birdId].name]?.family;

		if (!species || !family) {
			throw new Error(`Missing species or family data for bird ID ${birdId}`);
		}

		console.log(`${birdId}=birdId -> ${species} -> (${family})`);

		const metadataJSON = {
			name: `Songbird #${birdId}`,
			description: 'One of the 10,000 birds in the Songbirdz collection that is bringing bird watching onchain',
			image: `ipfs://${IPFS_ROOT_IMAGES}/${birdId}.jpg`,
			animation_url: `ipfs://${IPFS_ROOT_AUDIO}/${birdId}.mp3`,
			external_url: `https://songbirdz.cc/collection/${birdId}`,
			species,
			attributes: [{
				trait_type: "Flock",
				value: COLLECTION_NAMES[i],
			}, {
				trait_type: "Species",
				value: species,
			}, {
				trait_type: "Family",
				value: family,
			}],

		};

		// Store the json metadata in a file
		fs.writeFileSync(
			`${privatePath}/metadata/${birdId}`,
			JSON.stringify(metadataJSON),
		);

	}

}

console.log('----- Metadata generation complete -----');

process.exit(0);
