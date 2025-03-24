const fs = require("fs");
const OpenAI = require("openai");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "eggstravaganza-7";
const COLLECTION_START_INDEX = 7000;
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

const speciesSourceTypes = {};

speciesSourceBirds.forEach((bird) => {

	speciesSourceTypes[bird.name] = bird.type;

});

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

/*

Eggstravaganza - The Birds of Easter & Eggs

This flock celebrates birds that symbolize rebirth, new beginnings, and the beauty of eggs—a perfect tribute to Easter!

From birds with striking egg-like plumage to famous nest-builders, this collection highlights the
wonders of avian reproduction and the spirit of springtime.

This flock brings the magic of Easter and the beauty of bird eggs into one charming collection!

Types of Birds in the Flock:

    Egg-cellent Layers – Birds known for their unique eggs (e.g., Emu, Tinamous, Killdeer).

    Spring Symbols – Birds associated with renewal, joy, and Easter traditions (e.g., European Robin, Dove, Swallow).

    Nest Masters – Birds that build intricate, artistic, or hidden nests (e.g., Bowerbirds, Weavers, Ovenbirds).

    Egg-Colored Birds – Birds with pastel or speckled egg-like plumage (e.g., Snowy Plover, Cream-colored Courser).s

Visual Concept:

    Soft pastel color palette (baby blue, pale yellow, soft pink, mint green) reminiscent of dyed Easter eggs.

    Backgrounds featuring nests, spring flowers, and grass fields with hidden eggs in the scenery.

    Some birds posed next to their eggs or with hatchlings emerging to emphasize the theme of renewal.

*/

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

	const skipList = [];

    const redoList = [];

    const todoList = [];

    for (let i = 0; i < 1000; i += 1) {

        if (redoList.indexOf(i) === -1) { continue; }

        todoList.push(i);

    }

    const [doneSpecies1, initialErrors] = await runBatch(todoList);

   	// Attempt to re-generate any images that errored on the initial API call
    const [, finalErrors] = await runBatch(initialErrors);

	console.log("------------- errors ---------------");
	console.log(finalErrors);
	console.log("------------------------------------");

})();

async function runBatch(birdIds) {

    const done = {};
    const errors = [];

    // Process images in batches of 15
	for (let batchStart = 0; batchStart < birdIds.length; batchStart += 15) {

		const batchEnd = Math.min(batchStart + 15, birdIds.length);
		const batch = [];

		// Build batch of promises
		for (let i = batchStart; i < batchEnd; i++) {

		    console.log(birdIds[i]);

			const name = speciesNames[birdIds[i]];

			const promise = (async () => {

			 try {

				const imgResponse = await generateImage(birdIds[i]);

					if (imgResponse) {
						done[name] = true;
					}

				} catch (error) {
					console.error(error);
					errors.push(birdIds[i]);
				}
			})();

			batch.push(promise);

		}

		// Sleep for 61 seconds
        await sleep(61 * 1000);

	}

    return [done, errors];

}

async function generateImage(i) {

	// Get the species name of the bird
	const name = speciesNames[i];

	// Get the unique ID of the bird relative to the entire 10000
	const finalIndex = COLLECTION_START_INDEX + i;

	let promptName = name, colorsToFeature = '', locationToFeature = '';

	// if (speciesSourceTypes[name] === "fire") {

	//	locationToFeature = "warm color tones indicating the theme of fire and summer";

	// } else if (speciesSourceTypes[name] === "ice") {

	//	locationToFeature = "cold color tones indicating the theme of ice and winter";

	// } else {
	//	throw new Error("Encountered a bird without fire or ice...");
	// }

	// Predator & Prey
    if (promptName === "Aplomado Falcon") {
        colorsToFeature = "It should be a sleek, medium-sized falcon with a long, narrow tail, pointed wings, and a striking black and white face pattern, with rusty brown and grayish feathers on the back and wings.";
        locationToFeature = "The background should consist of a vast open landscape with scattered shrubs, grasslands, and arid deserts, where the Aplomado Falcon has a small dead rodent in its claws.";
	} else {

		// SKIP EVERYTHING ELSE FOR NOW
		console.log('SKIPPED -> ', i, " -> ", promptName);

		return false;

	}

	console.log(`---${finalIndex}---`);

	const prompt = `Create a vibrant, abstract illustration of a ${promptName} in a geometric style, influenced by Cubism and Piet Mondrian. ${colorsToFeature} ${locationToFeature} The background should integrate smoothly to produce a visually striking and harmonious scene.`;

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
