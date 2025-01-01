const fs = require("fs");
const OpenAI = require("openai");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "predator-and-prey-5";
const COLLECTION_START_INDEX = 5000;
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
    } else if (promptName === "Ashy Storm-Petrel") {
        colorsToFeature = "It should be a small seabird with dark gray plumage, a pale underbelly, long, slender wings, and a distinctive white rump, known for its erratic flight patterns.";
        locationToFeature = "The background should consist of rocky coastal cliffs with foggy, windswept skies and ocean views, where the Ashy Storm-Petrel is actively hunting a small fish just above the water’s surface.";
    } else if (promptName === "Audubon's Shearwater") {
        colorsToFeature = "It should have a medium size, with dark brown wings and back, contrasting white underparts, and a slightly forked tail, typically seen gliding over the ocean.";
        locationToFeature = "The background should consist of expansive, open ocean with deep blue water and isolated, rocky islands, where the Audubon's Shearwater is actively hunting a fish by diving into the sea to catch it.";
    } else if (promptName === "Chihuahuan Raven") {
        colorsToFeature = "It should be a large raven with glossy black feathers, a slightly wedge-shaped tail, and a thick, robust bill, often perched in desert or scrubland environments.";
        locationToFeature = "The background should consist of arid scrublands and desert environments, with scattered cactus and sparse vegetation, where the Chihuahuan Raven is eating a small insect on the ground.";
    } else if (promptName === "Common Black Hawk") {
        colorsToFeature = "It should be a medium to large raptor with dark brown to black plumage, a short tail, and broad wings, featuring a white patch on the shoulders and dark streaking.";
        locationToFeature = "The background should consist of rugged, forested canyons with a mix of grassland, where the Common Black Hawk is killing a small dead rabbit.";
    } else if (promptName === "Ferruginous Hawk") {
        colorsToFeature = "It should be a large, powerful raptor with a reddish-brown and white body, pale underparts, and long, broad wings with a distinctive rufous color on the back.";
        locationToFeature = "The background should consist of wide open plains and grasslands, with tall grasses and occasional shrubs, where the Ferruginous Hawk is killing a small brown rodent on the ground.";
    } else if (promptName === "Gray Hawk") {
        colorsToFeature = "It should be a medium-sized raptor with a light gray body, white underparts, and dark wings and tail with a slight blackish bar near the tail tip.";
        locationToFeature = "The background should consist of dry, rocky hills with sparse vegetation and scattered trees, where the Gray Hawk is chasing a small bird.";
    } else if (promptName === "Great Shearwater") {
        colorsToFeature = "It should be a medium-sized seabird with dark brown and black upperparts, white underparts, and long, narrow wings, typically seen flying over the open ocean.";
        locationToFeature = "The background should consist of open ocean waters, with distant rocky outcroppings and gentle waves, where the Great Shearwater is hunting a fish by diving into the water to catch it.";
    } else if (promptName === "Gyrfalcon") {
        colorsToFeature = "It should be a large falcon with a broad, powerful body, pale to dark gray plumage with variable markings, and long, pointed wings, known for its speed and strength.";
        locationToFeature = "The background should consist of icy tundra and high mountain cliffs with an open sky, where the Gyrfalcon is hunting a Ptarmigan by chasing it from above.";
    } else if (promptName === "Harris's Hawk") {
        promptName = "Dusky Hawk";
        colorsToFeature = "It should be a medium-sized raptor with a dark brown body, reddish-brown shoulders, a reddish-brown tail, and white markings on the legs, with broad wings and a tail that is slightly squared.";
        locationToFeature = "The background should consist of arid desert with scattered trees and shrubs, where the Dusky Hawk is eating a small dead rodent on the ground.";
    } else if (promptName === "Hawaiian Hawk") {
        colorsToFeature = "It should be a medium-sized raptor with dark brown feathers, a white belly, and distinctive dark markings on the face and wings, with a broad, slightly rounded tail.";
        locationToFeature = "The background should consist of tropical forests with dense canopy. The Hawaiian Hawk should be eating a small lizard.";
    } else if (promptName === "Merlin") {
        colorsToFeature = "It should be a small, compact falcon with slate-blue upperparts, streaked underparts, and a dark cap, with a sharp, pointed bill and long, pointed wings.";
        locationToFeature = "The background should consist of open fields and woodlands with scattered trees, where the Merlin is chasing a small bird in mid-air flight.";
    } else if (promptName === "Northern Goshawk") {
        colorsToFeature = "It should be a large, powerful hawk with slate-gray feathers on the back, pale underparts with horizontal streaks, and a distinctive white eyebrow marking.";
        locationToFeature = "The background should consist of dense, mixed forests with open patches of woodland, where the Northern Goshawk is chasing a small dead bird by diving from the canopy to capture it on the ground.";
    } else if (promptName === "Northern Saw-whet Owl") {
        colorsToFeature = "It should be a small, round owl with brown plumage, white streaks on the face and belly, and large yellow eyes, often perched in dense forests.";
        locationToFeature = "The background should consist of dense, dark forests with thick understory and occasional clearings, where the Northern Saw-whet Owl has its claws on top of a dead rodent. The dead rodent should be non descript.";
    } else if (promptName === "Pomarine Jaeger") {
        colorsToFeature = "It should be a large seabird with dark brown upperparts, pale underparts, and a long, pointed tail with distinctive feather extensions, known for chasing other birds.";
        locationToFeature = "The background should consist of coastal tundra or open ocean with strong winds and choppy seas, where the Pomarine Jaeger is eating a dead fish.";
    } else if (promptName === "Prairie Falcon") {
        colorsToFeature = "It should be a medium-sized falcon with light brown and cream-colored plumage, a bold dark mustache stripe, and a wingspan adapted for fast, agile flight.";
        locationToFeature = "The background should consist of open deserts and grasslands with occasional rocky outcrops, where the Prairie Falcon is chasing a small rodent by flying low to capture it on the ground.";
    } else if (promptName === "Rough-legged Hawk") {
        colorsToFeature = "It should be a medium-sized raptor with a pale, mottled body, dark markings on the wings, and long feathers on the legs, giving it a rough appearance.";
        locationToFeature = "The background should consist of vast, open fields and grasslands with occasional trees and cliffs, where the Rough-legged Hawk is eating a small dead rodent.";
    } else if (promptName === "Short-tailed Hawk") {
        colorsToFeature = "It should be a medium-sized hawk with a short, squared-off tail, dark brown upperparts, and pale underparts, often seen soaring in open landscapes.";
        locationToFeature = "The background should consist of tropical lowland forests with dense canopies and wetland areas, where the Short-tailed Hawk is eating a small dead bird.";
    } else if (promptName === "Snail Kite") {
        colorsToFeature = "It should be a medium-sized raptor with a distinctive curved beak, dark gray plumage on the back and wings, and white underparts, often found near wetlands.";
        locationToFeature = "The background should consist of freshwater marshes and wetlands with tall grasses and aquatic vegetation, where the Snail Kite is hunting snails by swooping low to pluck them from the water’s surface.";
    } else if (promptName === "Steller's Sea-Eagle") {
        colorsToFeature = "It should be a massive raptor with striking black wings and back, white shoulders, and a bright yellow, powerful bill, with a very broad wingspan. The emphasis should be on the yellow beak, large dark eye, and yellow feet.";
        locationToFeature = "The background should consist of expansive coastal cliffs and open seas, where the Steller's Sea-Eagle is hunting salmon by diving from great heights to capture them with its powerful talons.";
    } else if (promptName === "Stygian Owl") {
        colorsToFeature = "It should be a medium-sized, dark owl with a blackish-brown body, a pale face with dark concentric rings around the eyes, and large, expressive yellow eyes. The beady yellow eyes should be the focal point of the image.";
        locationToFeature = "The background should consist of dense, forested areas with large trees near water bodies, where the Stygian Owl is chasing a small bird with both in flight through the air.";
    } else if (promptName === "White-tailed Eagle") {
        colorsToFeature = "It should be a large raptor with dark brown plumage, a distinctive white tail, yellow beak, and broad wings, often soaring over coastal or freshwater habitats.";
        locationToFeature = "The background should consist of large, expansive wetlands and estuaries, where the White-tailed Eagle is hunting fish by diving from the sky to snatch them from the water’s surface.";
    } else if (promptName === "White-tailed Hawk") {
        colorsToFeature = "It should be a medium-sized raptor with a white tail, a dark brown back, and pale underparts, with a broad, rounded tail and wings for gliding.";
        locationToFeature = "The background should consist of open grasslands and woodlands, with clear skies and occasional shrubs, where the White-tailed Hawk is eating a dead rodent.";
    } else if (promptName === "White-tailed Kite") {
        colorsToFeature = "It should be a small to medium-sized kite with striking white plumage on the head, body, and tail, contrasting with dark wings and a black shoulder patch.";
        locationToFeature = "The background should consist of coastal plains and marshes, where the White-tailed Kite is eating a small dead bird.";
    } else if (promptName === "Zone-tailed Hawk") {
        colorsToFeature = "It should be a medium-sized hawk with dark, mostly black plumage on the back and wings, a pale underside, and a distinctive banded tail that gives it a zoned appearance.";
        locationToFeature = "The background should consist of rugged, rocky canyons with sparse vegetation and open skies, where the Zone-tailed Hawk is hunting a small bird by swooping down from a hidden perch to capture it.";
    } else if (promptName === "Alder Flycatcher") {
        colorsToFeature = "It should have a small, slim body with a long, narrow tail. Its upperparts are olive-brown, and its underparts are pale with a slight yellowish hue, with a distinctive dark line through the eye.";
        locationToFeature = "The background should consist of , moist woodlands with thick undergrowth and tall trees, often near water sources such as marshes or rivers. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Gambel's Quail") {
        colorsToFeature = "It should be a plump, volleyball-sized bird with a short neck, small bill, and square tail. It should have a comma-shaped topknot of feathers atop its small head. The crown of its head should be bright cinnamon in color. Its face should be black in color.";
        locationToFeature = "The background should consist of the Quail perched on cactus over the open, scrub-filled desert. The black silhouette of a Hawk hovering in the distance.";
    } else if (promptName === "Anianiau") {
        promptName = "Yellow Warbler";
        colorsToFeature = "It should have a small body with slightly upturned bill. Its plumage is bright yellow throughout its whole body.";
        locationToFeature = "The background should consist of tropical forests or shrublands, with dense vegetation and tree canopies providing plenty of shelter and food sources. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Bahama Swallow") {
        colorsToFeature = "It should have a medium-sized, sleek body with a forked tail. Its plumage is dark brown with a metallic sheen, and its throat and breast are pale, contrasting with its dark wings and tail.";
        locationToFeature = "The background should consist of open, coastal habitats, with rocky shorelines, marshes, and nearby beaches providing the bird ample space to forage and nest. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Black-tailed Gnatcatcher") {
        promptName = "Gnatcatcher Bird";
        colorsToFeature = "Its back should be grayish-blue, its chest is white, and it has a distinctive black tail which should be tilted up in the air. It should have a very thin beak and a black head.";
        locationToFeature = "The background should consist of arid desert, with shrubs and small rocks. There should be the black silhouette of a Hawk flying in the sky above.";
    } else if (promptName === "Blue-crowned Parakeet") {
        colorsToFeature = "It should have a medium-sized body with a long, curved tail. Its plumage is primarily green, with a bright blue crown, yellowish-green cheeks, and a red patch on its wings.";
        locationToFeature = "The background should consist of tropical forests or dense scrubland areas with lush, leafy trees and ample cover for foraging and nesting. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Blue-winged Warbler") {
        colorsToFeature = "It should have a small, compact body with a short tail. Its upperparts are olive-green, with a striking blue wing patch, while its underparts are pale yellow with a white throat.";
        locationToFeature = "The background should consist of forests or thickets, with an abundance of shrubbery and trees where the bird can nest and forage for food. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Cassin's Auklet") {
        colorsToFeature = "It should have a small, stocky body with a rounded head. Its plumage is dark gray to black, with a white patch behind the eye and a small, conical bill.";
        locationToFeature = "The background should consist of rocky coastal cliffs or coastal islands with cool ocean breezes, and sparse vegetation providing shelter and nesting sites. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Chestnut-bellied Sandgrouse") {
        colorsToFeature = "It should have a medium-sized, round body with a short neck and long, pointed wings. Its upperparts are brown and streaked, with a distinctive chestnut-colored belly and a white tail tip.";
        locationToFeature = "The background should consist of arid grasslands or rocky hillsides with scattered bushes and small trees providing occasional shade or cover. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Chestnut Munia") {
        colorsToFeature = "It should have an all brown body, which constrasts with its all black head and thick white bill.";
        locationToFeature = "The background should consist of grasslands or brushy fields with scattered trees or scrubby bushes where the bird can forage and nest. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Chestnut-sided Warbler") {
        colorsToFeature = "It should have a small, slender body with a slightly rounded tail. Its upperparts are olive-green, with bright chestnut streaks on its sides, and it has a pale yellow belly and white underparts.";
        locationToFeature = "The background should consist of temperate forests or woodlands with thick undergrowth and tall trees, creating a mix of open and dense spaces. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Gray Francolin") {
        colorsToFeature = "It should have a medium-sized, robust body with short legs. Its plumage is a mix of gray and brown with speckled patterns, and it has a distinctive white throat and a black crown.";
        locationToFeature = "The background should consist of coastal, marshy areas, or freshwater wetlands with plenty of mudflats and shallow pools for foraging. There should be the black silhouette of a Hawk perched on a distant post.";
    } else if (promptName === "Gray-headed Swamphen") {
        colorsToFeature = "It should have a medium-sized, stout body with a long, thick bill. Its plumage is mostly purple with greenish hues on the back, and its head and neck are gray with a red crown and facial shield.";
        locationToFeature = "The background should consist of grasslands or open brushy terrain, providing access to grasses and foraging grounds, with some nearby forest edges, and the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Gray Partridge") {
        colorsToFeature = "It should have a compact body with short legs and a rounded, slightly short tail. Its plumage is a mix of gray and brown, with intricate patterns of streaks and spots across its chest and flanks.";
        locationToFeature = "The background should consist of savannas or scrubby grasslands with scattered trees and small bushes, providing open foraging areas and shelter. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Green-breasted Mango") {
        promptName = "Green-breasted Mango Hummingbird";
        colorsToFeature = "It should have a medium-sized body with a slightly curved bill. Its plumage is bright green with an iridescent blue throat and a brilliant red belly, while its tail is long and forked.";
        locationToFeature = "The background should consist of open grasslands or coastal shores with sparse vegetation, providing space for ground foraging and nesting in coastal areas. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Harris's Sparrow") {
        promptName = "Fox Sparrow";
        colorsToFeature = "It should have a medium-sized body with a short, stout bill that is light pink. Its back is light brown, with a distinct black patch of color on its head and neck. It should have a white chesst a pale chestnut-colored patch on its back.";
        locationToFeature = "The background should consist of arid scrubland with occasional bushes or sparse trees. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Hawaii Akepa") {
        promptName = "Red Warbler"
        colorsToFeature = "It should have a small, round body with a very short bill. Its plumage is a brilliant orangish red body and head, with dark black wings.";
        locationToFeature = "The background should consist of dense tropical forests or dry woodlands, often near water sources, with foliage providing ample shelter and foraging space. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Hawaiian Duck") {
        promptName = "Female Mallard Duck";
        colorsToFeature = "It should have a medium-sized body with a slender neck and a wide, flat bill. Its plumage is mostly drab brown and gray, it has a pale, yellowish face with a dark eye.";
        locationToFeature = "The background should consist of rocky shorelines or sandy beaches, with some coastal grassland or mudflats ideal for nesting and foraging. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Kauai Elepaio") {
        promptName = "a small warbler,"
        colorsToFeature = "It should have a slender body with plumage that is dark brown and a white belly with distinctive white wing patches. It should have a brownish red head.";
        locationToFeature = "The background should consist of dense scrublands or tropical forests with plenty of low shrubs and trees. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Least Bittern") {
        colorsToFeature = "It should have a slender body with a long neck and a sharp, pointed bill. Its upperparts are brown and streaked, with a pale, creamy-colored underbelly, and it has long legs and a short tail.";
        locationToFeature = "The background should consist of scrubby, coastal or forested environments with a mixture of trees and bushes where the bird can forage and nest. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Least Sandpiper") {
        colorsToFeature = "It should have a small, compact body with long legs and a short, straight bill. Its plumage is a mix of brown and gray, with streaked upperparts and pale, white underparts.";
        locationToFeature = "The background should consist of wetlands or open marshlands with dense grasses or reeds, where the bird can nest and hunt for food in the shallow waters. There should be the black silhouette of a Hawk perched far away in the trees.";
    } else if (promptName === "Lucifer Hummingbird") {
        colorsToFeature = "It should have a small, slender body with a long, straight bill. Its upperparts are metallic green, with a vibrant iridescent purple throat patch.";
        locationToFeature = "The background should consist of open rocky coasts or beaches, with sparse vegetation, where the bird can forage along the shoreline or rest on exposed rocky surfaces. There should be the black silhouette of a Hawk flying high above the ocean.";
    } else if (promptName === "Violet-crowned Hummingbird") {
        colorsToFeature = "It should have a small, slender body with a long, straight bill. Its back and shoulders are greenish-brown and it should have a brilliant violet crown atop its head. Its chest and throat should be 100% white in color and its tail feathers should be brown. The purple violet crown atop its head should be the focal point of the image.";
        locationToFeature = "The background should consist of grassy areas, with a mixture of vegetation that provides good foraging space. The hummingbird should be fluttering mid air. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Wandering Tattler") {
        colorsToFeature = "It should have a medium-sized body with a long, thin bill. Its plumage is dark gray with a slightly speckled back and a pale underbelly, and it has long legs, well-suited for wading.";
        locationToFeature = "The background should consist of dry grasslands with scattered trees or shrubs. There should be the black silhouette of a Hawk in the sky above.";
    } else if (promptName === "Warbling White-eye") {
        colorsToFeature = "It should have a small, rounded body with a short, thin bill. Its plumage is olive-green on the back, with a white ring around its eyes and pale yellowish underparts.";
        locationToFeature = "The background should consist of coastal mudflats or sandy shores, providing ample areas for foraging and nesting in a shallow, open environment. There should be the black silhouette of a Hawk in the sky above.";

        // SKIP EVERYTHING ELSE FOR NOW
	} else {

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
