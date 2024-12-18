const { exec } = require('node:child_process');
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "fire-and-ice-4";

const privatePath = path.join(__dirname, `../../private/${process.env.NODE_ENV}`);

const finalFolder =  path.join(
	__dirname,
	`../../private/the-cornell-guide-to-bird-sounds--united-states-and-canada-v2021`,
);

// Get the list of species names that were used in the previous collection

const speciesSourceNames = require(
	`${privatePath}/collections/${COLLECTION_NAME}/source.json`
);

// Get the list of all species names remaining

const originalNames = fs.readFileSync(
	`${finalFolder}/remaining-names-future-flocks.txt.bak`, "utf8"
).split(/\r?\n/);

// Store the final list of species names remaining after removing those already used

const results = [];

originalNames.forEach((name) => {

	if (speciesSourceNames.findIndex((species) => species.name === name) === -1) {
		results.push(name);
	}

});

const finalResultsTxt = results.join("\n");

const finalKeyFileName = `${finalFolder}/remaining-names-future-flocks.txt`;

fs.writeFileSync(finalKeyFileName, finalResultsTxt, (err) => {

	if (err) {
		throw new err;
	}

});
