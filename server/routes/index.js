const express = require("express");

const {
	getBirdMetadata,
	getBirdProof,
	getBirdAlreadyIdentifiedList,
	getRandomUnidentifiedBird,
} = require("./birds");
const {
	getDailyStreaks,
	getDailyStreak,
	updateDailyStreak,
} = require("./dailyStreak");
const {
	getLeaderboard,
	getLifeList,
} = require("./leaderboard");

const router = express.Router();

// Get the metadata for a specific bird
router.get("/metadata/:id", getBirdMetadata);

// Get the merkle tree proof of the species guess for a specific bird
router.get("/merkle-proof/:id", getBirdProof);

// Get the list of already identified birds
router.get("/already-identified-list", getBirdAlreadyIdentifiedList);

// Get a random unidentified bird
router.get("/random-bird", getRandomUnidentifiedBird);

// Get the leaderboard
router.get("/leaderboard", getLeaderboard);

// Get the life list for a specific user
router.get("/life-list", getLifeList);

// Get the daily streaks
router.get("/daily-streaks/active", getDailyStreaks);

// Get the daily streak for a specific user
router.get("/daily-streak", getDailyStreak);

// Update the daily streak for a specific user
router.post("/daily-streak", updateDailyStreak);

module.exports = router;
