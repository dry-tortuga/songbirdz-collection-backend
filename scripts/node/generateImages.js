const fs = require("fs");
const OpenAI = require("openai");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "small-and-mighty-2";
const COLLECTION_START_INDEX = 2000;
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

	for (let i = 0; i < COLLECTION_SIZE; i++) {

		// if (ignoreList.findIndex((value) => value === i) >= 0) {
		//	continue;
		// }

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

	console.log("------------- errors ---------------");
	console.log(finalErrors);
	console.log("------------------------------------");

})();

async function generateImage(i) {

	// Get the species name of the bird
	const name = speciesNames[i];

	// Get the unique ID of the bird relative to the entire 10000
	const finalIndex = COLLECTION_START_INDEX + i;

	let promptName = name, colorsToFeature = '';

	if (promptName === "Mexican Violetear") {

		promptName += " hummingbird";
		colorsToFeature += " with overall deep green plumage and a dark violet cheek and breast patches. It should have a broad dark tail band. It should be drinking nectar out of a bright orange orchid with its beak inside the center of the flower";

	} else if (promptName === "Tricolored Munia") {

		colorsToFeature += " with handsome and striking rusty upperparts. Black head and underparts are cut by a broad white swath from flanks across the lower breast. It should have a stout gray bill and a pointed tail. It should have its beak open and be chewing on a yellow wheat plant";

	} else if (promptName === "Great Tit") {

		colorsToFeature += " with large size, yellow breast, black head, and bright white cheek patch. It should be eating a caterpillar";

	} else if (promptName === "Bluethroat") {

		promptName += " thrush-like bird";
		colorsToFeature += " with dull gray above, a round belly, and head-on view reveals a stunning pattern of electric blue throat with orange red in center. It should flash orange on its tail feathers. It should have a red berry in its beak and a nearby berry bush"

	} else if (promptName === "Blackburnian Warbler") {

		colorsToFeature += " with intricate black-and-white plumage set off by flame-orange face and glowing orange throat. It should be eating a spruce budworm off of a dead pile of leaves"

	} else if (promptName === "Bay-breasted Warbler" ) {

		colorsToFeature += " with black mask. It should have rich dark bay color on the crown, throat, and flanks. It should have streaked back and butter yellow neckpatch";

	} else if (promptName === "American Redstart" ) {

		colorsToFeature += " with mostly black body and a black eye. It should have bright orange patches on the sides, wings, and tail";

	} else if (promptName === "Allen's Hummingbird" ) {

		colorsToFeature += " with reddish orange throat, orange belly, and metallic green back";

	} else if (promptName === "Yellow-throated Vireo" ) {

		colorsToFeature += " with plain yellow throat, bright yellow eyering and lores, white streaks on wings"

	} else if (promptName === "Red Avadavat" ) {

		colorsToFeature += " with white speckles on the body and a large seed-eating finch beak"

	} else if (promptName === "Yellow-rumped Warbler") {

		colorsToFeature += " with black streaks down its breast and flanks, rump, crown. It should have a yellow throat, large white patch on its wing, and a major focus on the yellow square patch on the base of the tail"

	} else if (promptName === "Painted Redstart" ) {

		colorsToFeature += " with black-and-white wings, solid scarlet belly, white crescent below the eye, and white wing patches. It should be fanning its tail";

	} else if (promptName === "Wrentit") {

		colorsToFeature += " with plump body, streaky underbelly, long tail, and tiny black bill. It should have a small white eye";

	} else if (promptName === "Worm-eating Warbler") {

		colorsToFeature += " with olive colored body, buffy black head stripes, and dull yellow crown";

	} else if (promptName === "Virginia's Warbler") {

		colorsToFeature += " with big eyes and a white eye ring, and then should have a mostly gray body"

	} else if (promptName === "White-throated Swift") {

		colorsToFeature += " with long tail, chunky tube sized body, and arched wings in flight"

	} else if (promptName === "Blue-throated Mountain-gem") {

		promptName += " hummingbird";
		colorsToFeature += " with brilliant sapphire colored gorget/throat that glitters in good light, double white stripes on face and gray underparts"

	} else if (promptName === "Cactus Wren") {

		colorsToFeature += " with bright white eyebrow, speckled body, slight curve to the bill, and long barred tail";

	} else if (promptName === "Magnolia Warbler") {

		colorsToFeature += " with a very small bill, bright yellow chest, and distinctive black streaking that radiates from the neck to the belly";

	} else if (promptName === "Black-throated Blue Warbler") {

		colorsToFeature += " with a blue head and black face and black throat, white squares on wings";

	} else if (promptName === "Black-throated Green Warbler") {

		colorsToFeature += " with bright yellow face with olive cheeks, crown, back, and a contrasting solid black throat. It should have dark streaks on flanks";

	} else if (promptName === "Little Bunting") {

		colorsToFeature += " with an attractive contrasting head pattern: black crown with red-brown central stripe and pale eyering. Rufous cheeks bordered by narrow black lines framing the eyes. Heavily streaked patterns on the belly";

	} else if (promptName === "Winter Wren") {

		colorsToFeature += " with general light brown colored body, white eyebrow, subtle checkered pattern from chest to belly, and its tail cocked at a 45 degree angle upwards";

	} else if (promptName === "Olive Warbler") {

		colorsToFeature += " with focus on solid bright orange hood and black round patch that extends from eye to cheek in the shape of a teardrop"

	} else if (promptName.endsWith("Warbler")) {

		promptName += "";

	} else {

		promptName += " bird";

	}

	console.log(`---${finalIndex}---`);

	const prompt = `Create a vibrant, abstract illustration of a ${promptName} in a geometric style, influenced by Cubism and Piet Mondrian. The bird should feature a variety of colors${colorsToFeature}. The background should consist of geometric shapes, integrating smoothly to produce a visually striking and harmonious scene.`;

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
