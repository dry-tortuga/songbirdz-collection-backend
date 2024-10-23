const fetchDailyStreak = async (client, address) => {

	try {

		// Connect to the "songbirdz" database and access the collection

		const database = client.db("songbirdz");
		const trackers = database.collection("daily_streak_tracker");

		// Query for a matching tracker
		const tracker = await trackers.findOne({ address });

		// Calculate the current day, in the Indian locale
		const today = (new Date()).toLocaleDateString('en-IN', { dateStyle: 'medium' });

		if (tracker?.last_login === today) {
			tracker.today = true;
		}

		return tracker;

	} catch (error) {

		console.error(error);

	}

};

module.exports = fetchDailyStreak;
