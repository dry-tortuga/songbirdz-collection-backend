const rankPointLogs = async (client, limit) => {

	try {

		// Connect to the "songbirdz" database and access its "point_logs" collection

		const database = client.db("songbirdz");
		const pointLogs = database.collection("point_logs");

		// Sort/Sum/Query for the top point logs

		const result = await pointLogs.aggregate([{
			$group: {
				_id: "$address", // Calculate the total points for each address
				total: {
					$sum: "$amount",
				},
			},
		}, {
			$sort: {
				total: -1, // Sort in descending order
			}
		}, {
			$limit: limit, // Return top X results
		}, {
			$set: {
				address: "$_id",
			},
		}, {
			$unset: ["_id"],
		}]);

		const finalData = await result.toArray();

		return finalData;

	} catch(error) {

		console.error(error);

	}

};

module.exports = rankPointLogs;
