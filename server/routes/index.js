const debug = require("debug")("server");
const { ethers: { keccak256, toUtf8Bytes } } = require("ethers");
const express = require("express");
const fs = require("fs");

const {
	COLLECTIION_SIZE,
	UNIDENTIFIED_NAME,
	MIN_BIRD_ID,
	MAX_BIRD_ID,
	SPECIES_DATA,
	MERKLE_TREE_DATA,
	PRIVATE_PATH,
} = require("../constants");
const { isBirdIdentified } = require("../utils");

const router = express.Router();

// Get the image file for a specific bird
router.get("/image/:id", async (req, res, next) => {

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
	if (!SPECIES_DATA[birdId]?.name) {

		return next({
			status: 400,
			message: "The bird ID is invalid",
		});

	}

	const isIdentified = await isBirdIdentified(birdId);

	const filename = isIdentified
		? `${birdId}.jpg`
		: "unidentified.jpg";

	res.sendFile(filename, { root: PRIVATE_PATH.IMAGES }, (err) => {

		if (err) {
			next(err)
		} else {
			debug("Sent: ", filename)
		}
 
	});

});

// Get the image file for a specific bird
router.get("/image-lg/:id", async (req, res, next) => {

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
	if (!SPECIES_DATA[birdId]?.name) {

		return next({
			status: 400,
			message: "The bird ID is invalid",
		});

	}

	const isIdentified = await isBirdIdentified(birdId);

	const filename = isIdentified
		? `${birdId}-lg.jpg`
		: "unidentified.jpg";

	res.sendFile(filename, { root: PRIVATE_PATH.IMAGES }, (err) => {

		if (err) {
			next(err)
		} else {
			debug("Sent: ", filename)
		}
 
	});

});

// Get the metadata for a specific bird
router.get("/metadata/:id", async (req, res, next) => {

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
	if (!SPECIES_DATA[birdId]?.name ||
		!SPECIES_DATA[birdId]?.collectionName) {

		return next({
			status: 400,
			message: "The bird ID is invalid",
		});

	}

	const isIdentified = await isBirdIdentified(birdId);

	const species = isIdentified ? SPECIES_DATA[birdId].name : UNIDENTIFIED_NAME;
	const description = isIdentified ? null : 'This bird has not been identified yet.';

	// See below the required JSON structure for metadata
	// https://docs.opensea.io/docs/getting-started

	res.send({
		name: `Songbird #${birdId}`,
		description,
		external_url: `${process.env.SONGBIRDZ_BACKEND_URL}/collection/${birdId}`,
		image: `${process.env.SONGBIRDZ_BACKEND_URL}/birds/image-lg/${birdId}`,
		image_onchain: `${process.env.SONGBIRDZ_BACKEND_URL}/birds/image/${birdId}`,
		audio_onchain: `${process.env.SONGBIRDZ_BACKEND_URL}/audio/${birdId}.mp3`,
		species,
		attributes: [{
			display_type: "number",
			trait_type: "Collection",
			value: SPECIES_DATA[birdId].collectionNumber,
		}, {
			trait_type: "Style",
			value: SPECIES_DATA[birdId].collectionName,
		}, {
			trait_type: "Species",
			value: species,
		}],
	});

});

// Get the merkle tree proof for a species guess
router.get("/merkle-proof/:id", async (req, res, next) => {

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
	if (!SPECIES_DATA[birdId]?.name) {

		return next({
			status: 400,
			message: "The bird ID is invalid",
		});

	}

	const collectionNumber = SPECIES_DATA[birdId].collectionNumber;

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

		const randomIndex = Math.floor(Math.random() * (COLLECTIION_SIZE * 3));

		proof = merkleTree.getProof(randomIndex);

	}

	res.send({
		proof,
		species_guess: speciesName,
	});

});

module.exports = router;
