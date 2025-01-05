const createMemoryMatchLog = async (client, data) => {

	try {

		// Connect to the "songbirdz" database and access the collection

		const database = client.db("songbirdz");
		const memoryMatchLogs = database.collection("memory_match_logs");

        let mode = -1;

        if (data.mode === "easy") {
            mode = 0;
        } else if (data.mode === "medium") {
            mode = 1;
        } else if (data.mode === "hard") {
            mode = 2;
        }

		// Insert the defined document into the collection
		const result = await memoryMatchLogs.insertOne({
			address: data.address,
			mode,
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
