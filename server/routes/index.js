const express = require("express");

const {
	getBird,
	getBirdLg,
	getBirdMetadata,
	getBirdProof,
} = require('./birds');

const router = express.Router();

// Get the image file for a specific bird
router.get("/image/:id", getBird);

// Get the image file (large size) for a specific bird
router.get("/image-lg/:id", getBirdLg);

// Get the metadata for a specific bird
router.get("/metadata/:id", getBirdMetadata);

// Get the merkle tree proof of the species guess for a specific bird
router.get("/merkle-proof/:id", getBirdProof);

module.exports = router;
