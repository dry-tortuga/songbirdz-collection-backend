const fetchPointLog = async (client, address, speciesID) => {

	try {

		// Connect to the "songbirdz" database and access its "point_logs" collection

		const database = client.db("songbirdz");
		const pointLogs = database.collection("point_logs");

		// Query for a matching point log
		const result = await pointLogs.findOne({
			address,
			species_id: speciesID,
		});

		console.log(result);

		return result;

	} catch(error) {

		console.error(error);

	}

};

module.exports = fetchPointLog;
