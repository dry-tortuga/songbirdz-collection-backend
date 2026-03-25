const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");
const path = require("path");

const PRIVATE_FOLDER = path.join(
	__dirname,
	`../../private/${process.env.NODE_ENV}`
);

const PRIVATE_PATH = {
	COLLECTIONS: path.join(PRIVATE_FOLDER, "collections"),
	IMAGES: path.join(PRIVATE_FOLDER, "images-hidden"),
};

const AUDIO_METADATA = require("../../server/constants/audio-metadata.json");

const COLLECTION_KEYS = [
	"picasso-genesis-0",
	"deep-blue-1",
	"small-and-mighty-2",
	"night-and-day-3",
	"fire-and-ice-4",
	"predator-and-prey-5",
	"love-birds-6",
	"hatchlings-7",
	"masters-of-disguise-8",
	"final-migration-9",
];

const birdsWithoutAudio = {};

COLLECTION_KEYS.forEach((cKey, cIndex) => {
	fs.readFileSync(`${PRIVATE_PATH.COLLECTIONS}/${cKey}/key.txt`, "utf8")
		.split(/\r?\n/)
		.forEach((speciesName, birdIndex) => {

			// Get the unique ID of the bird relative to the entire 10,000
			const finalIndex = (cIndex * 1000) + birdIndex;

			const audioMetadata = AUDIO_METADATA[finalIndex];

			if (!AUDIO_METADATA[finalIndex]) {
				birdsWithoutAudio[speciesName] = true;
			}

		});
});

const result = Object.keys(birdsWithoutAudio);

result.sort();

const outputFileName = `${PRIVATE_FOLDER}/species-audio-recordings-missing.txt`;

fs.writeFileSync(outputFileName, result.join('\n'));

console.log(`txt file created at "${outputFileName}"!`);
