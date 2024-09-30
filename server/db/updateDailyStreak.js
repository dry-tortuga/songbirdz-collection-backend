const updateDailyStreak = async (client, address) => {

	try {

		// Calculate the current day, in the Indian locale
		const today = (new Date()).toLocaleDateString('en-IN', { dateStyle: 'medium' });

		// calculate the previous day, in the Indian locale
		const yesterdayDate = new Date();

		yestardayDate.setDate(yesterdayDate.getDate() - 1);

		const yesterday = yesterdayDate.toLocaleDateString('en-IN', { dateStyle: 'medium' });

		// Connect to the "songbirdz" database and access the collection

		const database = client.db("songbirdz");
		const trackers = database.collection("daily_streak_tracker");

		// Query for a matching entry for the daily streak tracker
		const tracker = await trackers.findOne({ address });

		if (tracker) {

			// If one already exists, update the values as needed

			if (tracker.last_login === today) {

				// do nothing

			} else if (tracker.last_login == yesterday) {

				tracker.login_streak += 1;

			} else {

				tracker.login_streak = 1;

			}

			tracker.longest_login_streak = Math.max(
				tracker.longest_login_streak,
				tracker.login_streak,
			);

			await tracker.save();

			return tracker;

		} else {

			// Otherwise, create a new entry for the daily streak tracker for the user

			const result = await trackers.insertOne({
				address,
				last_login: today,
				login_streak: 1,
				longest_login_streak: 1,
			});

			// Print the ID of the inserted document
			console.log(`A document was inserted with the _id: ${result.insertedId}`);

			return result;

		}

	} catch(error) {

		console.error(error);

	}

};

module.exports = updateDailyStreak;
