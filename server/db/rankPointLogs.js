const rankPointLogs = async (client, collectionId, address, limit) => {

	const currentUserAddress = address ? address.toLowerCase() : null;

	try {

		// Connect to the "songbirdz" database and access the collection

		const database = client.db("songbirdz");
		const pointLogs = database.collection(collectionId);

		// Sort/Sum/Query for the top 52 point logs

		const pointLogQueryResults = await pointLogs.aggregate([{
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

		const finalData = await pointLogQueryResults.toArray();

		// Make sure to include the current user's address in the final results

		if (currentUserAddress &&
			finalData.findIndex((temp) => temp.address === currentUserAddress) === -1) {

			const resultCurrentUser = await pointLogs.find({ address });

			const pointLogsCurrentUser = await resultCurrentUser.toArray();

			let total = 0;

			pointLogsCurrentUser.forEach((log) => {
				total += log.amount;
			});

			finalData.push({
				total,
				address: currentUserAddress,
			});

		}

		return finalData;

	} catch (error) {

		console.error(error);

	}

};

module.exports = rankPointLogs;
