const fetchPointLogs = async (client, address) => {

	try {

		// Connect to the "songbirdz" database and access its "point_logs" collection

		const database = client.db("songbirdz");
		const pointLogs = database.collection("point_logs");

		// Query for all matching point logs
		const result = await pointLogs.find({ address });

		console.log(result);

		const finalData = await result.toArray();

		return finalData;

	} catch(error) {

		console.error(error);

	}

};

module.exports = fetchPointLogs;
