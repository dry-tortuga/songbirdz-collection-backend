const DB = require("../db");

// Create a new connection to the database
const db = new DB();

const getBirdOfTheWeek = async (req, res, next) => {

	const results = await db.fetchBirdOfTheWeek();

	res.send(results);

};

module.exports = {
	getBirdOfTheWeek,
};
