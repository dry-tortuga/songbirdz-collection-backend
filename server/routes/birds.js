const debug = require("debug")("server");
const { ethers: { keccak256, toUtf8Bytes } } = require("ethers");
const fs = require("fs");

const {
	COLLECTIIN_SIZE,
	UNIDENTIFIED_NAME,
	MIN_BIRD_ID,
	MAX_BIRD_ID,
	KEY_BIRD_DATA,
	MERKLE_TREE_DATA,
	PRIVATE_PATH,
} = require("../constants");
const { isBirdIdentified } = require("../utils");

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

	const isIdentified = await isBirdIdentified(birdId);

	const species = isIdentified ? KEY_BIRD_DATA[birdId].name : UNIDENTIFIED_NAME;
	const description = isIdentified ? null : 'This bird has not been identified yet.';

	// See below the required JSON structure for metadata
	// https://docs.opensea.io/docs/getting-started

	res.send({
		name: `Songbird #${birdId}`,
		description,
		animation_url: `${process.env.SONGBIRDZ_BACKEND_URL}/audio/${birdId}.mp3`,
		external_url: `${process.env.SONGBIRDZ_BACKEND_URL}/collection/${birdId}`,
		image: `${process.env.SONGBIRDZ_BACKEND_URL}/images/${birdId}-lg.jpg`,
		image_onchain: `${process.env.SONGBIRDZ_BACKEND_URL}/images/${birdId}.jpg`,
		species,
		attributes: [{
			display_type: "number",
			trait_type: "Collection",
			value: KEY_BIRD_DATA[birdId].collectionNumber,
		}, {
			trait_type: "Style",
			value: KEY_BIRD_DATA[birdId].collectionName,
		}, {
			trait_type: "Species",
			value: species,
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

module.exports = {
	getBird,
	getBirdLg,
	getBirdMetadata,
	getBirdProof,
};
