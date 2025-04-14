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

    // Process images in batches of 15
	for (let batchStart = 0; batchStart < birdIds.length; batchStart += 15) {

		const batchEnd = Math.min(batchStart + 15, birdIds.length);
		const batch = [];

		// Build batch of promises
		for (let i = batchStart; i < batchEnd; i++) {

			const name = speciesNames[birdIds[i]];

			// if (done[name]) { continue; } else { done[name] = true; }

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
		colorsToFeature = "Earthy brown tones with soft grayish and reddish brown underparts. A pale white bill contrasts with its dark face.";
		locationToFeature = "Nestled among shrubs, grassy fields, or brush. Background can feature springtime grass and flowers.";
		eggsToFeature = " 1-4 eggs, pale blue with darker speckling.";
	} else if (promptName === "Arctic Tern") {
		colorsToFeature = "Bright white with light gray upperparts, an all black head, and overall a sleek and aerodynamic build.";
		locationToFeature = "A coastal setting, with rocky cliffs and calm water, perfect for nesting on the shore.";
		eggsToFeature = " 1-2 eggs in the sand, light brown or light green with darker speckles as if resembling pebbles.";
	} else if (promptName === "Black-capped Vireo") {
	    colorsToFeature = "Dark olive green back, pale yellow underside, white belly, and with a distinctive black head and white spectacles that surround its red eye.";
	    locationToFeature = "Nested in dense shrubs and trees. A warm, pastel background of early spring blooms.";
	    eggsToFeature = " 3-4 white eggs, slightly oval.";
	} else if (promptName === "Blue-gray Gnatcatcher") {
	    colorsToFeature = "Light blue-gray plumage with a white underside and distinctive black tail.";
	    locationToFeature = "Often in scrubby habitats, framed by spring flowers and green foliage.";
	    eggsToFeature = " 4-5 small, pale blueish-white eggs with light speckling.";
	} else if (promptName === "Black-rumped Waxbill") {
		promptName = "Estrildid Finch";
	    colorsToFeature = "pale white-ish cream-colored body and a striking red streak of color across its face (all the way from the beak to behind the ear).";
	    locationToFeature = "Located in grasslands or savannas, with nests in shrubs or trees. Soft, light backgrounds.";
	    eggsToFeature = " 2-4 eggs, white to pale pinkish hue, with faint speckling.";
	} else if (promptName === "Brandt's Cormorant") {
	    colorsToFeature = "Glossy black feathers with purple sheen on head and a bright blue skin patch on throat.";
	    locationToFeature = "On rocky coasts, with a backdrop of ocean or cliffs. Sea grasses and coastal plants.";
	    eggsToFeature = " 3-5 pale blue eggs.";
	} else if (promptName === "Brewer's Blackbird") {
	    colorsToFeature = "Iridescent black plumage, with hints of blue and purple, and a striking yellow eye.";
	    locationToFeature = "Open fields, pastures, and meadows, set against a spring green landscape.";
	    eggsToFeature = " 3-4 eggs, pale gray with cloudy spots.";
	} else if (promptName === "Bristle-thighed Curlew") {
	    colorsToFeature = "Buff-colored plumage with long, curved bill and striking black and white patterns.";
	    locationToFeature = "Coastal plains, marshes, or fields with tall grasses, soft pastel skies.";
	    eggsToFeature = " 3-4 eggs, olive-brown with dark brown speckles.";
	} else if (promptName === "Cackling Goose") {
	    colorsToFeature = "Dark brown body with a white cheek patch and black neck, resembling a miniature Canada goose with a small bill.";
	    locationToFeature = "Wetlands, lakes, or grassy meadows, with spring flowers and soft grass as the backdrop.";
	    eggsToFeature = " 2-8 eggs in a shallow depression in the ground, light creamy white.";
	} else if (promptName === "California Quail") {
	    colorsToFeature = "Grayish-brown plumage with a distinctive black topknot and a white streak down the face.";
	    locationToFeature = "Woodlands, brushy areas, with a peaceful, floral spring setting.";
	    eggsToFeature = " 10-14 eggs, creamy white or pale beige with light speckles.";
	} else if (promptName === "Canada Warbler") {
	    colorsToFeature = "Yellow belly with black spots all down the neck, a dull gray back, and a striking bold white eye ring.";
	    locationToFeature = "Dense woodland and thickets, surrounded by spring blooms and early green leaves.";
	    eggsToFeature = " 3-5 eggs, creamy white with darker speckles.";
	} else if (promptName === "Cape May Warbler") {
	    colorsToFeature = "Bright yellow with a dark black streaks on chest and flanks, a distinctive chestnut cheek patch and yellow collar, black on top of head.";
	    locationToFeature = "Open woods or flowering trees, with soft pastels in the background.";
	    eggsToFeature = " 4-9 eggs, creamy white with reddish-brown splotches.";
	} else if (promptName === "Common Ground Dove") {
	    colorsToFeature = "Grayish-brown with a subtle pinkish hue on the chest and a pale belly. It should have an orange beak.";
	    locationToFeature = "Open grasslands or shrublands, with a backdrop of soft spring flowers.";
	    eggsToFeature = " 2 eggs, white and small.";
	} else if (promptName === "Common Murre") {
	    colorsToFeature = "Black black, all black head, and white belly, with a sleek body and a sharp, pointed beak.";
	    locationToFeature = "Coastal cliffs or rocky shores, with a sea breeze and the deep blue ocean as the backdrop.";
	    eggsToFeature = " 1 distinctive, pear-shaped egg with a narrow, almost pointed end and a broad, rounded end. The egg should be either white or turqoise in color.";
	} else if (promptName === "Common Ringed Plover") {
	    colorsToFeature = "Light brown back with a white belly and a bold black-and-white head and breast pattern, orange legs, bright orange bill with a black tip, and a short stout body overall.";
	    locationToFeature = "Sandy shores, beaches, or wetlands, with soft waves and spring blossoms in the background.";
	    eggsToFeature = " 3-4 eggs on the ground near some pebbles, pale gray or light brown with dark speckles.";
	} else if (promptName === "Couch's Kingbird") {
	    colorsToFeature = "Bright yellow belly with gray wings and a slightly darker head.";
	    locationToFeature = "Open spaces with scattered trees or shrubby areas, spring fields and flowers in the background.";
	    eggsToFeature = " 3-4 eggs, creamy white with darker speckles.";
	} else if (promptName === "Crimson-collared Grosbeak") {
	    colorsToFeature = "Bright crimson red collar and a contrasting black long body and black hood with a chunky black beak.";
	    locationToFeature = "Wooded areas or open forests with abundant spring flowers and gentle breezes.";
	    eggsToFeature = " 2-3 eggs, pale gray-blue with speckling."
	} else if (promptName === "Dusky Flycatcher") {
	    colorsToFeature = "Dusky gray-brown feathers with subtle olive undertones and a pale belly.";
	    locationToFeature = "Woodlands and forest edges, with a soft backdrop of budding spring plants.";
	    eggsToFeature = " 2-5 eggs, dull white with occasional brown spots.";
	} else if (promptName === "Eastern Yellow Wagtail") {
	    colorsToFeature = "Bright yellow underparts with olive greenish upperparts, a yellow throat, and a long, slender tail.";
	    locationToFeature = "Wet meadows, fields, and grassy shores, set against a pastel sky and spring flowers.";
	    eggsToFeature = " 3-5 eggs in a grass nest, pale green with speckles.";
	} else if (promptName === "Elegant Tern") {
	    colorsToFeature = "White body with a striking black crest and a bright orange-yellow beak.";
	    locationToFeature = "Coastal shores or salt flats, with a light pastel sunset background.";
	    eggsToFeature = " 1-2 eggs, Coinbase blue with faint speckling.";
	} else if (promptName === "Eurasian Skylark") {
	    colorsToFeature = "Brown, streaked plumage with a distinctive crest on top of the head.";
	    locationToFeature = "Open grasslands or meadows with a soft pastel sky and blooming wildflowers.";
	    eggsToFeature = " 3-5 eggs, pale gray with speckling.";
	} else if (promptName === "Golden-crowned Sparrow") {
	    colorsToFeature = "Distinctive gray face with black cap and golden crown patch, with mottled brown back and a pale belly, and grayish bill.";
	    locationToFeature = "Dense shrubland or forest edges, with a spring backdrop of soft grass and blooming flowers.";
	    eggsToFeature = " 3-5 eggs, pale blue with heavy reddish-brown spotting.";
	} else if (promptName === "Greater Pewee") {
	    colorsToFeature = "Grayish-brown plumage with a slightly pale belly and a bicolored orange and black bill.";
	    locationToFeature = "Wooded areas or forest edges, with tall trees and soft spring flowers at the ground level.";
	    eggsToFeature = " 3-4 eggs, pale cream with light speckles.";
	} else if (promptName === "Greater Yellowlegs") {
	    colorsToFeature = "Grayish-brown upperparts with a white belly and long, bright yellow legs.";
	    locationToFeature = "Marshes, wetlands, and coastal mudflats, set against a soft pastel sunset or sky.";
	    eggsToFeature = " 3-4 eggs in a ground nest, pale brown with dark speckling.";
	} else if (promptName === "Green Parakeet") {
	    colorsToFeature = "Vibrant green plumage throughout with a slight yellowish tint on belly and a bright orange beak.";
	    locationToFeature = "Tropical or subtropical trees, with a bright background of spring foliage.";
	    eggsToFeature = " 4-8 small white eggs.";
	} else if (promptName === "Groove-billed Ani") {
	    colorsToFeature = "Sleek black plumage with a slightly iridescent sheen and a distinctive curved bill.";
	    locationToFeature = "Tropical or subtropical forests, with dense foliage and a background of spring flowers.";
	    eggsToFeature = " 3-5 eggs, Coinbase blue with darker speckles.";
	} else if (promptName === "Hawaiian Coot") {
	    colorsToFeature = "Dark gray-black plumage with a white frontal shield and red eyes.";
	    locationToFeature = "Marshes or ponds in Hawaii, with soft greenery and warm pastel skies in the background.";
	    eggsToFeature = " 3-10 eggs in a floating nest, light tan with dark purple speckling.";
	} else if (promptName === "Henslow's Sparrow") {
	    colorsToFeature = "Olive-brown plumage with a pale belly and streaked back.";
	    locationToFeature = "Grassy meadows or wetlands, with a soft spring backdrop of grasses and flowers.";
	    eggsToFeature = " 3-5 blue eggs, use the Coinbase Inc. brand color for the blue (#0052FF).";
	} else if (promptName === "Horned Grebe") {
	    colorsToFeature = "Distinctive black plumage with striking red eyes, a black and rich gold crest on the head, and cinnamon neck.";
	    locationToFeature = "Ponds or lakes, with soft pastels of spring flowers around the water's edge.";
	    eggsToFeature = " 4-6 eggs, pale brown or olive with dark spots.";
	} else if (promptName === "Island Scrub-Jay") {
	    colorsToFeature = "Bright blue plumage with a white belly and a black line running through the eye.";
	    locationToFeature = "Coastal scrubland or island forests, set against spring flowers and a light pastel backdrop.";
	    eggsToFeature = " 3-4 blue eggs, use the exact Coinbase Inc. brand color for the blue (#0052FF).";
	} else if (promptName === "Ivory Gull") {
	    colorsToFeature = "Pure white feathers throughout with yellow-tipped black beak, black feet, and a dark eye.";
	    locationToFeature = "Coastal icy regions, with snowy and soft pastel sky in the background.";
	    eggsToFeature = " 1-3 eggs, pale brown with dark speckles.";
	} else if (promptName === "Kirtland's Warbler") {
	    colorsToFeature = "Bright yellow underparts with gray above, gray face, and dark streaks on back and wings.";
	    locationToFeature = "Sparse forests with young trees and shrubs, surrounded by vibrant spring blooms.";
	    eggsToFeature = " 3-5 eggs, pale white with fine brown spots concentrated around the larger end.";
	} else if (promptName === "Lapland Longspur") {
	    colorsToFeature = "Streaked brown and black plumage with a pale underbelly and a distinctive all black crown, all black throat, and a rusty chestnut colored neck.";
	    locationToFeature = "Open tundra or grasslands, with a soft backdrop of blooming wildflowers and grassy fields.";
	    eggsToFeature = " 3-5 eggs layed into a depression in the ground, pale olive-green with heavy spots.";
	} else if (promptName === "Lesser Goldfinch") {
	    colorsToFeature = "Bright yellow body with a dark greenish-black back and wings, with a black cap on the head.";
	    locationToFeature = "Open woodlands or shrubby areas, with a soft, light spring setting in the background.";
	    eggsToFeature = " 3-5 eggs in a cup shaped nest made of fine plant materials, pale blue with darker speckles.";
	} else if (promptName === "Little Gull") {
	    colorsToFeature = "White body with a light gray back, bright red legs, a black bill, and a 100% black head, and overall a very small and sleek appearance.";
	    locationToFeature = "Coastal shores, lakes, or wetlands, with soft spring flowers along the water's edge.";
	    eggsToFeature = " 2-3 eggs, pale gray or light olive with numerous dark splotches.";
	} else if (promptName === "Marbled Murrelet") {
	    colorsToFeature = "Mottled brownish-gray feathers throughout with dark wings, a white belly, and a short pointed beak.";
	    locationToFeature = "Coastal forests, often perched on tall trees near the ocean.";
	    eggsToFeature = " 1 one large, pale olive-green to greenish-yellow egg with brown spots on the ground.";
	} else if (promptName === "Masked Booby") {
	    colorsToFeature = "Bright white body with striking black wings and a yellow bill.";
	    locationToFeature = "Tropical island shores, with a light, pastel-colored ocean background and sandy beaches.";
	    eggsToFeature = " 1-2 chalky white eggs in a shallow depression in the sand.";
	} else if (promptName === "Mexican Duck") {
		promptName = "Female Mallard"
	    colorsToFeature = "Brownish plumage with a lighter neck and head and an olive-green to yellow bill.";
	    locationToFeature = "Ponds, marshes, or lakes, with soft spring grasses and flowers at the water's edge.";
	    eggsToFeature = " 3-4 large eggs, white with faint blue-green hue.";
	} else if (promptName === "Monk Parakeet") {
	    colorsToFeature = "Green plumage with a gray face, gray belly, a bright blue spot on tail, and an orange beak.";
	    locationToFeature = "Urban areas or open woodlands, with bright spring foliage and flowers in the background.";
	    eggsToFeature = " 5-8 white eggs in a nest built out of sticks.";
	} else if (promptName === "Mountain Quail") {
	    colorsToFeature = "Grayish-brown plumage with chestnut throat and 2 distinctive black plumes on top of its head, and white streaks along the sides.";
	    locationToFeature = "Rocky mountain slopes, surrounded by tall grasses, with pastel skies and spring flowers.";
	    eggsToFeature = " 9-10 eggs in a simple scrape concealed in vegetation, creamy white.";
	} else if (promptName === "Northern Lapwing") {
	    colorsToFeature = "Dark green and brown plumage with striking black and white markings, and a prominent crest.";
	    locationToFeature = "Wet grasslands or marshes, with soft pastel spring flowers and green vegetation.";
	    eggsToFeature = " 3-4 eggs layed in a simple scrape in the ground, brown with dark spots.";
	} else if (promptName === "Northern Rough-winged Swallow") {
	    colorsToFeature = "Brownish-gray with a pale belly, with slight dark streaks on the chest.";
	    locationToFeature = "Open fields or wetlands, with soft spring skies and blooming wildflowers.";
	    eggsToFeature = " 4-8 glossy white eggs layed within burrows in a dirt bank.";
	} else if (promptName === "Olive Sparrow") {
	    colorsToFeature = "Olive green and brown plumage, with distinctive brown stripes on the creamy head, and a pale beak.";
	    locationToFeature = "Scrubby areas and arid woodlands, with a soft backdrop of spring flowers.";
	    eggsToFeature = " 3-5 glossy white eggs layed on the ground near shrubbery.";
	} else if (promptName === "Pigeon Guillemot") {
		promptName = "Guillemot";
	    colorsToFeature = "velvety, dark black plumage throughout the entire body is set off by a small white patch on the wings and vivid scarlet feet.";
	    locationToFeature = "Rocky coastal shores, with a bright blue ocean backdrop and wildflowers.";
	    eggsToFeature = " 1-2 eggs, pale cream with darker spots.";
	} else if (promptName === "Pine Warbler") {
	    colorsToFeature = "Yellow-olive back with bright yellow underparts, yellow throat, and blurry streaking on the sides.";
	    locationToFeature = "Coniferous forests or pine woodlands, with soft green spring grass and blooming flowers.";
	    eggsToFeature = " 3-5 eggs, pale white with brown speckling.";
	} else if (promptName === "Rock Sandpiper") {
	    colorsToFeature = "Grayish-brown plumage with darker streaks on the back and pale underparts.";
	    locationToFeature = "Rocky shorelines or tidal flats, with a soft pastel sky and coastal plants.";
	    eggsToFeature = " 3-4 eggs layed in the ground, pale brown with brown blotches.";
	} else if (promptName === "Sedge Wren") {
	    colorsToFeature = "Brown and gray streaked plumage with a slightly pale underbelly and a short tail, and peachy flanks.";
	    locationToFeature = "Reeds, tall grasses, or marshes, with soft spring flowers and water in the background.";
	    eggsToFeature = " 6-8 white smooth eggs.";
	} else if (promptName === "Semipalmated Plover") {
	    colorsToFeature = "Light brown with a white belly and a black ring around the neck, with orange legs.";
	    locationToFeature = "Sandy beaches or mudflats, with soft ocean waves and spring flowers in the background.";
	    eggsToFeature = " 3-4 eggs in the sand, pale gray or light brown with dark speckles.";
	} else if (promptName === "Tricolored Blackbird") {
	    colorsToFeature = "black body with red shoulder patches and a white line below the shoulder.";
	    locationToFeature = "Open woodlands or marshes, with soft spring flowers and tall grasses around.";
	    eggsToFeature = " 3-4 eggs, pale blue with darker speckles.";
	} else if (promptName === "Varied Thrush") {
	    colorsToFeature = "Vibrant orange and black-blue plumage with a dark streaked chest.";
	    locationToFeature = "Forested areas with spring wildflowers and tall grasses as a backdrop.";
	    eggsToFeature = " 3-4 eggs, light sky blue in color.";
	}  else {

		// SKIP EVERYTHING ELSE FOR NOW
		console.log('SKIPPED -> ', i, " -> ", promptName);

		return false;

	}

	console.log(`---${finalIndex}---`);

	const prompt = `Create a vibrant, abstract illustration of a ${promptName} in a geometric style, influenced by Cubism and Piet Mondrian. It should have ${colorsToFeature} ${locationToFeature} It should be nearby its clutch of${eggsToFeature} The background should integrate smoothly to produce a visually striking and harmonious scene. It should use a soft pastel color palette (baby blue, pale yellow, soft pink, mint green, etc.) to evoke the theme of spring and easter.`;

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
