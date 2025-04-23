const { exec } = require('node:child_process');
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const privatePath = path.join(__dirname, `../../private/${process.env.NODE_ENV}`);

// Get the list of all species names remaining

const COLLECTION_KEYS = [
    "picasso-genesis-0",
    "deep-blue-1",
    "small-and-mighty-2",
    "night-and-day-3",
    "fire-and-ice-4",
    "predator-and-prey-5",
    "love-birds-6",
    "hatchlings-7",
];

let results = fs.readFileSync(
	`../../private/remaining-names.txt.bak`, "utf8"
).split(/\r?\n/);

COLLECTION_KEYS.forEach((collectionName, index) => {

	// Get the list of species names that were used in the collection

	let speciesSourceNames = [];

	if (index === 0) {

		speciesSourceNames = fs.readFileSync(
			`${privatePath}/collections/${collectionName}/source.txt`, "utf8"
		).split(/\r?\n/);

	} else {

		speciesSourceNames = require(
			`${privatePath}/collections/${collectionName}/source.json`
		);

	}

	speciesSourceNames.forEach((species) => {
		results = results.filter((name) => name !== species.name);
	});

});

const finalResultsTxt = results.join("\n");

const finalKeyFileName = "../../private/remaining-names.txt";

fs.writeFileSync(finalKeyFileName, finalResultsTxt, (err) => {

	if (err) {
		throw new err;
	}

});
