const fs = require("fs");
const OpenAI = require("openai");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "night-and-day-3";
const COLLECTION_START_INDEX = 3000;
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

	const doneSpecies = {};

	const ignoreList = [];

	const redoList = [
    7,  57,  69, 120, 265, 280,
  301, 315, 357, 393, 405, 459,
  589, 610, 661, 673, 736, 803,
  816, 971
]
;

	for (let i = 0; i < COLLECTION_SIZE; i++) {

		if (redoList.findIndex((value) => value === i) === -1) {
			continue;
		}

		// Get the species name of the bird
		// const name = speciesNames[i];

		// if (doneSpecies[name]) { continue; }

		try {

			await generateImage(i);

			// doneSpecies[name] = true;

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

		// Get the species name of the bird
		// const name = speciesNames[errorID];

		// if (doneSpecies[name]) { continue; }

		try {

			await generateImage(errorID);

			// doneSpecies[name] = true;

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

	let promptName = name, colorsToFeature = '', locationToFeature = '', introColors = '';

	if (speciesSourceTypes[name] === "night") {

		locationToFeature += "all black night sky with some stars";
		introColors += "neon";

	} else if (speciesSourceTypes[name] === "day") {

		locationToFeature += "a subtle sunrise in a light blue sky";
		introColors += "bright";

	} else {
		throw new Error("Encountered a bird without day or night...");
	}

	if (promptName === "American Dipper") {

		colorsToFeature += " with chunky slate-gray body, long legs, rounded head and short neck. It should be walking in a flowing river of water."

	} else if (promptName === "American Pipit") {

		colorsToFeature += " with solid grayish upperparts and streaked belly and chest."

	} else if (promptName === "American Wigeon") {

		colorsToFeature += " with brownish gray head, wide green stripe behind the eye, white cap and white beak."

	} else if (promptName === "Antillean Nighthawk") {

		colorsToFeature += " with long wings, intricate brown and gray patterning, and bright white throat."

	} else if (promptName === "Bachman's Sparrow") {

		colorsToFeature += " with long round tail, brownish gray above with rusty-streaked feathers and a rusty crown. The throat should be buffy with sparse rusty streaks."

	} else if (promptName === "Bank Swallow") {

		colorsToFeature += " with small and compact body, brown above and white below, with contrasting dark chest band . It should be flying in the air with pointed wings and notched tail."

	} else if (promptName === "Black-backed Woodpecker") {

		colorsToFeature += " with solid black back, single white stripe on the face, yellow crown patch on top of head, and barred flanks."

	} else if (promptName === "Black-billed Cuckoo") {

		colorsToFeature += " with slender long tail, red eye ring and a long slightly curved black bill."

	} else if (promptName === "Black-billed Magpie") {

		colorsToFeature += " with long tail, bold black and white patterning. The wings and tail should shine with blue green iridescence."

	} else if (promptName === "Black-chinned Sparrow") {

		colorsToFeature += " with slim long tail, primarily gray, with a reddish-brown back streaked with black, brown wings and tail and a pink beak."

	} else if (promptName === "Black Rail") {

		colorsToFeature += " with a stocky chicken-like body, short bill and tail, dark gray head, black bill and chest, with white speckles on the upperparts."

	} else if (promptName === "Black Storm-Petrel") {

		colorsToFeature += " with large dark angular deeply notched tail. It should be flying over a body of water."

	} else if (promptName === "Blue Mockingbird") {

		colorsToFeature += " with dull blue plumage, a long rounded tail, black mask around reddish brown eyes."

	} else if (promptName === "Boat-tailed Grackle") {

		colorsToFeature += " with large body, long tail, yellow eye, glossy blue black with iridescent sheen."

	} else if (promptName === "Broad-winged Hawk") {

		colorsToFeature += " with broad wings that come to a slight point at the tips, barred upperparts, and black and white bands on the tail."

	} else if (promptName === "Brown Jay") {

		colorsToFeature += " with long rounded tail, dark chocolate color, and pale grayish belly."

	} else if (promptName === "Brown Thrasher") {

		colorsToFeature += " with reddish brown body, long tail and slightly curved bill."

	} else if (promptName === "Buff-collared Nightjar") {

		colorsToFeature += " with pale grayish body, pointed wings, and long tail."

	} else if (promptName === "Chimney Swift") {

		colorsToFeature += " with small cigar shaped body, long wings, and short tail. It should be flying in the air."

	} else if (promptName === "Common Nighthawk") {

		colorsToFeature += " with mottled gray and brown body, large black eyes, and small flat head."

	} else if (promptName === "Common Poorwill") {

		colorsToFeature += " with gray, brown, and buffy body. It should have white in the collar and outer tail feathers."

	} else if (promptName === "Elf Owl") {

		colorsToFeature += " with short tail, a V-shaped white stripe above their eyes, no ear tuffs, reddish brown coloring with vertical striped buff colored breast. It should be very small."

	} else if (promptName === "Flammulated Owl") {

		colorsToFeature += " with dark eyes, short ear tuffs, incomplete facial disk that runs from ears to mustache, gray brown rust and white plumage, with dark streaks in cross bars."

	} else if (promptName === "Lesser Nighthawk") {

		colorsToFeature += " with small flat head, large mouth, small feet, long wings, long tail."

	} else if (promptName === "Mangrove Cuckoo") {

		colorsToFeature += " with long tail, thick curved beak, long wings. It should have brown above, buffy below, black mask, and yellow eye ring. Bold black-and-white pattern on the underside of the tail."

	} else if (promptName === "Northern Fulmar") {

		colorsToFeature += " with white and gray body, thick yellow beak."

	} else if (promptName === "Northern Hawk Owl") {

		colorsToFeature += " with dark brownish black plumage with white spots, and streak on the head, back and wings. It should have a white underside and dark barring. It should have small golden eyes and golden bill."

	} else if (promptName === "Northern Pygmy-Owl") {

		colorsToFeature += " with small compact dark brown and white body, smooth rounded head, and piercing yellow eyes."

	} else if (promptName === "Red-vented Bulbul") {

		colorsToFeature += " with dark sleek body and bright red patch of feathers under its tail. It should have a black dark crest on its head."

	} else if (promptName === "Red-whiskered Bulbul") {

		colorsToFeature += " with tall pointed black crest, dark spur running onto the breast at shoulder level, thin black mustache like line on face, with a long brown tail and white terminal feather tips."

	} else if (promptName === "Ridgway's Rail") {

		colorsToFeature += " with chicken sized body, with large downward curving bill, and brown gray cinnamon colors."

	} else if (promptName === "Rufous-backed Robin") {

		colorsToFeature += " with a gray head, white throat, black streaks, deep rufous mantle and wing covers, orange chestnut upperparts, and a yellow bill and eyering."

	} else if (promptName === "Scaled Quail") {

		colorsToFeature += " with small plump chicken-like body, a short crest, a buffy top, and a marvelous pattern of dark brown and gray buff on the breast and belly. It should be in the desert."

	} else if (promptName === "Scott's Oriole") {

		colorsToFeature += " with black head, black, and breast. It should have vivid yellow underparts, a yellow shoulder patch, and white wing bar, black tail with a yellow base."

	} else if (promptName === "Sharp-shinned Hawk") {

		colorsToFeature += " with dark gray back and a white breast with rust colored bars."

	} else if (promptName === "Short-eared Owl") {

		colorsToFeature += " with black rimmed yellow eyes, a pale facial disk, no ear tuffs, and dark eye patches."

	} else if (promptName === "Solitary Sandpiper") {

		colorsToFeature += " with olive brown above, white eyering, pale body below, long bill and long neck."

	} else if (promptName === "Spot-breasted Oriole") {

		colorsToFeature += " with black face, black bib, black back, and black tail. It should have a bright orange head and body. Black spots on the side of the breast."

	} else if (promptName === "Spotted Owl") {

		colorsToFeature += " with dark brown eyes, round head, white spots on the head neck and back. It should have oval white spots on the chest and belly. The facial disk is brown with pale markings."

	} else if (promptName === "Sulphur-bellied Flycatcher") {

		colorsToFeature += " with bold white eyebrow and mustache, large bill, rufous tail, dark facepatch, and pale yellow belly."

	} else if (promptName === "Swainson's Thrush") {

		colorsToFeature += " with olive brown to rust brown colored upperparts, cream colored underside with pale brown spots."

	} else if (promptName === "Swamp Sparrow") {

		colorsToFeature += " with compact robust body, rusty wings, a gray chest, white ish throat and belly."

	} else if (promptName === "Thick-billed Vireo") {

		colorsToFeature += " with small greyish olive head and back, buffy white underparts and dark wings and tail."

	} else if (promptName === "Vaux's Swift") {

		colorsToFeature += " with small tubular body with long arched wings and short tail. It should be flying rapidly with brownish color and paler chest and rump."

	} else if (promptName === "Veery") {

		colorsToFeature += " with cinnamon brown above and a white belly and grayish face. It should be singing with with a faint buffy wash on the throat and breast."

	} else if (promptName === "Verdin") {

		colorsToFeature += " with gray back, white underparts, and yellow head and throat. It should  have a red-chesnut patch at the bend of its wings and a sharply pointed bill."

	} else if (promptName === "Western Kingbird") {

		colorsToFeature += " with gray head and bright yellow body."

	} else if (promptName === "Whiskered Screech-Owl") {

		colorsToFeature += " with mottled gray appearance with yellow and brown streaks and bars. It should have ear tufts and long facial whiskers, and golden eyes."

	} else if (promptName === "Yellow-billed Cuckoo") {

		colorsToFeature += " with a curved bill, grayish brown head, white underparts and a long black tail that has six white spots on the underside."

	} else if (promptName === "Yellow Rail") {

		colorsToFeature += " with chicken-like marsh bird body that is very skinny, it should have a short yellow bill and buffy yellow chest and face with the rest being brown to grey.";

	}

	console.log(`---${finalIndex}---`);

	const prompt = `Create a vibrant, abstract illustration of a ${promptName} in a geometric style, influenced by Cubism and Piet Mondrian. The bird should feature a variety of ${introColors} colors${colorsToFeature}. The background should consist of ${locationToFeature}, integrating smoothly to produce a visually striking and harmonious scene.`;

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
