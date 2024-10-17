const DB = require("../db");

const RESULTS_SIZE = 52;

// Create a new connection to the database

const db = new DB();

const getDailyStreaks = async (req, res, next) => {

	const address = req.query.address;
	const limit = RESULTS_SIZE;

	const parsedAddress = address?.toLowerCase();

	// Fetch the results for the leaderboard
	const results = await db.rankDailyStreaks(parsedAddress, limit);

	res.send(results);

};

getDailyStreak = async (req, res, next) => {

	const address = req.query.address;

	if (!address) {

		return next({
			status: 400,
			message: "The address is invalid",
		});

	}

	const parsedAddress = address.toLowerCase();

	// Fetch the daily streak tracker for the user

	const tracker = await db.getDailyStreak(parsedAddress);

	res.send(tracker);

};

const updateDailyStreak = async (req, res, next) => {

	const address = req.body.address;

	if (!address) {

		return next({
			status: 400,
			message: "The address is invalid",
		});

	}

	const parsedAddress = address.toLowerCase();

	// Update the daily streak tracker for the user

	const tracker = await db.updateDailyStreak(parsedAddress);

	res.send(tracker);

};

module.exports = {
	getDailyStreaks,
	getDailyStreak,
	updateDailyStreak,
};
