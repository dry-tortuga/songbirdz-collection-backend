const createMemoryMatchLog = require("./createMemoryMatchLog");
const createOrUpdatePointLog = require("./createOrUpdatePointLog");
const fetchPointLog = require("./fetchPointLog");
const fetchPointLogs = require("./fetchPointLogs");
const rankPointLogs = require("./rankPointLogs");
const fetchDailyStreak = require("./fetchDailyStreak");
const rankDailyStreaks = require("./rankDailyStreaks");
const updateDailyStreak = require("./updateDailyStreak");

const { MongoClient } = require("mongodb");

class DB {

	constructor() {

		try {

			// Create a new client and connect to MongoDB
			this.client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);

		} catch (error) {
			console.error("Unable to initialize the MongoDB connection...");
		}

	}

	async close() {

		try {

			// Close the MongoDB client connection
			await this?.client.close();

		} catch (error) {
			console.error("Unable to close the MongoDB connection...");
		}


	}

	async createMemoryMatchLog(data) {
		return await createMemoryMatchLog(this.client, data);
	}

	async createOrUpdatePointLog(collectionId, data) {
		return await createOrUpdatePointLog(this.client, collectionId, data);
	}

	async fetchPointLog(collectionId, address, birdID) {
		return await fetchPointLog(this.client, collectionId, address, birdID);
	}

	async fetchPointLogs(collectionId, address) {
		return await fetchPointLogs(this.client, collectionId, address);
	}

	async rankPointLogs(collectionId, address, limit = 50) {
		return await rankPointLogs(this.client, collectionId, address, limit);
	}

	async fetchDailyStreak(address) {
		return await fetchDailyStreak(this.client, address);
	}

	async rankDailyStreaks(address, limit = 50) {
		return await rankDailyStreaks(this.client, address, limit);
	}

	async updateDailyStreak(address) {
		return await updateDailyStreak(this.client, address);
	}

};

module.exports = DB;
