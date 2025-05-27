const fs = require("fs");
const OpenAI = require("openai");
const path = require("path");

// TODO: Double check the Hawaiian Spellings before deploying!
// TODO: Verify audio for "Mexican Whip-poor-will"
// TODO: Verify audio for "Millerbird"
// TODO: Verify audio for "Palila"
// TODO: Verify audio for "Wood Sandpiper"

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "masters-of-disguise-8";
const COLLECTION_START_INDEX = 8000;
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

// Get the list of bird species to use as source for the collection

const speciesSourceBirds = require(
	`${privatePath}/collections/${COLLECTION_NAME}/source.json`,
);

const speciesSourcePrompts = {};
const speciesSourceColors = {};
const speciesSourceNameOverrides = {};

speciesSourceBirds.forEach((bird) => {

	speciesSourcePrompts[bird.name] = bird.prompt;
	speciesSourceColors[bird.name] = bird.colors;
	speciesSourceNameOverrides[bird.name] = bird.name_override;

});

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

	const redoList = [];
	const todoList = [];
	const skipList = [];

    for (let i = 0; i < 1000; i += 1) {

    	if (redoList.indexOf(i) === -1) { continue; }

        if (skipList.indexOf(i) >= 0) { continue; }

        todoList.push(i);

    }

    const initialErrors = await runBatch(todoList);

   	// Attempt to re-generate any images that errored on the initial API call
    const finalErrors = await runBatch(initialErrors);

	console.log("------------- errors ---------------");
	console.log(finalErrors);
	console.log("------------------------------------");

})();

async function runBatch(birdIds) {

    const done = {};
    const errors = [];

	let numImagesRequested = 0;

    // Process images in batches of 15
	for (let batchStart = 0; batchStart < birdIds.length; batchStart += 15) {

		const batchEnd = Math.min(batchStart + 15, birdIds.length);
		const batch = [];

		// Build batch of promises
		for (let i = batchStart; i < batchEnd; i++) {

			const name = speciesNames[birdIds[i]];

			// if (done[name]) { continue; } else { done[name] = true; }

			// if (skipList.indexOf(i) >= 0) { continue; }

			const promise = (async () => {

				try {

					numImagesRequested += 1;

					const imgResponse = await generateImage(birdIds[i]);

				} catch (error) {
					console.error(error);
					errors.push(birdIds[i]);
				}

			})();

			batch.push(promise);

			if (numImagesRequested === 15) {
				await sleep(61 * 1000);
				numImagesRequested = 0;
			}

		}

	}

    return errors;

}

async function generateImage(i) {

	// Get the species name of the bird
	const name = speciesNames[i];

	// Get the unique ID of the bird relative to the entire 10000
	const finalIndex = COLLECTION_START_INDEX + i;

	const promptName = speciesSourceNameOverrides[name] || name;
	const locationToFeature = speciesSourcePrompts[name];
	const colorsToFeature = speciesSourceColors[name];

	if (!locationToFeature) { throw new Error('MISSING LOCATION TO FEATURE'); }
	if (!colorsToFeature) { throw new Error('MISSING COLORS TO FEATURE'); }

	console.log(`---${finalIndex}---`);

	const prompt = `Create a vibrant, abstract illustration of a ${promptName} in a geometric style, influenced by Cubism and Piet Mondrian. It should ${colorsToFeature}. It should be ${locationToFeature}. The background should integrate smoothly using natural, earthy tones with muted, camouflaged colors that blend seamlessly into the surrounding environment to produce a visually striking and harmonious scene, but it must be abstract in the style of Cubism and/or Piet Mondrian.`;

	console.log(prompt);

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

    return true;

};
