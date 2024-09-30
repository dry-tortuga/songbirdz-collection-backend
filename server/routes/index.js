const express = require("express");

const {
	getBirdMetadata,
	getBirdProof,
	getBirdAlreadyIdentifiedList,
} = require("./birds");
const {
	getDailyStreaks,
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

// Get the leaderboard
router.get("/leaderboard", getLeaderboard);

// Get the life list for a specific user
router.get("/life-list", getLifeList);

// Get the daily streaks
router.get("/daily-streaks", getDailyStreaks);

// Update the daily streak for a specific user
router.post("/daily-streak", updateDailyStreak);

module.exports = router;
