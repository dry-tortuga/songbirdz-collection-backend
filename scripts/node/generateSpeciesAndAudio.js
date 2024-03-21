const { exec } = require('node:child_process');
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "picasso";
const COLLECTION_START_INDEX = 0;
const COLLECTION_SIZE = 1000;
const NUMBER_OF_UNIQUE_SPECIES = 200;

const privatePath = path.join(__dirname, `../../private/${process.env.NODE_ENV}`);

const audioFolder =  path.join(
	__dirname,
	`../../private/the-cornell-guide-to-bird-sounds--united-states-and-canada-v2021/files`,
);

// Get the audio files to use as source for the collection

const audioHashMap = {};

const audioSourceMaterial = fs.readdirSync(audioFolder).forEach((file) => {

	if (file.indexOf(" 01 ") >= 0) {

		const pieces = file.split(" 01 ");
		const name = pieces[0];

		audioHashMap[name] = file;

	}

});

// Get the list of species names to use as source for the collection

const speciesSourceNames = fs.readFileSync(
	`${privatePath}/collections/${COLLECTION_NAME}/source.txt`, "utf8"
).split(/\r?\n/);

// Build the final list of species names (in randomized order)

let finalSpeciesNames = [];

for (let i = 0; i < (COLLECTION_SIZE / NUMBER_OF_UNIQUE_SPECIES); i++) {
	finalSpeciesNames = [...finalSpeciesNames, ...speciesSourceNames];
}

shuffle(finalSpeciesNames);

// Store the final list of species name to the answer key for the collection

const finalSpeciesTxt = finalSpeciesNames.join("\n");

const finalKeyFileName = `${privatePath}/collections/${COLLECTION_NAME}/key.txt`;

fs.writeFileSync(finalKeyFileName, finalSpeciesTxt, (err) => {

	if (err) {
		throw new err;
	}

}); 

console.log(`The answer key for the ${COLLECTION_NAME} collection was stored at ${finalKeyFileName}!`);

// Store the final list of 15 possible answer choices for each item in the collection

const answerChoices = [];

finalSpeciesNames.forEach((name, index) => {

	let answerSourceNames = [...speciesSourceNames.filter((temp) => temp !== name)];

	shuffle(answerSourceNames);

	answerSourceNames = [name, ...answerSourceNames.slice(0, 14)];

	shuffle(answerSourceNames);

	answerChoices.push({
		options: answerSourceNames,
	});

});

const finalAnswerChoicesFileName = `${privatePath}/collections/${COLLECTION_NAME}/answer-choices.json`;

fs.writeFileSync(finalAnswerChoicesFileName, JSON.stringify(answerChoices), (err) => {

	if (err) {
		throw new err;
	}

});

// Store the final list of audio files for the collection

finalSpeciesNames.forEach((name, index) => {

	if (!audioHashMap[name]) {
		throw new Error(`The audio file is missing for species="${name}"!`);
	}

	console.log(index);

	// Get the unique ID of the bird relative to the entire 10000
	const finalIndex = COLLECTION_START_INDEX + index;

	const originalFileName =
		`${privatePath}/audio-original/${finalIndex}-original.mp3`;

	fs.copyFileSync(
		`${audioFolder}/${audioHashMap[name]}`,
		originalFileName,
	);

});

console.log(`The audio files for the ${COLLECTION_NAME} collection were stored at ${privatePath}/audio-original!`);

process.exit(0);

function shuffle(array) {

	let currentIndex = array.length,  randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];

	}

	return array;

}