const express = require("express");

const {
	getBirdMetadata,
	getBirdProof,
	getBirdAlreadyIdentifiedList,
	getRandomUnidentifiedBird,
} = require("./birds");
const {
	getBirdOfTheWeek,
} = require("./birdOfTheWeek")
const {
	getDailyStreaks,
	getDailyStreak,
	updateDailyStreak,
} = require("./dailyStreak");
const {
	getPointsLeaderboard,
	getLifeListData,
	getLifeListLeaderboard,
} = require("./leaderboard");
const {
	createMemoryMatchLog,
	getMemoryMatchLeaderboard,
	getMemoryMatchGamesPlayed,
} = require('./memoryMatch');

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
router.get("/points/leaderboard", getPointsLeaderboard);

// Get the leaderboard for the life list (i.e. species counts)
router.get("/life-list/leaderboard", getLifeListLeaderboard);

// Get the life list (i.e. species data) for a specific user
router.get("/life-list/data", getLifeListData);

// Get the daily streaks
router.get("/daily-streaks/active", getDailyStreaks);

// Get the daily streak for a specific user
router.get("/daily-streak", getDailyStreak);

// Update the daily streak for a specific user
router.post("/daily-streak", updateDailyStreak);

// Store the result of a memory match game for a specific user
router.post("/memory-match/log", createMemoryMatchLog);

// Get the leaderboard for the memory match game
router.get("/memory-match/leaderboard", getMemoryMatchLeaderboard);

// Get the games played (today) for a specific user for the memory match game
router.get("/memory-match/games-played", getMemoryMatchGamesPlayed);

// Get the information about the bird of the week
router.get("/bird-of-the-week", getBirdOfTheWeek);

module.exports = router;
