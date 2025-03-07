const { ethers: { keccak256, toUtf8Bytes } } = require("ethers");

const {
	COLLECTION_SIZE,
	UNIDENTIFIED_NAME,
	MIN_BIRD_ID,
	MAX_BIRD_ID,
	KEY_BIRD_DATA,
	SOURCE_SPECIES_DATA,
	MERKLE_TREE_DATA,
	PRIVATE_PATH,
} = require("../constants");
const { isBirdIdentified } = require("../utils");

// Store identification results locally in simple cache to
// speed-up lookup for birds that are already identified
const BIRD_ID_RESULTS = {};

const getBirdMetadata = async (req, res, next) => {

	const birdId = parseInt(req.params.id, 10);

	// Check to make sure ID parameter is a valid integer number
	if (isNaN(birdId)) {

		return next({
			status: 400,
			message: "The bird ID is invalid",
		});

	}

	// Check to make sure ID parameter is in the supported range of numbers
	if (birdId < MIN_BIRD_ID || birdId > MAX_BIRD_ID) {

		return next({
			status: 400,
			message: "The bird ID is invalid",
		});

	}

	// Check to make sure that a species result matches the ID parameter
	if (!KEY_BIRD_DATA[birdId]?.name ||
		!KEY_BIRD_DATA[birdId]?.collectionName) {

		return next({
			status: 400,
			message: "The bird ID is invalid",
		});

	}

	const isIdentified = await isBirdIdentified(birdId, BIRD_ID_RESULTS);

	const species = isIdentified ? KEY_BIRD_DATA[birdId].name : UNIDENTIFIED_NAME;
	const description = isIdentified ? null : 'This bird has not been identified yet.';
	const family = SOURCE_SPECIES_DATA[KEY_BIRD_DATA[birdId].name]?.family;

	// See below the required JSON structure for metadata
	// https://docs.opensea.io/docs/getting-started

	res.send({
		name: `Songbird #${birdId}`,
		description,
		animation_url: `${process.env.SONGBIRDZ_FRONTEND_URL}/audio/${birdId}.mp3`,
		external_url: `${process.env.SONGBIRDZ_FRONTEND_URL}/collection/${birdId}`,
		image: `${process.env.SONGBIRDZ_FRONTEND_URL}/images/${birdId}-lg.jpg`,
		image_onchain: `${process.env.SONGBIRDZ_FRONTEND_URL}/images/${birdId}.jpg`,
		species,
		attributes: [{
			trait_type: "Flock",
			value: KEY_BIRD_DATA[birdId].collectionName,
		}, {
			trait_type: "Species",
			value: species,
		}, {
			trait_type: "Family",
			value: family,
		}],
	});

};

const getBirdProof = async (req, res, next) => {

	const birdId = parseInt(req.params.id, 10);

	let speciesName = req.query.species_guess;

	// Check to make sure species guess is provided
	if (!speciesName) {

		return next({
			status: 400,
			message: "The species guess is invalid",
		});

	}

	// Check to make sure ID parameter is a valid integer number
	if (isNaN(birdId)) {

		return next({
			status: 400,
			message: "The bird ID is invalid",
		});

	}

	// Check to make sure ID parameter is in the supported range of numbers
	if (birdId < MIN_BIRD_ID || birdId > MAX_BIRD_ID) {

		return next({
			status: 400,
			message: "The bird ID is invalid",
		});

	}

	// Check to make sure that a species result matches the ID parameter
	if (!KEY_BIRD_DATA[birdId]?.name) {

		return next({
			status: 400,
			message: "The bird ID is invalid",
		});

	}

	const collectionNumber = KEY_BIRD_DATA[birdId].collectionNumber;

	const merkleTree = MERKLE_TREE_DATA[collectionNumber];

	let proof;

	// Check the merkle tree for the valid proof matching the species guess

	const speciesHash = keccak256(toUtf8Bytes(speciesName));

	for (const [i, v] of merkleTree.entries()) {

		if (v[0] === speciesHash && v[1] === `${birdId}-species`) {

			proof = merkleTree.getProof(i);

		}

	}

    if (process.env.NODE_ENV === 'development') {
        console.log(`Merkle Proof Root: ${merkleTree.root}`);
    }

	// If no proof exists for the species guess, get a random proof from the tree
	if (!proof) {

		const randomIndex = Math.floor(Math.random() * (COLLECTION_SIZE * 3));

		proof = merkleTree.getProof(randomIndex);

	}

	res.send({
		proof,
		species_guess: speciesName,
	});

};

const getBirdAlreadyIdentifiedList = async (req, res, next) => {
	res.send({ results: BIRD_ID_RESULTS });
};

const getRandomUnidentifiedBird = async (req, res, next) => {

	let birdId = parseInt(req.query.id, 10);

	// Check if requesting a specific bird by ID
	if (birdId) {

		// Check to make sure ID parameter is a valid integer number
		if (isNaN(birdId)) {

			return next({
				status: 400,
				message: "The bird ID is invalid",
			});

		}

		// Check to make sure ID parameter is in the supported range of numbers
		if (birdId < 2336 || birdId > MAX_BIRD_ID) {

			return next({
				status: 400,
				message: "The bird ID is invalid",
			});

		}

		// Check to make sure that a species result matches the ID parameter
		if (!KEY_BIRD_DATA[birdId]?.name) {

			return next({
				status: 400,
				message: "The bird ID is invalid",
			});

		}

	// Otherwise, choose a bird ID at random
	} else {

		const options = [];

		for (let i = 2336; i < MAX_BIRD_ID; i++) {
			if (!BIRD_ID_RESULTS[i]) {
				options.push(i);
			}
		}

		birdId = options[Math.floor(Math.random() * options.length)];

	}

	const birdData = KEY_BIRD_DATA[birdId];

	const family = SOURCE_SPECIES_DATA[KEY_BIRD_DATA[birdId].name]?.family;

	res.send({
		id: birdId,
		name: `Songbird #${birdId}`,
		description: 'This bird has not been identified yet.',
		animation_url: `${process.env.SONGBIRDZ_FRONTEND_URL}/audio/${birdId}.mp3`,
		external_url: `${process.env.SONGBIRDZ_FRONTEND_URL}/collection/${birdId}`,
		image: `${process.env.SONGBIRDZ_FRONTEND_URL}/images/${birdId}-lg.jpg`,
		image_onchain: `${process.env.SONGBIRDZ_FRONTEND_URL}/images/${birdId}.jpg`,
		species: birdData?.name,
		family,
		flock: birdData?.collectionName,
		options: birdData?.options,
	});

};

module.exports = {
	getBirdMetadata,
	getBirdProof,
	getBirdAlreadyIdentifiedList,
	getRandomUnidentifiedBird,
};
