const fs = require("fs");
const OpenAI = require("openai");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "fire-and-ice-4";
const COLLECTION_START_INDEX = 4000;
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

	const skipList = [];

	const redoList = [];

	for (let i = 0; i < COLLECTION_SIZE; i++) {

		// if (redoList.findIndex((value) => value === i) === -1) {
		//	continue;
		// }

		if (skipList.findIndex((value) => value === i) >= 0) {
			continue;
		}

		// Get the species name of the bird
		const name = speciesNames[i];

		if (doneSpecies[name]) { continue; }

		try {

			await generateImage(i);

			doneSpecies[name] = true;

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
		const name = speciesNames[errorID];

		if (doneSpecies[name]) { continue; }

		try {

			await generateImage(errorID);

			doneSpecies[name] = true;

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

	if (speciesSourceTypes[name] === "fire") {

		locationToFeature = "warm color tones indicating the theme of fire and summer";

	} else if (speciesSourceTypes[name] === "ice") {

		locationToFeature = "cold color tones indicating the theme of ice and winter";

	} else {
		throw new Error("Encountered a bird without fire or ice...");
	}

	if (promptName === "African Silverbill") {

		colorsToFeature = " be a small, delicate bird with a rounded body and a short, thick silvery-gray beak, which stands out against its light sandy-brown plumage. Its feathers are soft, blending from pale beige on its chest and underside to a slightly darker brown on its wings and tail. This bird has short, rounded wings and a short tail, which are darker brown, adding a bit of contrast. Its legs and feet are a pale pinkish-gray. The bird's overall appearance is gentle and unobtrusive, with an expression that seems curious but calm";
		locationToFeature += " , it should include tall grasslands or scattered shrubs"

	} else if (promptName === "Aleutian Tern") {

		colorsToFeature = " have a sleek body with long, pointed wings and a deeply forked tail. A black cap covers its head and extends into a mask around its eyes. It should have a sharp black bill and dark legs";
		locationToFeature += ", it should include a body of water such as the ocean";

	} else if (promptName === "Ancient Murrelet") {

		colorsToFeature = " have a compact body, short wings, and a distinctive black and white plumage, with a dark cap on its head. Its size is similar to a pigeon, but it should have a short, slim beak";
		locationToFeature += " , it should include coastal islands or open ocean waters";

	} else if (promptName === "Bananaquit") {

		colorsToFeature = " be a small, sparrow-sized bird with a slender body, yellow belly, and black-and-white head, often noted for its curved bill";
		locationToFeature += ", it should include tropical gardens, woodlands, or mangroves";

	} else if (promptName === "Barnacle Goose") {

		colorsToFeature = " have a striking black head and neck which contrasts with a creamy white face and white cheek patches. It should have a grayish white belly and a short stubby bill. It should have black legs";
		locationToFeature += ", it should include grassy areas near water";

	} else if (promptName === "Black-chinned Hummingbird") {

		colorsToFeature = " be a small hummingbird with iridescent green feathers, a distinctive black chin, and a white stripe behind the eye";
		locationToFeature += ", it should include arid and semi-arid habitats with flowering plants";

	} else if (promptName === "Bohemian Waxwing") {

		colorsToFeature = " have a soft brownish plumage, a black mask, and distinctive yellow tips on the wings and tail";
		locationToFeature += ", it should include forests and woodlands with abundant fruiting trees";

	} else if (promptName === "Bronze Mannikin") {

		colorsToFeature = " be a small, stout bird with a brownish-black body and glossy greenish-brown sheen";
		locationToFeature += ", it should include grasslands and savannas, often near water sources";

	} else if (promptName === "California Towhee") {

		colorsToFeature = " have a brownish body, orange underparts, and a long, rounded tail";
		locationToFeature += ", it should include scrubby areas, chaparral, and suburban gardens";

	} else if (promptName === "Canada Jay") {

		colorsToFeature = " be a grayish bird with a pale head, dark wings, and a long tail, known for its friendly behavior";
		locationToFeature += ", it should include boreal forests and mountainous regions";

	} else if (promptName === "Curve-billed Thrasher") {

		colorsToFeature = " have a long, curved bill, gray-brown plumage, and a distinctively long tail";
		locationToFeature += ", it should include desert scrub and open woodlands";

	} else if (promptName === "Elegant Trogon") {

		promptName = "Collared Trogon";
		colorsToFeature = " have vibrant plumage, including a metallic-green back, rose-red belly, yellow beak, as well as an unusual stout-bodied, square-tailed profile with an extremely long black-and-white patterned tail. There should be extra focus on the length of the tail";
		locationToFeature += ", it should be perched on a tropical tree and include flowers";

	} else if (promptName === "Greater Sage-Grouse") {

		colorsToFeature = " be a large ground-dwelling bird with a rounded body, long tail feathers, and distinctively feathered legs";
		locationToFeature += ", it should include sagebrush ecosystems in arid regions";

	} else if (promptName === "Great Gray Owl") {

		colorsToFeature = " have a distinctive round face, long gray feathers, and striking yellow eyes";
		locationToFeature += ", it should include dense coniferous forests and be either (1) flying through the air or (2) perched in a tree";

	} else if (promptName === "Hawaii Amakihi") {

		colorsToFeature = " be a small songbird with olive-green plumage and a slightly curved bill";
		locationToFeature += ", it should include Hawaiian forests with native flowers and vegetation";

	} else if (promptName === "Himalayan Snowcock") {

		colorsToFeature = " be a large, robust bird with a long neck, grayish-brown plumage, and a distinctive white facial patch";
		locationToFeature += ", it should include steep, rocky mountain slopes and alpine meadows";

	} else if (promptName === "Horned Puffin") {

		colorsToFeature = " have a colorful bill with a horn-like extension, black upperparts, and white underparts";
		locationToFeature += ", it should include coastal cliffs and cold ocean waters";

	} else if (promptName === "Iceland Gull") {

		colorsToFeature = " be a medium-sized gull with pale plumage, gray wings, and a slightly darker mantle";
		locationToFeature += ", it should include coastal areas and lakes";

	} else if (promptName === "Laysan Albatross") {

		colorsToFeature = " be a large seabird with a white body and dark gray wings, featuring a distinctive black 'M' pattern";
		locationToFeature += ", it should include open ocean and remote islands in the North Pacific";

	} else if (promptName === "McKay's Bunting") {

		colorsToFeature = " be a small, stocky bird with all-white plumage and black wings";
		locationToFeature += ", it should include tundra and coastal areas in the Arctic regions";

	} else if (promptName === "Mexican Jay") {

		colorsToFeature = " have a grayish-blue body, a black crown, and a white belly";
		locationToFeature += ", it should include Mexican oak woodlands and mountainous areas";

	} else if (promptName === "Mitred Parakeet") {

		colorsToFeature = " be a medium-sized parakeet with bright green plumage, a red forehead, and distinctive yellow underwing feathers";
		locationToFeature += ", it should include tropical trees and flowers";

	} else if (promptName === "Nanday Parakeet") {

		colorsToFeature = " be a small, striking parakeet with bright green body, black head, and red underparts";
		locationToFeature += ", it should include open woodland trees or grassy savanna plants";

	} else if (promptName === "Northern Beardless-Tyrannulet") {

		colorsToFeature = " be a small, grayish bird with a slight crest and no distinct markings";
		locationToFeature += ", it should include scrubby areas and open woodlands";

	} else if (promptName === "Northern Shrike") {

		colorsToFeature = " be a medium-sized bird with a gray body, black mask, and stout bill";
		locationToFeature += ", it should include open fields, shrubby areas, and woodlands";

	} else if (promptName === "Pacific Loon") {

		colorsToFeature = " be a large, slender bird with a sharp bill, dark head, and spotted back";
		locationToFeature += ", it should include large lakes and coastal waters";

	} else if (promptName === "Pine Grosbeak") {

		colorsToFeature = " be a large finch with bright yellow or red plumage in males and a large conical bill";
		locationToFeature += ", it should include coniferous forests, especially in northern regions";

	} else if (promptName === "Plain-capped Starthroat") {

		colorsToFeature = " be a medium-sized hummingbird with iridescent green and white plumage and a unique plain cap";
		locationToFeature += ", it should include arid and semi-arid regions with flowering plants";

	} else if (promptName === "Razorbill") {

		colorsToFeature = " be a seabird with a large black body, white underparts, and a distinctive blunt bill with a sharp ridge";
		locationToFeature += ", it should include rocky coastal areas";

	} else if (promptName === "Red Junglefowl") {

		colorsToFeature = " be a colorful bird with a red comb, bright plumage, and a long tail";
		locationToFeature += ", it should include tropical forests and scrubland plants";

	} else if (promptName === "Red-lored Parrot") {

		colorsToFeature = " be a medium-sized parrot with green plumage, red forehead, and yellow patches on the wings";
		locationToFeature += ", it should include tropical rainforest trees and flowers";

	} else if (promptName === "Red-masked Parakeet") {

		colorsToFeature = " be a bright green parakeet with a red mask and orange underwing feathers";
		locationToFeature += ", it should include subtropical forest trees";

	} else if (promptName === "Red-necked Grebe") {

		colorsToFeature = " be a medium-sized grebe with a distinctive red neck during breeding plumage and a slender body";
		locationToFeature += ", it should include freshwater lakes and wetlands";

	} else if (promptName === "Red-necked Phalarope") {

		colorsToFeature = " be a small, slender shorebird with a striking red neck in breeding plumage";
		locationToFeature += ", it should include coastal areas and wetlands";

	} else if (promptName === "Red-tailed Tropicbird") {

		colorsToFeature = " be a large, elegant seabird with a white body and long tail feathers";
		locationToFeature += ", it should include tropical islands and open ocean waters and should be flying";

	} else if (promptName === "Rock Ptarmigan") {

		colorsToFeature = " be a medium-sized bird with a stocky body and long tail feathers, turning white in winter and brown in summer";
		locationToFeature += ", it should include alpine tundra and rocky mountainous areas";

	} else if (promptName === "Ruddy Ground Dove") {

		colorsToFeature = " be a small, plump dove with a reddish-brown body and a slightly long tail";
		locationToFeature += ", it should include riparian forest, logged areas, cultivated fields, or garden plants"

	} else if (promptName === "Rufous-crowned Sparrow" ) {

		colorsToFeature += " have a distinctive rufous crown, a grayish-brown body, and streaked sides. The face is often marked with a darker mask";
		locationToFeature += ", it should include shrubby areas and grasslands, often with scattered bushes or trees"

	} else if (promptName === "Saffron Finch") {

		colorsToFeature = " be a small, bright yellow bird with a slightly curved bill and a cheerful demeanor";
		locationToFeature += ", it should include open fields, gardens, and shrubland plants";

	} else if (promptName === "Sagebrush Sparrow") {

		colorsToFeature = " be a small, sparrow-like bird with a streaked brown and gray body and a distinctive pale eye";
		locationToFeature += ", it should include arid, sagebrush-dominated habitats";

	} else if (promptName === "Scaly-breasted Munia") {

		colorsToFeature = " be a stocky bird with a unique scaly pattern on its chest and a brownish overall coloration";
		locationToFeature += ", it should include grasslands, rice fields, and areas with abundant seeds";

	} else if (promptName === "White-tailed Tropicbird") {

		colorsToFeature = " be a striking bird with a long, elegant tail, a white body, and black wing tips";
		locationToFeature += ", it should include tropical oceanic waters, it should either be (1) nesting on cliffs or islands or (2) in flight over the water";

	} else if (promptName === "Scripps's Murrelet") {

		colorsToFeature = " be a small seabird with dark gray upperparts and white underparts, along with a distinctive black crown and small, slim beak";
		locationToFeature += ", it should include coastal marine environments, nesting on rocky cliffs";

	} else if (promptName === "Smith's Longspur") {

		colorsToFeature = " be a small, sparrow-like bird with a stout body, featuring a brownish back and distinct black markings during breeding season";
		locationToFeature += ", it should include open grasslands and tundra regions, often in northern Canada and Alaska";

	} else if (promptName === "Snow Goose") {

		colorsToFeature = " be a large waterfowl, typically white with black wingtips and a distinctive pink bill";
		locationToFeature += ", it should include wetlands, marshes, and agricultural fields with some snow on the ground";

	} else if (promptName === "Snowy Plover") {

		colorsToFeature = " be a small, pale-colored shorebird with a short bill and compact body";
		locationToFeature += ", it should include sandy or pebbly beaches, often nesting in dune areas";

	} else if (promptName === "South Polar Skua") {

		colorsToFeature = " be a large, robust seabird with dark brown plumage and a stout bill";
		locationToFeature += ", it should include Antarctic waters and remote breeding islands";

	} else if (promptName === "White-tailed Ptarmigan") {

		colorsToFeature = " be a small, stocky bird with white plumage in winter and mottled brown in summer";
		locationToFeature += ", it should include alpine tundra and rocky mountainous regions";

	} else if (promptName === "Willow Ptarmigan") {

		colorsToFeature = " be a medium-sized bird with a plump body, brown plumage in summer, and white in winter";
		locationToFeature += ", it should include shrubby tundra and willow thickets in colder regions";

	} else if (promptName === "Crested Caracara") {

		colorsToFeature = " be standing tall on long yellow-orange legs with a sharp black cap set against a white neck and yellow-orange face";
		locationToFeature += ", it should be perched on a flowering cactus in the desert";

	// SKIP EVERYTHING ELSE FOR NOW
	} else {

		console.log('SKIPPED -> ', i, " -> ", promptName);

		return;

	}

	console.log(`---${finalIndex}---`);

	const prompt = `Create a vibrant, abstract illustration of a ${promptName} in a geometric style, influenced by Cubism and Piet Mondrian. It should${colorsToFeature}. The background should consist of ${locationToFeature}, integrating smoothly to produce a visually striking and harmonious scene.`;

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

};
