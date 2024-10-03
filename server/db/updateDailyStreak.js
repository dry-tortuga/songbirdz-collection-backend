const updateDailyStreak = async (client, address) => {

	try {

		// Calculate the current day, in the Indian locale
		const today = (new Date()).toLocaleDateString('en-IN', { dateStyle: 'medium' });

		// calculate the previous day, in the Indian locale
		const yesterdayDate = new Date();

		yesterdayDate.setDate(yesterdayDate.getDate() - 1);

		const yesterday = yesterdayDate.toLocaleDateString('en-IN', { dateStyle: 'medium' });

		// Connect to the "songbirdz" database and access the collection

		const database = client.db("songbirdz");
		const trackers = database.collection("daily_streak_tracker");

		// Query for a matching entry for the daily streak tracker
		const tracker = await trackers.findOne({ address });

		if (tracker) {

			// If one already exists, update the values as needed

			if (tracker.last_login === today) {

				return {
					...tracker,
					status: "no-change",
					change_in_points: 0,
				};

			}

			let newStatus, pointsEarned = 0;

			if (tracker.last_login === yesterday) {

				newStatus = "updated";

				tracker.last_login = today;
				tracker.login_streak += 1;

				// Check if this current streak is a new max for the user

				tracker.longest_login_streak = Math.max(
					tracker.longest_login_streak,
					tracker.login_streak,
				);

				// Apply bonus points to earn based on the current streak hitting key milestones

				if (tracker.login_streak === 7) {

					pointsEarned = 50;
					tracker.bonus_points_earned += 50;

				} else if (tracker.login_streak === 14) {

					pointsEarned = 125;
					tracker.bonus_points_earned += 125;

				} else if (tracker.login_streak === 30) {

					pointsEarned = 300;
					tracker.bonus_points_earned += 300;

				}

			} else {

				newStatus = "created";

				tracker.last_login = today;
				tracker.login_streak = 1;

			}

			// Update the existing entry for the daily streak tracker for the user

			const updatedTracker = await trackers.updateOne({ address }, {
				last_login: tracker.last_login,
				login_streak: tracker.login_streak,
				longest_login_streak: tracker.longest_login_streak,
				bonus_points_earned: tracker.bonus_points_earned,
			});

			return {
				...updatedTracker,
				status: newStatus,
				change_in_points: pointsEarned,
			};

		} else {

			// Otherwise, create a new entry for the daily streak tracker for the user

			const result = await trackers.insertOne({
				address,
				last_login: today,
				login_streak: 1,
				longest_login_streak: 1,
				bonus_points_earned: 0,
			});

			// Print the ID of the inserted document
			console.log(`A document was inserted with the _id: ${result.insertedId}`);

			return {
				_id: result.insertedId,
				address,
				last_login: today,
				login_streak: 1,
				longest_login_streak: 1,
				bonus_points_earned: 0,
				status: "created",
				change_in_points: 0,
			};

		}

	} catch(error) {

		console.error(error);

	}

};

module.exports = updateDailyStreak;
