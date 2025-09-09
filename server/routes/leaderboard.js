const { DB_COLLECTION_CURRENT_POINTS_SEASON, DB_COLLECTION_IDS } = require("../constants");
const DB = require("../db");

const LEADERBOARD_SIZE = 55;

// Create a new connection to the database

const db = new DB();

const getPointsLeaderboard = async (req, res, next) => {

	const address = req.query.address;
	const limit = LEADERBOARD_SIZE;

	let dbCollectionId = DB_COLLECTION_CURRENT_POINTS_SEASON;

	if (req.query.season === "1") {
		dbCollectionId = DB_COLLECTION_IDS[0];
	} else if (req.query.season === "2") {
		dbCollectionId = DB_COLLECTION_IDS[1];
	} else if (req.query.season === "3") {
		dbCollectionId = DB_COLLECTION_IDS[2];
	} else if (req.query.season === "4") {
		dbCollectionId = DB_COLLECTION_IDS[3];
	} else if (req.query.season === "5") {
		dbCollectionId = DB_COLLECTION_IDS[4];
	}

	// Fetch the results for the leaderboard
	const results = await db.rankPointLogs(dbCollectionId, address, limit);

	res.send(results);

};

const getLifeListData = async (req, res, next) => {

	const address = req.query.address;

	if (!address) {
		return next({
			status: 400,
			message: "The address is invalid",
		});
	}

	// Fetch the results for the life list for the user across all seasons
	const results = {};

	for (let i = 0; i < DB_COLLECTION_IDS.length; i++) {

		const seasonNumber = i + 1;

		results[`season_${seasonNumber}`] = await db.fetchPointLogs(DB_COLLECTION_IDS[i], address);

	}

    res.send(results);

};

const getLifeListLeaderboard = async (req, res, next) => {

	const address = req.query.address;

	const limit = LEADERBOARD_SIZE;

	// Fetch the results for the life list leaderboard
	const results = await db.rankSpeciesCounts(address, limit);

	res.send(results);

};

module.exports = {
	getPointsLeaderboard,
	getLifeListData,
	getLifeListLeaderboard,
};
