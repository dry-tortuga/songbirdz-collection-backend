const fetchPointLog = async (client, collectionId, address, speciesID) => {

	try {

		// Connect to the "songbirdz" database and access the collection

		const database = client.db("songbirdz");
		const pointLogs = database.collection(collectionId);

		// Query for a matching point log
		const result = await pointLogs.findOne({
			address,
			species_id: speciesID,
		});

		return result;

	} catch (error) {

		console.error(error);

	}

};

module.exports = fetchPointLog;
