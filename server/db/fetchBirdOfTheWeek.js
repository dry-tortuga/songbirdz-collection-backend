const fetchBirdOfTheWeek = async (client) => {

	try {

		// Connect to the "songbirdz" database and access the collection

		const database = client.db("songbirdz");
		const birds = database.collection("bird-of-the-week");

		// Query for the active bird for the current week
		const result = await birds.findOne({ active: true });

		return result;

	} catch (error) {

		console.error(error);

	}

};

module.exports = fetchBirdOfTheWeek;
