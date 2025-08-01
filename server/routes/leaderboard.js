const { DB_COLLECTION_IDS } = require("../constants");
const DB = require("../db");

const LEADERBOARD_SIZE = 54;

// Create a new connection to the database

const db = new DB();

const getPointsLeaderboard = async (req, res, next) => {

    const address = req.query.address;
    const limit = LEADERBOARD_SIZE;

    let dbCollectionId = DB_COLLECTION_IDS[4];

    if (req.query.season === "1") {
        dbCollectionId = DB_COLLECTION_IDS[0];
    } else if (req.query.season === "2") {
        dbCollectionId = DB_COLLECTION_IDS[1];
    } else if (req.query.season === "3") {
        dbCollectionId = DB_COLLECTION_IDS[2];
    } else if (req.query.season === "4") {
        dbCollectionId = DB_COLLECTION_IDS[3];
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

    // Fetch the results for the life list for the user

    const resultsSeason1 = await db.fetchPointLogs(DB_COLLECTION_IDS[0], address);
    const resultsSeason2 = await db.fetchPointLogs(DB_COLLECTION_IDS[1], address);
    const resultsSeason3 = await db.fetchPointLogs(DB_COLLECTION_IDS[2], address);
    const resultsSeason4 = await db.fetchPointLogs(DB_COLLECTION_IDS[3], address);
    const resultsSeason5 = await db.fetchPointLogs(DB_COLLECTION_IDS[4], address);

    res.send({
        season_1: resultsSeason1,
        season_2: resultsSeason2,
        season_3: resultsSeason3,
        season_4: resultsSeason4,
        season_5: resultsSeason5,
    });

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
