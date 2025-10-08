const DB = require("../../server/db");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const REQUIRED_FIELDS = ['species', 'family', 'flock', 'ids', 'facts', 'links'];

// Sedge Wren, Common Black Hawk

const newData = [{
	species: "Sedge Wren",
	family: "Wrens",
	flock: "Hatchlings",
	ids: [7132, 7178, 7940],
	facts: [
	],
	links: [
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
