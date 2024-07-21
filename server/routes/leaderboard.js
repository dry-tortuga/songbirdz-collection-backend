const DB = require("../db");

const LEADERBOARD_SIZE = 50;

// TODO: Cache results for a few minutes???

// Create a new connection to the database

const db = new DB();

const getLeaderboard = async (req, res, next) => {

	// const limit = parseInt(req.query.limit, 10);
	const limit = LEADERBOARD_SIZE;

	// Fetch the results for the leaderboard
	const results = await db.rankPointLogs(limit);

	res.send(results);

};

const getLifeList = async (req, res, next) => {

	const address = req.query.address;

	if (!address) {

		return next({
			status: 400,
			message: "The address is invalid",
		});

	}

	// Fetch the results for the life list for the user
	const results = await db.fetchPointLogs(address);

	res.send(results);

};

module.exports = {
	getLeaderboard,
	getLifeList,
};
