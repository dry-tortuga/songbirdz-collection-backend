const fs = require("fs");
const NodeID3 = require("node-id3");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "fire-and-ice-4";
const START_IDX = 4000;
const BIRD_ID = 4887;

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

const speciesName = speciesKeyNames[BIRD_ID - START_IDX];

// Redo the audio file for the bird
(async () => {

	console.log(`Redoing audio for the ${COLLECTION_NAME} collection, bird #${BIRD_ID}:`);

	const missing = {};
	const citations = {};

	if (!audioHashMap[speciesName]) {
		missing[speciesName] = true;
		throw new Error(`MISSING AUDIO for "${speciesName}"`);
	}

	if (Object.keys(audioHashMap[speciesName]).length === 0) {
		throw new Error(`The audio file is missing for species="${speciesName}"!`);
	}

	const audioFilesForSpecies = Object.values(audioHashMap[speciesName]);

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

	console.log(`Using audio file "${selectedAudioFile}" for "${speciesName}", fetching metadata from xeno-canto now...`);

	const response = await fetch(`https://xeno-canto.org/api/3/recordings?query=nr:${selectedRecordingId}&key=${process.env.XENO_CANTO_API_KEY}`);

	const results = await response.json();

	if (results.recordings.length !== 1) {
		throw new Error(`Expected 1 recording, got ${results.recordings.length}`);
	}

	const recording = results.recordings[0];

	const description = `The original recording has been modified by the Songbirdz project. Original recording is "XC${recording.id} · ${recording.en} · ${recording.gen} ${recording.sp}" by ${recording.rec}. Available for use under the CC ${recording.lic.split('/').slice(4, 6).join('/')} license (creativecommons.org/licenses/${recording.lic.split('/').slice(4, 6).join('/')}), at www.xeno-canto.org/${recording.id}.`;

	citations[BIRD_ID] = {
		id: parseInt(recording.id, 10),
		en: recording.en,
		gen: recording.gen,
		sp: recording.sp,
		rec: recording.rec,
		type: recording.type,
		method: recording.method,
		lic: recording.lic.split('/').slice(4, 6).join('/'),
		q: recording.q,
		description,
	};

	const outputFileName = `${privatePath}/audio-hidden/${BIRD_ID}.mp3`;

	// Wrrite the audio to the file
	fs.copyFileSync(
		`${audioFolder}/${selectedAudioFile}`,
		outputFileName,
	);

	console.log(`audio file for the ${COLLECTION_NAME} collection, bird #${BIRD_ID} created at "${outputFileName}"!`);

	// Write the metadata to the file
	NodeID3.write({
		title: `Songbirdz #${BIRD_ID}: ${recording.en}`,
		artist: recording.rec,
		album: "Songbirdz",
		comment: {
			language: "eng",
			text: description,
		}
	}, outputFileName);

	fs.writeFileSync(`${privatePath}/audio-metadata.json`, JSON.stringify(citations));

})();
