const fs = require("fs");
const OpenAI = require("openai");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "waterfowl-1";
const COLLECTION_START_INDEX = 1000;
const COLLECTION_SIZE = 1000;

const privatePath = path.join(__dirname, `../../private/${process.env.NODE_ENV}`);

// https://platform.openai.com/docs/guides/images/usage?lang=node.js

const openai = new OpenAI({
	apiKey: process.env.OPENAI_PRIVATE_API_KEY,
});

// Get the list of species names to use as answer key for the collection

const speciesNames = fs.readFileSync(
	`${privatePath}/collections/${COLLECTION_NAME}/key.txt`, "utf8"
).split(/\r?\n/);

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

// Generate and store the final image files for the collection
(async () => {

	/*

	Resolution Price:

	1024×1024 = $0.04 / image

	n: The number of images to generate. Must be between 1 for dall-e-3

	size: The size of the generated images. Must be one of 256x256, 512x512, or 1024x1024.

	Rate Limits:

	https://platform.openai.com/account/limits

	dall-e-3
	3 RPM (3 requests per minute)
	200 RPD (200 requests per day)
	1 image per minute (on free tier)

	*/

	console.log(`Generating images for the ${COLLECTION_NAME} collection:`);

	const errors = [];

	const redos = [272];

	for (let temp = 0; temp < redos.length; temp++) {

		const i = redos[temp];

		if (i === 967 || i === 339 || i === 326 || i === 77 || i === 146) {
			continue;
		}

		try {

			await generateImage(i);

		} catch (error) {
			console.error(error);
			errors.push(i);
		}

		// Wait 9s before generating the next image to avoid issues with rate-limiting
		await sleep(1000 * 9);

	}

	// Attempt to re-generate any images that errored on the initial API call

	const finalErrors = [];

	for (let i = 0; i < errors.length; i++) {

		const errorID = errors[i];

		try {

			await generateImage(errorID);

		} catch (error) {
			console.error(error);
			finalErrors.push(errorID);
		}

	}

	console.log('------------- errors ---------------');
	console.log(finalErrors);
	console.log('------------------------------------');

})();

async function generateImage(i) {

	// Get the species name of the bird
	const name = speciesNames[i];

	// Get the unique ID of the bird relative to the entire 10000
	const finalIndex = COLLECTION_START_INDEX + i;

	let promptName = name, colorsToFeature = '';

	if (promptName === 'Ring-necked Duck') {

		colorsToFeature += ' with focus on the black head, gray bill featuring a white stripe at top, and a yellow eye';

	} else if (promptName === 'Cinnamon Teal') {

		promptName += ' duck';
		colorsToFeature += ' with focus on the color cinnamon';

	} else if (promptName === 'Canvasback') {

		promptName += ' duck';
		colorsToFeature += ' with focus on the black chest, white body, sloping forehead and stout neck';

	} else if (promptName === 'Eurasian Wigeon') {

		promptName += ' duck';
		colorsToFeature += ' with focus on the gray body, bright rufous-brown head, and buffy-cream forehead';

	} else if (promptName.endsWith('Petrel') || promptName.endsWith('Black-backed Gull') || promptName.endsWith('Gannet')) {

		promptName += ' small bird flying over water';
		colorsToFeature += ' with short skinny beak';

	} else if (promptName === 'Northern Pintail' ) {

		promptName += ' duck';
		colorsToFeature += ' with focus on the long tail';

	} else if (promptName === 'Common Crane' ) {

		promptName += ' bird';
		colorsToFeature += ' with focus on the tall height of its body and legs';

	} else if (promptName === 'Little Stint') {

		promptName += ' bird foraging in the sand'

	} else if (promptName === 'Dovekie') {

		promptName = ' small auk bird';
		colorsToFeature += ' with focus on black and white contrasting colors on its body'

	} else if (promptName === 'Red Knot') {

		promptName = ' common sandpiper wading in the water'
		colorsToFeature + ', large round body, brilliant terracotta-orange underparts and intricate gold, red, rufous, and black upperparts';

	} else {

		promptName += ' bird';

	}

	console.log(`---${finalIndex}---`);

	const prompt = `Create a vibrant, abstract illustration of a ${promptName} in a geometric style, influenced by Cubism and Piet Mondrian. The bird should feature a variety of bright colors${colorsToFeature}. The background should consist of geometric shapes, integrating smoothly to produce a visually striking and harmonious scene.`;

	const response = await openai.images.generate({
		model: "dall-e-3",
		prompt,
		n: 1,
		size: "1024x1024",
		quality: "standard",
		response_format: "b64_json",
	});

	const imageData = response.data[0]["b64_json"];

	const imageBuffer = Buffer.from(imageData, "base64");

	fs.writeFileSync(
		`${privatePath}/images-to-verify/${i}-${name}.webp`,
		imageBuffer,
		(err) => {

			if (err) {
				throw new err;
			}

		},
	);

	fs.writeFileSync(
		`${privatePath}/images-original/${finalIndex}.webp`,
		imageBuffer,
		(err) => {

			if (err) {
				throw new err;
			}

		},
	);

};
