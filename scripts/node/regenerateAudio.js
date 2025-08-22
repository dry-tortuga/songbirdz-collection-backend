const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

// TODO: Regenerate audio files + verify all final submissions in the tree for "redo" species
// Oriental Greenfinch (White-winged Scoter)
// 500,571,601,968,971,

const COLLECTION_NAME = "final-migration-9";
const COLLECTION_START_INDEX = 9000;
const COLLECTION_SIZE = 1000;

const FILE_NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

const privatePath = path.join(__dirname, `../../private/${process.env.NODE_ENV}`);

const audioFolder =  path.join(
	__dirname,
	`../../private/the-cornell-guide-to-bird-sounds--united-states-and-canada-v2021/`,
);

// Get the audio files to use as source for the collection

const audioHashMap = {};

fs.readdirSync(audioFolder).forEach((file) => {

	for (const number of FILE_NUMBERS) {

		if (file.indexOf(` ${number} `) >= 0) {

			const pieces = file.split(` ${number} `);
			const name = pieces[0];

			if (!audioHashMap[name]) { audioHashMap[name] = []; }

			audioHashMap[name].push(file);

		}

	}

});

// Get the list of species names to use as answer key for the collection

const speciesKeyNames = fs.readFileSync(
	`${privatePath}/collections/${COLLECTION_NAME}/key.txt`, "utf8"
).split(/\r?\n/);

// Redo "some" of the audio files for the collection
(() => {

	console.log(`Redoing audio for the ${COLLECTION_NAME} collection:`);

	const redoList = [
		"Williamson's Sapsucker",
		"La Sagra's Flycatcher",
		"Siberian Accentor",
		"Red-billed Leiothrix",
		"Oriental Greenfinch"
	];

	let count = 0;

	for (let i = 0; i < 1000; i += 1) {

		const name = speciesKeyNames[i];

		if (redoList.indexOf(name) === -1) { continue; }

		console.log(`${i}:${name}`);

		if (!audioHashMap[name] || audioHashMap[name].length === 0) {
			throw new Error(`The audio file is missing for species="${name}"!`);
		}

		const audioFilesForSpecies = [...audioHashMap[name]];

		const selectedAudioFile = audioFilesForSpecies[Math.floor(Math.random() * audioFilesForSpecies.length)];

		// Get the unique ID of the bird relative to the entire 10000
		const finalIndex = COLLECTION_START_INDEX + i;

		const originalFileName =
		`${privatePath}/audio-original/${finalIndex}-original.mp3`;

		console.log(`Using audio file "${selectedAudioFile}" for "${name}"`);

		fs.copyFileSync(
			`${audioFolder}/${selectedAudioFile}`,
			originalFileName,
		);

		count += 1;

    }

    console.log(`${count} audio files for the ${COLLECTION_NAME} collection were fixed and stored at ${privatePath}/audio-original!`);

})();
