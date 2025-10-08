const cron = require('node-cron');

const DB = require("../db");

// Run every Monday at 4:00 PM UTC
cron.schedule('0 16 * * 1', async () => {

	console.log("---------- Running scheduled task - Monday 4:00 PM UTC ----------");

	// Create a new connection to the database
	const db = new DB();

	try {

		// Connect to the "songbirdz" database and access the collection

		const database = db.client.db("songbirdz");
		const birds = database.collection("bird-of-the-week");

		// Query for the active bird for the previous week
		const previousBird = await birds.findOne({ active: true });

		if (previousBird) {

			// Update the previous week's bird to be inactive
			await birds.updateOne({ _id: previousBird._id }, { $set: { active: false } });

			// Fetch the current week's bird (previous bird idx + 1) and mark it as active
			const nextIdx = previousBird.idx + 1;
			await birds.updateOne({ idx: nextIdx }, { $set: { active: true } });

			console.log(`Updated bird with idx ${previousBird.idx} to inactive and bird with idx ${nextIdx} to active`);

			const currentBird = await birds.findOne({ active: true, idx: nextIdx });

			// Send out notifications to users who have subscribed
			const url = 'https://api.neynar.com/v2/farcaster/frame/notifications/';

			const body = {
				notification: {
					title: "New Bird of the Week!",
					body: `Learn about the ${currentBird.species} (${currentBird.family})`,
					target_url: "https://songbirdz.cc/bird-of-the-week",
					uuid: crypto.randomUUID()
				},
			};

			const options = {
				method: 'POST',
				headers: {
					'x-api-key': process.env.NEYNAR_PRIVATE_API_KEY,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			};

			try {

				const response = await fetch(url, options);
				const data = await response.json();
				console.log(data);

			} catch (error) {
				console.error(error);
			}

		}

	} catch (error) {

		console.error(error);

	}

	console.log("-----------------------------------------------------------------");

}, {
	scheduled: true,
	timezone: "UTC"
});
