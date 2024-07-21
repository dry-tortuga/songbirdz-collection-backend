const createOrUpdatePointLog = async (client, data) => {

	try {

		// Connect to the "songbirdz" database and access its "point_logs" collection

		const database = client.db("songbirdz");
		const pointLogs = database.collection("point_logs");

		// Insert the defined document into the "point_logs" collection
		const result = await pointLogs.insertOne({
			address: data.address,
			species_id: data.species_id,
			bird_id: data.bird_id,
			amount: data.amount,
			timestamp: data.timestamp,
		});

		// Print the ID of the inserted document
		console.log(`A document was inserted with the _id: ${result.insertedId}`);

	} catch(error) {

		console.error(error);

	}

};

module.exports = createOrUpdatePointLog;
