const { DB_COLLECTION_IDS } = require('../constants');
const DB = require("../db");

const LEADERBOARD_SIZE = 52;

// Create a new connection to the database

const db = new DB();

const getLeaderboard = async (req, res, next) => {

	const address = req.query.address;
	const limit = LEADERBOARD_SIZE;

	let dbCollectionId = DB_COLLECTION_IDS[1];

	if (req.query.season === '1') {
		dbCollectionId = DB_COLLECTION_IDS[0];
	}

	// Fetch the results for the leaderboard
	const results = await db.rankPointLogs(dbCollectionId, address, limit);

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

	const resultsSeason1 = await db.fetchPointLogs(DB_COLLECTION_IDS[0], address);
	const resultsSeason2 = await db.fetchPointLogs(DB_COLLECTION_IDS[1], address);

	res.send({
		season_1: resultsSeason1,
		season_2: resultsSeason2,
	});

};

module.exports = {
	getLeaderboard,
	getLifeList,
};
