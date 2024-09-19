const createOrUpdatePointLog = async (client, collectionId, data) => {

	try {

		// Connect to the "songbirdz" database and access the collection

		const database = client.db("songbirdz");
		const pointLogs = database.collection(collectionId);

		// Insert the defined document into the collection
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
