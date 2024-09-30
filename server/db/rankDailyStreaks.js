const rankDailyStreaks = async (client, address, limit) => {

	try {

		// Connect to the "songbirdz" database and access the collection

		const database = client.db("songbirdz");
		const trackers = database.collection("daily_streak_tracker");

		// Sort/Query for the top 52 daily streaks

		const queryResults = await trackers.aggregate([{
			$sort: {
				login_streak: -1, // Sort in descending order
			}
		}, {
			$limit: limit, // Return top X results
		}]);

		const finalData = await queryResults.toArray();

		// Make sure to include the current user's address in the final results

		if (address &&
			finalData.findIndex((temp) => temp.address === address) === -1) {

			const resultCurrentUser = await trackers.findOne({ address });

			finalData.push(resultCurrentUser);

		}

		return finalData;

	} catch(error) {

		console.error(error);

	}

};

module.exports = rankDailyStreaks;
