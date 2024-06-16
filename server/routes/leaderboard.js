const DB = require("../db");

const LEADERBOARD_SIZE = 50;

// TODO: Cache results for a few minutes???

// Create a new connection to the database

const db = new DB();

const getLeaderboard = async (req, res, next) => {

	// const limit = parseInt(req.params.limit, 10);
	const limit = LEADERBOARD_SIZE;

	// Fetch the results for the leaderboard
	const results = await db.rankPointLogs(limit);

	res.send(results);

};

module.exports = {
	getLeaderboard,
};
