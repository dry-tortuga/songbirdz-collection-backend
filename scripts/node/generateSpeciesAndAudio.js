const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "predator-and-prey-5";
const COLLECTION_START_INDEX = 5000;
const COLLECTION_SIZE = 1000;

const FILE_NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

const privatePath = path.join(__dirname, `../../private/${process.env.NODE_ENV}`);

const audioFolder =  path.join(
	__dirname,
	`../../private/the-cornell-guide-to-bird-sounds--united-states-and-canada-v2021/files`,
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

// Get the list of bird species to use as source for the collection

const speciesSourceBirds = require(
	`${privatePath}/collections/${COLLECTION_NAME}/source.json`,
);

// Build the final list of species names (in randomized order)

let finalSpeciesNames = [];

speciesSourceBirds.forEach((bird) => {

	for (let i = 0; i < bird.count; i++) {
		finalSpeciesNames.push(bird.name);
	}

});

if (finalSpeciesNames.length !== COLLECTION_SIZE) {
	throw new Error(`The collection must contain exactly ${COLLECTION_SIZE} birds!`);
}

shuffle(finalSpeciesNames);
shuffle(finalSpeciesNames);
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

// Store the final list of 5 possible answer choices for each item in the collection

const answerChoices = [];

const speciesSourceNames = speciesSourceBirds.map((bird) => bird.name);

finalSpeciesNames.forEach((name) => {

	let answerSourceNames = [...speciesSourceNames.filter((temp) => temp !== name)];

	shuffle(answerSourceNames);

	answerSourceNames = [name, ...answerSourceNames.slice(0, 4)];

	shuffle(answerSourceNames);

	answerChoices.push({ options: answerSourceNames });

});

const finalAnswerChoicesFileName = `${privatePath}/collections/${COLLECTION_NAME}/answer-choices.json`;

fs.writeFileSync(finalAnswerChoicesFileName, JSON.stringify(answerChoices), (err) => {

	if (err) {
		throw new err;
	}

});

// Store the final list of audio files for the collection

console.log(`----- Generating the audio files for the ${COLLECTION_NAME} collection ------`);

finalSpeciesNames.forEach((name, index) => {

	console.log(index);

	if (!audioHashMap[name] || audioHashMap[name].length === 0) {
		throw new Error(`The audio file is missing for species="${name}"!`);
	}

	const audioFilesForSpecies = [...audioHashMap[name]];

	const selectedAudioFile = audioFilesForSpecies[Math.floor(Math.random() * audioFilesForSpecies.length)];

	// Get the unique ID of the bird relative to the entire 10000
	const finalIndex = COLLECTION_START_INDEX + index;

	const originalFileName =
		`${privatePath}/audio-original/${finalIndex}-original.mp3`;

	console.log(`Using audio file "${selectedAudioFile}" for "${name}"`);

	fs.copyFileSync(
		`${audioFolder}/${selectedAudioFile}`,
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
