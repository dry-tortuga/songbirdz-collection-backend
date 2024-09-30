const createOrUpdatePointLog = require("./createOrUpdatePointLog");
const fetchPointLog = require("./fetchPointLog");
const fetchPointLogs = require("./fetchPointLogs");
const rankPointLogs = require("./rankPointLogs");
const updateDailyStreak = require('./updateDailyStreak');

const { MongoClient } = require("mongodb");

class DB {

	constructor() {

		if (process.env.NODE_ENV === "production") {

			// Create a new client and connect to MongoDB
			this.client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);

		}

	}

	async close() {

		if (process.env.NODE_ENV === "production") {

			// Close the MongoDB client connection
			await this.client.close();

		}

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

	async rankDailyStreaks(address, limit = 50) {
		return await rankDailyStreaks(address, limit);
	}

	async updateDailyStreak(address) {
		return await updateDailyStreak(this.client, address);
	}

};

module.exports = DB;
