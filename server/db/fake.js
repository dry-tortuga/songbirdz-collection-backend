const crypto = require("crypto");

const { DB_COLLECTION_IDS, SPECIES_SUPPLY } = require("../constants");

// ---------------------------------------------------------------------------
// Fake data to seed the in-memory "database" with
// ---------------------------------------------------------------------------

const FAKE_ADDRESSES = [
	"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
	"0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
	"0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
	"0x90f79bf6eb2c4f870365e785982341dfd82539c2",
	"0x15d34aaf54267db7d7c367839aa71f515b02b66d",
	"0x9965507d1a55bcc2695e58e16ca81280a96ff68a",
	"0x976ea74026e726554db657fa54763abd0c3a0aa9",
	"0x14dc79964da2c08b23698b3d3cc7ca32193d9955",
];

const FAKE_BIRDS_OF_THE_WEEK = [
	{
		idx: 1,
		active: true,
		family: "Waterfowl",
		species: "American Black Duck",
		species_id: 4,
		audio_url: "https://xicnet.com/uploads/songbirdz/audio/4.mp3",
		image_url: "https://xicnet.com/uploads/songbirdz/images/4.jpg",
	},
];

// ---------------------------------------------------------------------------
// Helpers to generate the fake point log entries
// ---------------------------------------------------------------------------

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomHex = (length) => crypto.randomBytes(length).toString("hex");

// The user's rarest bird is a bird for the rarest species (i.e. the species
// with the smallest total supply of birds) that the user has recorded
const getRarestBird = (speciesDocs) => {

	let rarest = null;

	speciesDocs.forEach((doc) => {

		const supply = SPECIES_SUPPLY[doc.species_id];

		if (supply === undefined) {
			return;
		}

		if (!rarest || supply < rarest.supply) {
			rarest = {
				supply,
				species_id: doc.species_id,
				bird_id: doc.bird_id ?? null,
			};
		}

	});

	return {
		rarest_species_id: rarest ? rarest.species_id : null,
		rarest_bird_id: rarest ? rarest.bird_id : null,
	};

};

const seededPointLogsFor = (collectionId) => {

	const logs = [];

	FAKE_ADDRESSES.forEach((address, addressIdx) => {

		// Generate a random number of identifications for each fake user
		const numEntries = randomInt(3, 12);

		for (let i = 0; i < numEntries; i++) {

			const speciesID = randomInt(1, 623);

			// Check whether an entry already exists for this user & species
			const existing = logs.find((log) =>
				log.address === address &&
				log.species_id === speciesID);

			if (existing) {
				continue;
			}

			logs.push({
				_id: randomHex(12),
				address,
				species_id: speciesID,
				bird_id: speciesID,
				amount: randomInt(20, 150),
				timestamp: new Date(Date.now() - randomInt(0, 30 * 24 * 60 * 60 * 1000)),
			});

		}

	});

	console.log(`[fake-db] Seeded ${logs.length} point logs for collection "${collectionId}"`);

	return logs;

};

// ---------------------------------------------------------------------------
// In-memory "database" state
// ---------------------------------------------------------------------------

const memory = {

	pointLogs: {

		[DB_COLLECTION_IDS[0]]: seededPointLogsFor(DB_COLLECTION_IDS[0]),
		[DB_COLLECTION_IDS[1]]: seededPointLogsFor(DB_COLLECTION_IDS[1]),
		[DB_COLLECTION_IDS[2]]: seededPointLogsFor(DB_COLLECTION_IDS[2]),
		[DB_COLLECTION_IDS[3]]: seededPointLogsFor(DB_COLLECTION_IDS[3]),
		[DB_COLLECTION_IDS[4]]: seededPointLogsFor(DB_COLLECTION_IDS[4]),
		[DB_COLLECTION_IDS[5]]: seededPointLogsFor(DB_COLLECTION_IDS[5]),

	},

	memoryMatchLogs: FAKE_ADDRESSES.slice(0, 5).map((address, idx) => ({
		_id: randomHex(12),
		address,
		mode: idx % 3,
		score: randomInt(50, 450),
		duration: randomInt(30, 240),
		moves: randomInt(20, 80),
		timestamp: new Date(),
	})),

	dailyStreaks: FAKE_ADDRESSES.slice(0, 5).map((address, idx) => ({

		_id: randomHex(12),
		address,
		last_login: idx === 4 ? null : new Date().toLocaleDateString("en-IN", { dateStyle: "medium" }),
		login_streak: randomInt(1, 30),
		longest_login_streak: randomInt(1, 45),
		bonus_points_earned: randomInt(0, 475),

	})),

	birdsOfTheWeek: FAKE_BIRDS_OF_THE_WEEK,

};

// ---------------------------------------------------------------------------
// FakeDB class - drop-in replacement for the real DB in development mode
// ---------------------------------------------------------------------------

class FakeDB {

	// -------------------------------------------------------------- point logs

	async fetchPointLog(collectionId, address, speciesID) {

		return memory.pointLogs[collectionId]?.find((log) =>
			log.address === address &&
			log.species_id === speciesID) ?? null;

	}

	async createPointLog(collectionId, data) {

		memory.pointLogs[collectionId]?.push({
			_id: randomHex(12),
			address: data.address,
			species_id: data.species_id,
			bird_id: data.bird_id,
			amount: data.amount,
			timestamp: data.timestamp,
		});

		return { acknowledged: true, insertedId: randomHex(12) };

	}

	async updatePointLog(collectionId, data) {

		const log = memory.pointLogs[collectionId]?.find((temp) =>
			temp.address === data.address &&
			temp.species_id === data.species_id);

		if (!log) {
			return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
		}

		log.bird_id = data.bird_id;
		log.amount = data.amount;
		log.timestamp = data.timestamp;

		return { acknowledged: true, matchedCount: 1, modifiedCount: 1 };

	}

	async fetchPointLogs(collectionId, address) {

		return memory.pointLogs[collectionId]?.filter((log) =>
			log.address === address) ?? [];

	}

	async rankPointLogs(collectionId, address, limit = 50) {

		const currentUserAddress = address ? address.toLowerCase() : null;

		const totals = {};

		memory.pointLogs[collectionId]?.forEach((log) => {
			totals[log.address] = (totals[log.address] ?? 0) + log.amount;
		});

		const finalData = Object.entries(totals)
			.map(([logAddress, total]) => ({ address: logAddress, total }))
			.sort((a, b) => b.total - a.total)
			.slice(0, limit);

		if (currentUserAddress &&
			finalData.findIndex((temp) => temp.address === currentUserAddress) === -1) {

			finalData.push({
				address: currentUserAddress,
				total: totals[currentUserAddress] ?? 0,
			});

		}

		return finalData;

	}

	// ------------------------------------------------------ memory match logs

	async createMemoryMatchLog(data) {

		let mode = -1;

		if (data.mode === "easy") {
			mode = 0;
		} else if (data.mode === "medium") {
			mode = 1;
		} else if (data.mode === "hard") {
			mode = 2;
		}

		memory.memoryMatchLogs.push({
			_id: randomHex(12),
			address: data.address,
			mode,
			score: data.score,
			duration: data.duration,
			moves: data.moves,
			timestamp: new Date(),
		});

	}

	async getMemoryMatchLeaderboard(data) {

		let mode = -1;
		if (data.mode === "easy") mode = 0;
		else if (data.mode === "medium") mode = 1;
		else if (data.mode === "hard") mode = 2;

		const sortBy = data.sort_by || "total";
		const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
		const today = (new Date()).toLocaleDateString("en-IN", { dateStyle: "medium" });

		const totals = {};

		memory.memoryMatchLogs
			.filter((log) => log.mode === mode)
			.forEach((log) => {

				if (!totals[log.address]) {
					totals[log.address] = { address: log.address, total: 0, today: 0 };
				}

				totals[log.address].total += log.score;

				const logDate = log.timestamp?.toLocaleDateString("en-IN", { dateStyle: "medium" });

				if (log.timestamp >= startOfDay || logDate === today) {
					totals[log.address].today += log.score;
				}

			});

		const sorted = Object.values(totals)
			.sort((a, b) => b[sortBy] - a[sortBy]);

		sorted.forEach((entry, idx) => {
			entry.rank = idx + 1;
		});

		const leaderboard = sorted.slice(0, data.size);

		if (data.address) {

			const userStats = sorted.find((entry) => entry.address === data.address);

			if (userStats &&
				!leaderboard.some((entry) => entry.address === data.address)) {
				leaderboard.push(userStats);
			}

		}

		return leaderboard;

	}

	async getMemoryMatchGamesPlayed(address) {

		const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));

		return memory.memoryMatchLogs.filter((log) =>
			log.address === address &&
			log.timestamp >= startOfDay).length;

	}

	// ------------------------------------------------------------ daily streaks

	async fetchDailyStreak(address) {

		const tracker = memory.dailyStreaks.find((temp) =>
			temp.address === address);

		if (!tracker) {
			return null;
		}

		const today = (new Date()).toLocaleDateString("en-IN", { dateStyle: "medium" });

		if (tracker.last_login === today) {
			tracker.today = true;
		}

		return tracker;

	}

	async updateDailyStreak(address) {

		const today = (new Date()).toLocaleDateString("en-IN", { dateStyle: "medium" });

		const yesterdayDate = new Date();
		yesterdayDate.setDate(yesterdayDate.getDate() - 1);

		const yesterday = yesterdayDate.toLocaleDateString("en-IN", { dateStyle: "medium" });

		let tracker = memory.dailyStreaks.find((temp) =>
			temp.address === address);

		if (tracker) {

			if (tracker.last_login === today) {
				return {
					...tracker,
					status: "no-change",
					change_in_points: 0,
					today: true,
				};
			}

			let newStatus;
			let pointsEarned = 0;

			if (tracker.last_login === yesterday) {

				newStatus = "updated";

				tracker.last_login = today;
				tracker.login_streak += 1;
				tracker.longest_login_streak = Math.max(
					tracker.longest_login_streak,
					tracker.login_streak,
				);

				if (tracker.login_streak === 7) {
					pointsEarned = 50;
					tracker.bonus_points_earned += 50;
				} else if (tracker.login_streak === 14) {
					pointsEarned = 125;
					tracker.bonus_points_earned += 125;
				} else if (tracker.login_streak === 30) {
					pointsEarned = 300;
					tracker.bonus_points_earned += 300;
				}

			} else {

				newStatus = "created";

				tracker.last_login = today;
				tracker.login_streak = 1;

			}

			return {
				...tracker,
				status: newStatus,
				change_in_points: pointsEarned,
				today: true,
			};

		} else {

			tracker = {
				_id: randomHex(12),
				address,
				last_login: today,
				login_streak: 1,
				longest_login_streak: 1,
				bonus_points_earned: 0,
			};

			memory.dailyStreaks.push(tracker);

			return {
				...tracker,
				status: "created",
				change_in_points: 0,
				today: true,
			};

		}

	}

	async rankDailyStreaks(address, limit = 50) {

		const today = (new Date()).toLocaleDateString("en-IN", { dateStyle: "medium" });

		const yesterdayDate = new Date();
		yesterdayDate.setDate(yesterdayDate.getDate() - 1);

		const yesterday = yesterdayDate.toLocaleDateString("en-IN", { dateStyle: "medium" });

		const finalData = memory.dailyStreaks
			.filter((tracker) => [yesterday, today].includes(tracker.last_login))
			.sort((a, b) => b.login_streak - a.login_streak)
			.slice(0, limit);

		if (address &&
			finalData.findIndex((temp) => temp.address === address) === -1) {

			const currentUser = memory.dailyStreaks.find((tracker) =>
				tracker.address === address);

			if (currentUser) {

				finalData.push(currentUser);

			} else {

				finalData.push({
					_id: null,
					address,
					last_login: null,
					login_streak: 0,
					longest_login_streak: 0,
					bonus_points_earned: 0,
					status: "missing",
					change_in_points: 0,
				});

			}

		}

		return finalData;

	}

	// -------------------------------------------------------- species counts

	async rankSpeciesCounts(address, limit = 50) {

		const currentUserAddress = address ? address.toLowerCase() : null;

		const logs = [
			...memory.pointLogs[DB_COLLECTION_IDS[0]],
			...memory.pointLogs[DB_COLLECTION_IDS[1]],
			...memory.pointLogs[DB_COLLECTION_IDS[2]],
			...memory.pointLogs[DB_COLLECTION_IDS[3]],
			...memory.pointLogs[DB_COLLECTION_IDS[4]],
			...memory.pointLogs[DB_COLLECTION_IDS[5]],
		];

		const speciesByAddress = {};

		logs
			.filter((log) => log.species_id < 1000)
			.forEach((log) => {

				if (!speciesByAddress[log.address]) {
					speciesByAddress[log.address] = new Map();
				}

				// Keep a bird id for each unique species recorded by the user
				if (!speciesByAddress[log.address].has(log.species_id)) {
					speciesByAddress[log.address].set(log.species_id, log.bird_id);
				}

			});

		const createEntry = (logAddress) => ({

			address: logAddress,
			count: speciesByAddress[logAddress]?.size ?? 0,

			...getRarestBird([...(speciesByAddress[logAddress]?.entries() ?? [])]
				.map(([species_id, bird_id]) => ({ species_id, bird_id }))),

		});

		const finalData = Object.keys(speciesByAddress)
			.map((logAddress) => ({
				address: logAddress,
				count: speciesByAddress[logAddress].size,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, limit)
			.map((entry) => createEntry(entry.address));

		finalData.forEach((entry, idx) => {
			entry.rank = idx + 1;
		});

		if (currentUserAddress &&
			finalData.findIndex((temp) => temp.address === currentUserAddress) === -1) {

			finalData.push({
				...createEntry(currentUserAddress),
				rank: finalData.length > 0 ? finalData[finalData.length - 1].rank + 1 : 1,
			});

		}

		return finalData;

	}

	// -------------------------------------------------------- bird of the week

	async fetchBirdOfTheWeek() {

		return memory.birdsOfTheWeek.find((bird) => bird.active) ?? null;

	}

	async close() {
		// no-op
	}

};

module.exports = FakeDB;
