const createMemoryMatchLog = async (client, data) => {

	try {

		// Connect to the "songbirdz" database and access the collection

		const database = client.db("songbirdz");
		const memoryMatchLogs = database.collection("memory_match_logs");

		// Insert the defined document into the collection
		const result = await memoryMatchLogs.insertOne({
			address: data.address,
			mode: data.mode,
			score: data.score,
			duration: data.duration,
			moves: data.moves,
			timestamp: new Date(),
		});

		// Print the ID of the inserted document
		console.log(`A document was inserted with the _id: ${result.insertedId}`);

	} catch (error) {
		console.error(error);
	}

};

module.exports = createMemoryMatchLog;
