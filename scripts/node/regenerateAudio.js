const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "picasso-genesis-0";
const COLLECTION_START_INDEX = 0;
const COLLECTION_SIZE = 1000;

const privatePath = path.join(__dirname, `../../private/${process.env.NODE_ENV}`);

const audioFolder = path.join(
	privatePath,
	`/audio-original/`,
);

// Get the audio files to use as source for the collection

const audioHashMap = {};

fs.readdirSync(audioFolder).forEach((file) => {

	const filePieces = file.split("-");

	const id = filePieces.pop().replace(".mp3", "");
	const count = filePieces.pop();
	const type = filePieces.pop();
	const speciesName = filePieces.join("-");

	if (!id || !count || !type || !speciesName) {
		throw new Error("File name is invalid: ", file);
	}

	if (!audioHashMap[speciesName]) { audioHashMap[speciesName] = {}; }

	audioHashMap[speciesName][count] = {
		file,
		type,
		id,
		used: false,
	}

});

// Get the list of species names to use as answer key for the collection

const speciesKeyNames = fs.readFileSync(
	`${privatePath}/collections/${COLLECTION_NAME}/key.txt`, "utf8"
).split(/\r?\n/);

// Redo the audio files for the collection
(() => {

	console.log(`Redoing audio for the ${COLLECTION_NAME} collection:`);

	const missing = {};
	const citations = {};

	for (let i = 0; i < COLLECTION_SIZE; i += 1) {

		const name = speciesKeyNames[i];

		console.log(`${i}:${name}`);

		if (!audioHashMap[name]) {
			missing[name] = true;
			console.log(`MISSING AUDIO for "${name}"`);
			continue;
		}

		if (Object.keys(audioHashMap[name]).length === 0) {
			throw new Error(`The audio file is missing for species="${name}"!`);
		}

		const audioFilesForSpecies = Object.values(audioHashMap[name]);

		// Loop through and pick out the first audio file that is not yet used
		let selectedAudioFile = null, selectedRecordingId = null;

		for (let j = 0; j < audioFilesForSpecies.length; j += 1) {

			if (!audioFilesForSpecies[j].used) {
				selectedAudioFile = audioFilesForSpecies[j].file;
				selectedRecordingId = audioFilesForSpecies[j].id;
				audioFilesForSpecies[j].used = true;
				break;
			}

		}

		// If they have all been used at least once, just choose one at random
		if (!selectedAudioFile) {
			const randomIdx = Math.floor(Math.random() * audioFilesForSpecies.length);
			selectedAudioFile = audioFilesForSpecies[randomIdx].file;
			selectedRecordingId = audioFilesForSpecies[randomIdx].id;
		}

		// Get the unique ID of the bird relative to the entire 10000
		const finalIndex = COLLECTION_START_INDEX + i;

		const outputFileName = `${privatePath}/audio-hidden/${finalIndex}.mp3`;

		console.log(`Using audio file "${selectedAudioFile}" for "${name}"`);

		fs.copyFileSync(
			`${audioFolder}/${selectedAudioFile}`,
			outputFileName,
		);

		citations[parseInt(i, 10)] = {
			id: parseInt(selectedRecordingId, 10),
		};

    }

    console.log(`audio files for the ${COLLECTION_NAME} collection created at ${privatePath}/audio-hidden!`);

	fs.writeFileSync(`${privatePath}/audio-metadata.json`, JSON.stringify(citations));

	console.log(`\n\n`, missing, `\n\n`);

})();
