const fetchPointLogs = async (client, collectionId, address) => {

	try {

		// Connect to the "songbirdz" database and access the collection

		const database = client.db("songbirdz");
		const pointLogs = database.collection(collectionId);

		// Query for all matching point logs
		const result = await pointLogs.find({ address });

		const finalData = await result.toArray();

		return finalData;

	} catch(error) {

		console.error(error);

	}

};

module.exports = fetchPointLogs;
