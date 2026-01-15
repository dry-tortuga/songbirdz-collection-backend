const DB = require("../../server/db");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const REQUIRED_FIELDS = ['species', 'family', 'flock', 'ids', 'facts', 'links'];

// Sourced from bookmarked posts from April 1st 2025 onwards...

// 10/06/25: Sedge Wren
// 10/13/25: Common Black Hawk
// 10/20/25: White-crowned Pigeon
// 10/27/25: Red-shouldered Hawk
// 11/03/25: Northern Saw-whet Owl
// 11/10/25: Bachman's Sparrow
// 11/17/25: Roseate Spoonbill
// 11/24/25: Brandt's Cormorant
// 12/01/25: Vaux's Swift
// 12/08/25: Greater Yellowlegs
// 12/15/25: Steller's Jay
// 12/22/25: Mexican Whip-poor-will
// 12/29/25: Pacific Golden-Plover
// 01/05/25: White-faced Ibis
// 01/12/25: Snowy Egret
// 01/19/25: Inca Dove
// 01/26/25: Bay-breasted Warbler
// 02/02/25: Hawaiian Duck
// 02/09/25: Phainopepla
// 02/16/25: Curve-billed Thrasher
// 02/23/25: Blackpoll Warbler
// 03/02/25: White-faced Whistling-Duck


/*

{
	species: "",
	family: "",
	flock: "",
	ids: [],
	facts: [
		"",
	],
	links: [
		"",
		"",
		"",
	],
}

*/

const newData = [{
	species: "Inca Dove",
	family: "Pigeons & Doves",
	flock: "Final Migration",
	ids: [9765],
	facts: [
		"Inca Doves are named after the Inca Empire, but their range does not align. Aztec Dove would be more appropriate, given their range and habit of pyramid roosting.",
		"They are small, slender doves with scaly-looking feathers and a long tail edged in white.",
		"Inca Doves often huddle together in large groups to conserve heat during cold weather.",
		"Unlike many birds, they can produce a rattling call by vibrating their wing feathers during flight.",
	],
	links: [
		"https://www.nationalgeographic.com/animals/birds/facts/inca-dove",
		"https://www.allaboutbirds.org/guide/Inca_Dove",
		"https://www.youtube.com/watch?v=ttZS5L8JGzQ",
	],
}, {
	species: "Bay-breasted Warbler",
	family: "Wood-Warblers",
	flock: "Small & Mighty",
	ids: [2242,2649,2839],
	facts: [
		"Bay-breasted Warblers are named for the rich chestnut (bay) color on their throat and chest during breeding season.",
		"They breed in the boreal forests of Canada and migrate to Central and northern South America for the winter.",
		"Their population fluctuates with outbreaks of spruce budworms, a major food source during breeding season.",
		"Outside of breeding season, their plumage becomes much duller, making them harder to distinguish from similar warblers.",
	],
	links: [
		"https://www.etymonline.com/word/warbler",
		"https://www.allaboutbirds.org/guide/Bay-breasted_Warbler/overview",
		"https://kids.kiddle.co/Bay-breasted_warbler",
	],
}, {
	species: "Hawaiian Duck",
	family: "Waterfowl",
	flock: "Predator & Prey",
	ids: [5090, 5943],
	facts: [
		"The Hawaiian Duck, also known as the koloa maoli, is endemic to the Hawaiian Islands.",
		"It closely resembles the female Mallard and readily hybridizes with introduced Mallards.",
		"Hawaiian Ducks inhabit wetlands, streams, and taro fields rather than open lakes.",
		"It is considered an endangered species due to habitat loss, invasive predators, and hybridization.",
	],
	links: [
		"https://www.allaboutbirds.org/guide/Hawaiian_Duck/overview",
		"https://dlnr.hawaii.gov/wildlife/birds/koloa-maoli/",
		"https://www.fws.gov/species/hawaiian-duck-anas-wyvilliana",
	],
}, {
	species: "Phainopepla",
	family: "Silky-Flycatchers",
	flock: "Picasso Genesis",
	ids: [846],
	facts: [
		"The berry-loving Phainopepla (fay-no-pep-la) can down 1,000 mistletoe berries in a day, enough to keep the part-time desert inhabitant hydrated without drinking water.",
		"Their digestive system is specially suited for berry consumption, with the ability to remove the skin, pack it separately for more efficient digestion, and allow the seeds to pass through undigested.",
		"The Phainopepla's diet and digestive system play a crucial role in propagating mistletoe. Their seed-rich droppings fall onto the branches below, allowing the seeds to germinate there. The germinated seed's roots penetrate into the branches of the tree, tapping into its nutrients for growth. Who knew that mistletoe was a parasitic plant?",
	],
	links: [
		"https://www.allaboutbirds.org/guide/Phainopepla/overview",
		"https://rachelcarsoncouncil.salsalabs.org/phainopepla",
		"https://www.desertsun.com/story/life/home-garden/james-cornett/2014/12/06/mistletoe-depends-upon-bird/20039567/",
	],
}, {
	species: "Curve-billed Thrasher",
	family: "Catbirds, Mockingbirds, & Thrashers",
	flock: "Fire & Ice",
	ids: [4266, 4506, 4649],
	facts: [
		"Curve-billed Thrashers are named for their long, strongly curved bill, which they use to dig insects and small animals out of the ground.",
		"They are commonly found in desert, scrub, and urban areas of the southwestern United States and Mexico.",
		"Curve-billed Thrashers are known for their loud, varied songs, often delivered from exposed perches.",
		"They aggressively defend their nesting territories and may remain territorial year-round.",
	],
	links: [
		"https://www.allaboutbirds.org/guide/Curve-billed_Thrasher/overview",
		"https://tucsonbirds.org/bird_profile/curve-billed-thrasher/",
		"https://kids.kiddle.co/Curve-billed_thrasher",
	],
}, {
	species: "Blackpoll Warbler",
	family: "Wood-Warblers",
	flock: "Final Migration",
	ids: [9150, 9206],
	facts: [
		"Blackpoll Warblers are named for the black cap worn by males during the breeding season.",
		"They undertake one of the longest migrations of any North American warbler, including nonstop flights over the Atlantic Ocean.",
		"During fall migration, they can nearly double their body weight to fuel long-distance flights.",
		"They breed in northern boreal forests of Canada and Alaska and winter in northern South America.",
	],
	links: [
		"https://www.allaboutbirds.org/guide/Blackpoll_Warbler/overview",
		"https://datazone.birdlife.org/species/factsheet/blackpoll-warbler-setophaga-striata",
		"https://nhaudubon.org/bird-of-the-month-blackpoll-warbler/",
	],
}, {
	species: "White-faced Whistling-Duck",
	family: "Waterfowl",
	flock: "Final Migration",
	ids: [9080],
	facts: [
		"White-faced Whistling-Ducks are named for the bright white patch on their face and their distinctive whistling calls.",
		"They are primarily found in tropical and subtropical regions of Africa, Central America, South America, and the southern United States.",
		"Unlike many ducks, they often perch in trees and nest in tree cavities or dense vegetation.",
		"They are social birds, frequently seen in large flocks, especially outside the breeding season.",
	],
	links: [
		"https://lazoo.org/explore-your-zoo/our-animals/birds/white-faced-whistling-duck/",
		"https://www.saczoo.org/white-faced-whistling-duck",
	],
}];

(async () => {

	console.log("---------- Adding new bird of the week entries ----------");

	// Create a new connection to the database
	const db = new DB();

	try {

		// Connect to the "songbirdz" database and access the collection
		const database = db.client.db("songbirdz");
		const birds = database.collection("bird-of-the-week");

		// Find the entry with the maximum idx value
		let lastEntry = await birds.findOne({}, { sort: { idx: -1 } });

		let currentIdx = lastEntry ? lastEntry.idx + 1 : 1;

		for (let i = 0; i < newData.length; i++) {

			const birdData = newData[i];

			// Validate required fields
			for (const field of REQUIRED_FIELDS) {
				if (!birdData.hasOwnProperty(field)) {
					throw new Error(`Missing required field: ${field}`);
				}
			}

			// Create the new entry with the incremented idx
			const newBirdEntry = {
				...birdData,
				idx: currentIdx,
				active: false, // New entries are inactive by default
			};

			// Insert the new entry
			const result = await birds.insertOne(newBirdEntry);

			console.log(`Successfully added bird entry with idx: ${currentIdx}`);
			console.log(`Inserted document ID: ${result.insertedId}`);

			// Calculate the next idx
			currentIdx++;

		}

	} catch (error) {

		console.error("Error adding bird entry:", error);
		throw error;

	} finally {

		// Close the database connection
		await db.client.close();

	}

})();
