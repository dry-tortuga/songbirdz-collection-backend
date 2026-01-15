const fs = require("fs");
const NodeID3 = require("node-id3");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "picasso-genesis-0";
const COLLECTION_START_INDEX = 0;
const COLLECTION_SIZE = 1000;

const privatePath = path.join(__dirname, `../../private/${process.env.NODE_ENV}`);

// Get the metadata from xeno-canto for the species in this collection
const xenoCantoMetadata = require(
	`${privatePath}/audio-metadata.json`,
);

// Redo the audio file metadata for the collection
(async () => {

	console.log(`Fetching audio metadata from xeno-canto for the ${COLLECTION_NAME} collection:`);

	const missing = {};
	const citations = {};

	for (const birdId in xenoCantoMetadata) {

		const recordingID = xenoCantoMetadata[birdId].id;

		console.log(`${birdId}:${recordingID}`);

		const response = await fetch(`https://xeno-canto.org/api/3/recordings?query=nr:${recordingID}&key=${process.env.XENO_CANTO_API_KEY}`);

		const results = await response.json();

		if (results.recordings.length !== 1) {
			throw new Error(`Expected 1 recording, got ${results.recordings.length}`);
		}

		const recording = results.recordings[0];

		citations[birdId] = {
			id: recording.id,
			en: recording.en,
			rec: recording.rec,
			type: recording.type,
			method: recording.method,
			lic: recording.lic.split('/').slice(4, 6).join('/'),
			q: recording.q,
			//  url: '//xeno-canto.org/78062',
			// file: 'https://xeno-canto.org/78062/download',
			// 'file-name': 'JMJ-20110516-064956-000223-USA-MN-BearHeadLake-YBSA.mp3',
		};

		const audioFile = `${privatePath}/audio-hidden/${birdId}.mp3`;

		// Write the metadata to the file
		NodeID3.write({
			title: `Songbirdz #${birdId}: ${recording.en}`,
			artist: recording.rec,
			album: "Songbirdz",
			comment: {
				language: "eng",
				text: `${recording.rec}, XC${recordingID}. Original recording at www.xeno-canto.org/${recordingID}. Edited by the Songbirdz project. License is ${recording.lic.split('/').slice(4, 6).join('/')}.`
			}
		}, audioFile);

    }

    console.log(`audio metadata from xeno-canto for the ${COLLECTION_NAME} collection created at ${privatePath}/audio-hidden!`);

    fs.writeFileSync(`${privatePath}/audio-metadata.json`, JSON.stringify(citations));

})();
