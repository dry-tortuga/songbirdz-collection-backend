const updateDailyStreak = async (client, address) => {

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

		// Query for a matching entry for the daily streak tracker
		const tracker = await trackers.findOne({ address });

		if (tracker) {

			// If one already exists, update the values as needed

			if (tracker.last_login === today) {

				return {
					...tracker,
					status: "no-change",
					change_in_points: 0,
					today: true,
				};

			}

			let newStatus, pointsEarned = 0;

			const updatedFields = {
				last_login: tracker.last_login,
				login_streak: tracker.login_streak,
				longest_login_streak: tracker.longest_login_streak,
				bonus_points_earned: tracker.bonus_points_earned,
			};

			if (updatedFields.last_login === yesterday) {

				newStatus = "updated";

				updatedFields.last_login = today;
				updatedFields.login_streak += 1;

				// Check if this current streak is a new max for the user

				updatedFields.longest_login_streak = Math.max(
					updatedFields.longest_login_streak,
					updatedFields.login_streak,
				);

				// Apply bonus points to earn based on the current streak hitting key milestones

				if (updatedFields.login_streak === 7) {

					pointsEarned = 50;
					updatedFields.bonus_points_earned += 50;

				} else if (updatedFields.login_streak === 14) {

					pointsEarned = 125;
					updatedFields.bonus_points_earned += 125;

				} else if (updatedFields.login_streak === 30) {

					pointsEarned = 300;
					updatedFields.bonus_points_earned += 300;

				}

			} else {

				newStatus = "created";

				updatedFields.last_login = today;
				updatedFields.login_streak = 1;

			}

			// Update the existing entry for the daily streak tracker for the user

			await trackers.updateOne({ address }, { $set: updatedFields });

			return {
				...tracker,
				...updatedFields,
				status: newStatus,
				change_in_points: pointsEarned,
				today: true,
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
				today: true,
			};

		}

	} catch (error) {
		console.error(error);
	}

};

module.exports = updateDailyStreak;
