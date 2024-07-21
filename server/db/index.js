const createOrUpdatePointLog = require("./createOrUpdatePointLog");
const fetchPointLog = require("./fetchPointLog");
const fetchPointLogs = require("./fetchPointLogs");
const rankPointLogs = require("./rankPointLogs");

const { MongoClient } = require("mongodb");

class DB {

	constructor() {

		// Create a new client and connect to MongoDB
		this.client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);

	}

	async close() {

		// Close the MongoDB client connection
		await this.client.close();

	}

	async createOrUpdatePointLog(data) {
		return await createOrUpdatePointLog(this.client, data);
	}

	async fetchPointLog(address, birdID) {
		return await fetchPointLog(this.client, address, birdID);
	}

	async fetchPointLogs(address) {
		return await fetchPointLogs(this.client, address);
	}

	async rankPointLogs(limit = 50) {
		return await rankPointLogs(this.client, limit);
	}

};

module.exports = DB;
