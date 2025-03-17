const DB = require("../db");

const VALID_MODES = ['easy', 'medium', 'hard'];
const VALID_SORTBY = ['total', 'today'];

// Create a new connection to the database

const db = new DB();

const createMemoryMatchLog = async (req, res, next) => {

	const address = req.body.address?.toLowerCase();

	if (!address) {
		return next({
			status: 400,
			message: "Missing value for \"address\" parameter.",
		});
	}

	if (!Number.isInteger(req.body.score) || req.body.score < 0 || req.body.score > 1000) {
		return next({
			status: 400,
			message: "Invalid value for \"score\" paramater.",
		});
	}

	if (!VALID_MODES.includes(req.body.mode)) {
		return next({
			status: 400,
			message: "Invalid value for \"mode\" parameter.",
		});
	}

	// TODO: Add obfuscated logic for verifying the game score on the backend...

	if (!req.body.duration || !req.body.moves) {

		return next({
			status: 400,
			message: "The game result is invalid",
		});

	}

	const logsToday = await db.getMemoryMatchGamesPlayed(address);

	if (logsToday >= 3) {
		return next({
			status: 400,
			message: "Exceeded maximum daily game attempts (3)",
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

const getMemoryMatchLeaderboard = async (req, res, next) => {

	const parsedMode = VALID_MODES.includes(req.query.mode) ? req.query.mode : 'easy';
	const parsedSortBy = VALID_SORTBY.includes(req.query.sort_by) ? req.query.sort_by : 'total';

	const leaderboard = await db.getMemoryMatchLeaderboard({
		address: req.query.address?.toLowerCase(),
		mode: parsedMode,
		size: 20,
		sort_by: parsedSortBy,
	});

	res.send(leaderboard);

};

const getMemoryMatchGamesPlayed = async (req, res, next) => {

	const address = req.query.address?.toLowerCase();

	if (!address) {
		return next({
			status: 400,
			message: "Missing value for \"address\" parameter.",
		});
	}

	const response = await db.getMemoryMatchGamesPlayed(address);

	res.send({ count: response });

};

module.exports = {
	createMemoryMatchLog,
	getMemoryMatchLeaderboard,
	getMemoryMatchGamesPlayed,
};
