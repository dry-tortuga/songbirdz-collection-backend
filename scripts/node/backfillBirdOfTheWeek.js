const DB = require("../db");

const REQUIRED_FIELDS = ['species', 'family', 'flock', 'ids', 'facts', 'links'];

const newData = [{
	species: "Sedge Wren",
	family: "Wrens",
	flock: "Hatchlings",
	ids: [7132, 7178, 7940],
	facts: [
		'The Sedge Wren\'s tail is frequently cocked upward, a trait shared among other wrens, which definitely increases the cuteness factor of these birds. The plants in the images, which are often found near or in marshes where Sedge Wrens dwell, were a big clue in eliminating the Winter Wren as a choice from the OBT. And, despite its name, the Wrentit is in the "Parrotbills, Wrentit, & Allies" family, not the "Wren" family.',
		'There is a lot of lore and stories about the wren. In Celtic folklore, the wren was known as the "king of all birds" by besting an eagle by hiding on its back to fly higher. The victory, being considered deceitful, placed the wren under a geis, a mystical taboo that prevents it from flying higher than a bush.',
		'The story doesn\'t end there for the king of birds. A wren is also said to have betrayed Saint Stephen by revealing his hiding spot to his attackers. There is even a tradition that takes place in Ireland on St. Stephen\'s Day (a.k.a. Wren Day) which includes dressing up, traveling house to house with a fake wren on a pole and singing a song (The Wren Song) about the king of all birds.',
	],
	links: [
		'https://roisinmallonart.com/blog/irish-folklore-wren-became-king',
		'https://www.rte.ie/brainstorm/2024/1216/1185007-wren-st-stephens-day-ireland-folklore-traditions-bad-luck/',
		'https://www.allaboutbirds.org/guide/Sedge_Wren/overview',
	],
}, {
	species: "Common Black Hawk",
	family: "Vultures, Hawks, & Allies",
	flock: "Predator & Prey",
	ids: [5433, 5495, 5877],
	facts: [
		'The Common Black Hawk (A.K.A Mexican Black Hawk) hunts along bodies of water and can hybridize with other hawks. ',
		'The Common Black Hawk is a perch hunter, but will also wade into water to catch its prey.',
		'They are sexually dimorphic, meaning the females are larger than the males.',
	],
	links: [
		'https://www.audubon.org/field-guide/bird/common-black-hawk',
		'https://animaldiversity.org/accounts/Buteogallus_anthracinus/',
		'https://hawkwatch.org/raptor-id/raptor-id-fact-sheets/common-black-hawk/',
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

			console.log(`Successfully added bird entry with idx: ${newIdx}`);
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
