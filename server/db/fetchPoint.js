const { MongoClient } = require("mongodb");

// Create a new client and connect to MongoDB
const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);

const fetchPoint = async (address, birdID) => {

	try {

		// Connect to the "songbirdz" database and access its "point_logs" collection

		const database = client.db("songbirdz");
		const pointLogs = database.collection("point_logs");

		// Query for a matching point log
		const result = await movies.findOne({
			address,
			bird_id: birdID,
			// TODO: Add lte based on the point amount
		});

		console.log(result);

	} catch(error) {

		console.error(error);

	} finally {

		// Close the MongoDB client connection
		await client.close();

	}

};

module.exports = fetchPoint;
