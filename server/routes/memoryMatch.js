const DB = require("../db");

// Create a new connection to the database

const db = new DB();

const createMemoryMatchLog = async (req, res, next) => {

	const address = req.body.address?.toLowerCase();

	if (!req.body.mode ||
	   !req.body.score ||
	   !req.body.duration ||
	   !req.body.moves) {

		return next({
			status: 400,
			message: "The game result is invalid",
		});

	}

    const data = {
        address,
        mode: req.body.mode,
        score: req.body.score,
        duration: req.body.duration,
        moves: req.body.moves,
    };

	await db.createMemoryMatchLog(data);

	res.send({ logged: true });

};

module.exports = { createMemoryMatchLog };
