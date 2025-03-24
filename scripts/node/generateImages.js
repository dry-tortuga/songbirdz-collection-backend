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

	const skipList = [330, 559, 658, 909]; // 1of1s

    const redoList = [106];

    const todoList = [];

    for (let i = 0; i < 1000; i += 1) {

        if (redoList.indexOf(i) === -1) { continue; }

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

    // Process images in batches of 15
	for (let batchStart = 0; batchStart < birdIds.length; batchStart += 15) {

		const batchEnd = Math.min(batchStart + 15, birdIds.length);
		const batch = [];

		// Build batch of promises
		for (let i = batchStart; i < batchEnd; i++) {

			const name = speciesNames[birdIds[i]];

			if (done[name]) { continue; } else { done[name] = true; }

			const promise = (async () => {

				try {

					const imgResponse = await generateImage(birdIds[i]);

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

    return errors;

}

async function generateImage(i) {

	// Get the species name of the bird
	const name = speciesNames[i];

	// Get the unique ID of the bird relative to the entire 10000
	const finalIndex = COLLECTION_START_INDEX + i;

	let promptName = name, colorsToFeature = '', locationToFeature = '', eggsToFeature = '';

	// Predator & Prey
	if (promptName === "Abert's Towhee") {
	    colorsToFeature = "Earthy brown tones with soft grayish underparts. A prominent dark streak on the head.";
	    locationToFeature = "Nestled among shrubs, grassy fields, or brush. Background can feature springtime grass and flowers.";
	    eggsToFeature = " 3-4 eggs, light brown with darker speckling.";
	} else if (promptName === "Arctic Tern") {
	    colorsToFeature = "Bright white with black on the head and wings, sleek and aerodynamic build.";
	    locationToFeature = "A coastal setting, with rocky cliffs and calm water, perfect for nesting on the shore.";
	    eggsToFeature = " 1-2 eggs, light brown with darker speckles.";
	} else if (promptName === "Black-capped Vireo") {
	    colorsToFeature = "Dark olive green back, pale yellow underside, with a distinctive black crown.";
	    locationToFeature = "Nested in dense shrubs and trees. A warm, pastel background of early spring blooms.";
	    eggsToFeature = "2-4 eggs, pale with darker speckling, slightly oval.";
	} else if (promptName === "Blue-gray Gnatcatcher") {
	    colorsToFeature = "Light blue-gray plumage with a white underside and distinctive black tail.";
	    locationToFeature = "Often in scrubby habitats, framed by spring flowers and green foliage.";
	    eggsToFeature = " 3-4 small, pale eggs with light speckling.";
	} else if (promptName === "Black-rumped Waxbill") {
	    colorsToFeature = "Bright red and brown tones, with black markings on the rump and tail.";
	    locationToFeature = "Located in grasslands or savannas, with nests in shrubs or trees. Soft, light backgrounds.";
	    eggsToFeature = " 2-4 eggs, white to pale pinkish hue, with faint speckling.";
	} else if (promptName === "Brandt's Cormorant") {
	    colorsToFeature = "Glossy black feathers with greenish-blue highlights and a slightly yellow throat patch.";
	    locationToFeature = "On rocky coasts, with a backdrop of ocean or cliffs. Sea grasses and coastal plants.";
	    eggsToFeature = " 2-4 eggs, light greenish-blue with a rough texture.";
	} else if (promptName === "Brewer's Blackbird") {
	    colorsToFeature = "Iridescent black plumage, with hints of blue and purple, and a striking yellow eye.";
	    locationToFeature = "Open fields, pastures, and meadows, set against a spring green landscape.";
	    eggsToFeature = " 3-4 eggs, light blue with darker speckles.";
	} else if (promptName === "Bristle-thighed Curlew") {
	    colorsToFeature = "Buff-colored plumage with long, curved bill and striking black and white patterns.";
	    locationToFeature = "Coastal plains, marshes, or fields with tall grasses, soft pastel skies.";
	    eggsToFeature = " 2-3 eggs, brown with dark speckles.";
	} else if (promptName === "Cackling Goose") {
	    colorsToFeature = "Dark brown body with a white cheek patch and black neck, resembling a miniature Canada goose.";
	    locationToFeature = "Wetlands, lakes, or grassy meadows, with spring flowers and soft grass as the backdrop.";
	    eggsToFeature = " 4-6 eggs, light cream or pale brown with speckling.";
	} else if (promptName === "California Quail") {
	    colorsToFeature = "Grayish-brown plumage with a distinctive black topknot and a white streak down the face.";
	    locationToFeature = "Woodlands, brushy areas, with a peaceful, floral spring setting.";
	    eggsToFeature = " 10-14 eggs, creamy white or pale beige with light speckles.";
	} else if (promptName === "Canada Warbler") {
	    colorsToFeature = "Yellow belly with dark streaking, olive green back, and a striking black line through the eyes.";
	    locationToFeature = "Dense woodland and thickets, surrounded by spring blooms and early green leaves.";
	    eggsToFeature = " 3-5 eggs, pale greenish-blue with darker speckles.";
	} else if (promptName === "Cape May Warbler") {
	    colorsToFeature = "Bright yellow with a dark streaked chest and a subtle greenish tint to the wings.";
	    locationToFeature = "Open woods or flowering trees, with soft pastels in the background.";
	    eggsToFeature = " 3-4 eggs, light blue with dark speckling.";
	} else if (promptName === "Common Ground Dove") {
	    colorsToFeature = "Grayish-brown with a subtle pinkish hue on the chest and a pale belly.";
	    locationToFeature = "Open grasslands or shrublands, with a backdrop of soft spring flowers.";
	    eggsToFeature = " 2 eggs, white and small.";
	} else if (promptName === "Common Murre") {
	    colorsToFeature = "Black and white with a sleek body and a sharp, pointed beak.";
	    locationToFeature = "Coastal cliffs or rocky shores, with a sea breeze and the deep blue ocean as the backdrop.";
	    eggsToFeature = " 1 egg, pale green or light brown with darker spots.";
	} else if (promptName === "Common Ringed Plover") {
	    colorsToFeature = "Light brown back with a white belly and a black ring around its neck.";
	    locationToFeature = "Sandy shores, beaches, or wetlands, with soft waves and spring blossoms in the background.";
	    eggsToFeature = " 3-4 eggs, pale gray or light brown with dark speckles.";
	} else if (promptName === "Couch's Kingbird") {
	    colorsToFeature = "Bright yellow belly with gray wings and a slightly darker head.";
	    locationToFeature = "Open spaces with scattered trees or shrubby areas, spring fields and flowers in the background.";
	    eggsToFeature = " 3-4 eggs, light brown with darker speckles.";
	} else if (promptName === "Crimson-collared Grosbeak") {
	    colorsToFeature = "Bright crimson red collar and a contrasting black body with a chunky beak.";
	    locationToFeature = "Wooded areas or open forests with abundant spring flowers and gentle breezes.";
	    eggsToFeature = " 2-4 eggs, pale greenish-blue with speckling.";
	} else if (promptName === "Dusky Flycatcher") {
	    colorsToFeature = "Dusky gray-brown feathers with subtle olive undertones and a pale belly.";
	    locationToFeature = "Woodlands and forest edges, with a soft backdrop of budding spring plants.";
	    eggsToFeature = " 3-4 eggs, pale blue with dark speckles.";
	} else if (promptName === "Eastern Yellow Wagtail") {
	    colorsToFeature = "Bright yellow underparts with olive greenish wings and a long, slender tail.";
	    locationToFeature = "Wet meadows, fields, and grassy shores, set against a pastel sky and spring flowers.";
	    eggsToFeature = " 3-5 eggs, pale blue or greenish with speckles.";
	} else if (promptName === "Elegant Tern") {
	    colorsToFeature = "White body with a striking black crest and a bright orange-yellow beak.";
	    locationToFeature = "Coastal shores or salt flats, with a light pastel sunset background.";
	    eggsToFeature = " 1-2 eggs, light brown or green with faint speckling.";
	} else if (promptName === "Eurasian Skylark") {
	    colorsToFeature = "Brown, streaked plumage with a distinctive crest on top of the head.";
	    locationToFeature = "Open grasslands or meadows with a soft pastel sky and blooming wildflowers.";
	    eggsToFeature = " 3-5 eggs, pale cream with speckling.";
	} else if (promptName === "Golden-crowned Sparrow") {
	    colorsToFeature = "Distinctive golden crown with olive-brown back and a pale, light belly.";
	    locationToFeature = "Dense shrubland or forest edges, with a spring backdrop of soft grass and blooming flowers.";
	    eggsToFeature = " 3-5 eggs, light brown with darker speckling.";
	} else if (promptName === "Greater Pewee") {
	    colorsToFeature = "Grayish-brown plumage with a slightly pale belly and a darker face.";
	    locationToFeature = "Wooded areas or forest edges, with tall trees and soft spring flowers at the ground level.";
	    eggsToFeature = " 3-5 eggs, pale cream with dark speckles.";
	} else if (promptName === "Greater Yellowlegs") {
	    colorsToFeature = "Grayish-brown upperparts with a white belly and long, bright yellow legs.";
	    locationToFeature = "Marshes, wetlands, and coastal mudflats, set against a soft pastel sunset or sky.";
	    eggsToFeature = " 3-4 eggs, pale brown with dark speckling.";
	} else if (promptName === "Green Parakeet") {
	    colorsToFeature = "Vibrant green plumage with a slight yellowish tint and a hint of blue around the wings.";
	    locationToFeature = "Tropical or subtropical trees, with a bright background of spring foliage.";
	    eggsToFeature = " 2-4 eggs, white or pale blue with faint speckling.";
	} else if (promptName === "Groove-billed Ani") {
	    colorsToFeature = "Sleek black plumage with a slightly iridescent sheen and a distinctive curved bill.";
	    locationToFeature = "Tropical or subtropical forests, with dense foliage and a background of spring flowers.";
	    eggsToFeature = " 3-5 eggs, pale blue with darker speckles.";
	} else if (promptName === "Hawaiian Coot") {
	    colorsToFeature = "Dark gray plumage with a white frontal shield and red eyes.";
	    locationToFeature = "Marshes or ponds in Hawaii, with soft greenery and warm pastel skies in the background.";
	    eggsToFeature = " 3-5 eggs, light brown with dark speckling.";
	} else if (promptName === "Henslow's Sparrow") {
	    colorsToFeature = "Olive-brown plumage with a pale belly and streaked back.";
	    locationToFeature = "Grassy meadows or wetlands, with a soft spring backdrop of grasses and flowers.";
	    eggsToFeature = " 3-5 eggs, light brown with dark speckling.";
	} else if (promptName === "Horned Grebe") {
	    colorsToFeature = "Distinctive black plumage with striking red eyes and a black crest on the head.";
	    locationToFeature = "Ponds or lakes, with soft pastels of spring flowers around the water's edge.";
	    eggsToFeature = " 2-4 eggs, pale brown or olive with dark spots.";
	} else if (promptName === "Island Scrub-Jay") {
	    colorsToFeature = "Bright blue plumage with a white belly and a black line running through the eye.";
	    locationToFeature = "Coastal scrubland or island forests, set against spring flowers and a light pastel backdrop.";
	    eggsToFeature = " 3-4 eggs, pale blue with dark speckling.";
	} else if (promptName === "Ivory Gull") {
	    colorsToFeature = "Pure white feathers with yellowish-orange beak and black feet.";
	    locationToFeature = "Coastal icy regions, with snowy and soft pastel sky in the background.";
	    eggsToFeature = " 2-3 eggs, pale cream with faint speckles.";
	} else if (promptName === "Kirtland's Warbler") {
	    colorsToFeature = "Bright yellow underparts with olive green back and a dark streaked chest.";
	    locationToFeature = "Sparse forests with young trees and shrubs, surrounded by vibrant spring blooms.";
	    eggsToFeature = " 3-5 eggs, pale greenish-blue with dark speckling.";
	} else if (promptName === "Lapland Longspur") {
	    colorsToFeature = "Streaked brown and black plumage with a pale underbelly and a distinctive white throat.";
	    locationToFeature = "Open tundra or grasslands, with a soft backdrop of blooming wildflowers and grassy fields.";
	    eggsToFeature = " 3-5 eggs, pale brown with darker speckles.";
	} else if (promptName === "Lesser Goldfinch") {
	    colorsToFeature = "Bright yellow body with a dark greenish-black back and wings, with a black cap on the head.";
	    locationToFeature = "Open woodlands or shrubby areas, with a soft, light spring setting in the background.";
	    eggsToFeature = " 3-6 eggs, pale blue with darker speckles.";
	} else if (promptName === "Little Gull") {
	    colorsToFeature = "White body with a dark gray mantle and black wingtips, a small and sleek appearance.";
	    locationToFeature = "Coastal shores, lakes, or wetlands, with soft spring flowers along the water's edge.";
	    eggsToFeature = " 1-2 eggs, pale gray or light brown with darker speckling.";
	} else if (promptName === "Marbled Murrelet") {
	    colorsToFeature = "Mottled brownish-gray feathers with a pale belly and dark wings.";
	    locationToFeature = "Coastal forests, often perched on tall trees near the ocean.";
	    eggsToFeature = " 1 egg, pale green or light brown with dark speckles.";
	} else if (promptName === "Masked Booby") {
	    colorsToFeature = "Bright white body with striking black wings and a yellow-orange bill.";
	    locationToFeature = "Tropical island shores, with a light, pastel-colored ocean background and sandy beaches.";
	    eggsToFeature = " 1-2 eggs, pale blue with faint speckles.";
	} else if (promptName === "Mexican Duck") {
	    colorsToFeature = "Brownish-gray plumage with a white belly and a dark head with a subtle greenish tint.";
	    locationToFeature = "Ponds, marshes, or lakes, with soft spring grasses and flowers at the water's edge.";
	    eggsToFeature = " 6-12 eggs, light cream with speckling.";
	} else if (promptName === "Monk Parakeet") {
	    colorsToFeature = "Green plumage with a yellowish belly, a bright blue tail, and a slightly darker head.";
	    locationToFeature = "Urban areas or open woodlands, with bright spring foliage and flowers in the background.";
	    eggsToFeature = " 4-6 eggs, white or pale blue with faint speckling.";
	} else if (promptName === "Mountain Quail") {
	    colorsToFeature = "Grayish-brown plumage with a distinctive topknot and white streaks along the sides.";
	    locationToFeature = "Rocky mountain slopes, surrounded by tall grasses, with pastel skies and spring flowers.";
	    eggsToFeature = " 8-14 eggs, creamy white or light brown with speckles.";
	} else if (promptName === "Northern Lapwing") {
	    colorsToFeature = "Dark green and brown plumage with striking black and white markings, and a prominent crest.";
	    locationToFeature = "Wet grasslands or marshes, with soft pastel spring flowers and green vegetation.";
	    eggsToFeature = " 3-4 eggs, brown with dark spots.";
	} else if (promptName === "Northern Rough-winged Swallow") {
	    colorsToFeature = "Brownish-gray with a pale belly, with slight dark streaks on the chest.";
	    locationToFeature = "Open fields or wetlands, with soft spring skies and blooming wildflowers.";
	    eggsToFeature = " 4-6 eggs, white or pale cream with speckling.";
	} else if (promptName === "Olive Sparrow") {
	    colorsToFeature = "Olive green and brown plumage with subtle yellowish underparts.";
	    locationToFeature = "Scrubby areas and arid woodlands, with a soft backdrop of spring flowers.";
	    eggsToFeature = " 2-4 eggs, light brown with speckling.";
	} else if (promptName === "Pigeon Guillemot") {
	    colorsToFeature = "Black body with white wing patches and a striking red-orange beak.";
	    locationToFeature = "Rocky coastal shores, with a bright blue ocean backdrop and wildflowers.";
	    eggsToFeature = " 1-2 eggs, light green or brown with darker spots.";
	} else if (promptName === "Pine Warbler") {
	    colorsToFeature = "Olive-green back with bright yellow underparts and a pale streaked chest.";
	    locationToFeature = "Coniferous forests or pine woodlands, with soft green spring grass and blooming flowers.";
	    eggsToFeature = " 3-5 eggs, pale greenish-blue with darker speckling.";
	} else if (promptName === "Rock Sandpiper") {
	    colorsToFeature = "Grayish-brown plumage with darker streaks on the back and pale underparts.";
	    locationToFeature = "Rocky shorelines or tidal flats, with a soft pastel sky and coastal plants.";
	    eggsToFeature = " 3-4 eggs, pale brown with darker speckles.";
	} else if (promptName === "Sedge Wren") {
	    colorsToFeature = "Brown and gray streaked plumage with a slightly pale underbelly and a short tail.";
	    locationToFeature = "Reeds, tall grasses, or marshes, with soft spring flowers and water in the background.";
	    eggsToFeature = " 4-6 eggs, light brown with darker speckles.";
	} else if (promptName === "Semipalmated Plover") {
	    colorsToFeature = "Light brown with a white belly and a black ring around the neck.";
	    locationToFeature = "Sandy beaches or mudflats, with soft ocean waves and spring flowers in the background.";
	    eggsToFeature = " 3-4 eggs, pale gray or light brown with dark speckles.";
	} else if (promptName === "Tree Swallow") {
	    colorsToFeature = "Iridescent blue-green back with a white belly and a slender body.";
	    locationToFeature = "Open woodlands or marshes, with soft spring flowers and tall grasses around.";
	    eggsToFeature = " 4-6 eggs, pale blue with darker speckles.";
	} else if (promptName === "Varied Thrush") {
	    colorsToFeature = "Vibrant orange and black plumage with a dark streaked chest.";
	    locationToFeature = "Forested areas with spring wildflowers and tall grasses as a backdrop.";
	    eggsToFeature = " 3-4 eggs, pale green with dark speckling.";
	} else {

		// SKIP EVERYTHING ELSE FOR NOW
		console.log('SKIPPED -> ', i, " -> ", promptName);

		return false;

	}

	console.log(`---${finalIndex}---`);

	const prompt = `Create a vibrant, abstract illustration of a ${promptName} in a geometric style, influenced by Cubism and Piet Mondrian. It should have ${colorsToFeature} ${locationToFeature} It should be nearby its clutch/nest of${eggsToFeature} The background should integrate smoothly to produce a visually striking and harmonious scene. It should use a soft pastel color palette (baby blue, pale yellow, soft pink, mint green, etc.) to evoke the theme of spring and easter.`;

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
