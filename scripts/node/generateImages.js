const fs = require("fs");
const OpenAI = require("openai");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "picasso";
const COLLECTION_START_INDEX = 0;
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

	for (let i = 0; i < COLLECTION_SIZE; i++) {

		// Get the species name of the bird
		const name = speciesNames[i];

		// Get the unique ID of the bird relative to the entire 10000
		const finalIndex = COLLECTION_START_INDEX + i;

		console.log(`---${finalIndex}---`);

		const response = await openai.images.generate({
			model: "dall-e-3",
			prompt: `A ${name} bird in the style of a ${COLLECTION_NAME} painting`,
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
			`${privatePath}/images-hidden/${finalIndex}.webp`,
			imageBuffer,
			(err) => {

				if (err) {
					throw new err;
				}

			},
		);

		// Wait 13s before generating the next image to avoid issues with rate-limiting
		await sleep(1000 * 13);

	}

})();
