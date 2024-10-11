const rankDailyStreaks = async (client, address, limit) => {

	try {

		// Calculate the current day, in the Indian locale
		const today = (new Date()).toLocaleDateString('en-IN', { dateStyle: 'medium' });

		// Calculate the previous day, in the Indian locale
		const yesterdayDate = new Date();

		yesterdayDate.setDate(yesterdayDate.getDate() - 1);

		const yesterday = yesterdayDate.toLocaleDateString('en-IN', { dateStyle: 'medium' });

		// Connect to the "songbirdz" database and access the collection

		const database = client.db("songbirdz");
		const trackers = database.collection("daily_streak_tracker");

		// Sort/Query for the top 52 daily streaks

		const queryResults = await trackers.aggregate([{
			$match: {
				last_login: {
					$in: [yesterday, today] // Limit results to last active yesterday and/or today
				}
			}
		}, {
			$sort: {
				login_streak: -1, // Sort in descending order
			}
		}, {
			$limit: limit, // Return top X results
		}]);

		const finalData = await queryResults.toArray();

		// Make sure to include the current user in the final results

		if (address &&
			finalData.findIndex((temp) => temp.address === address) === -1) {

			const resultCurrentUser = await trackers.findOne({ address });

			if (resultCurrentUser) {

				finalData.push(resultCurrentUser);

			} else {

				finalData.push({
					_id: null,
					address,
					last_login: null,
					login_streak: 0,
					longest_login_streak: 0,
					bonus_points_earned: 0,
					status: "missing",
					change_in_points: 0,
				});

			}

		}

		return finalData;

	} catch(error) {

		console.error(error);

	}

};

module.exports = rankDailyStreaks;
