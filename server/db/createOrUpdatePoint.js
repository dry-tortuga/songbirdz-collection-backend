const { MongoClient } = require("mongodb");

// Create a new client and connect to MongoDB
const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);

const createOrUpdatePoint = async (data) => {

	try {

		// Connect to the "songbirdz" database and access its "point_logs" collection

		const database = client.db("songbirdz");
		const pointLogs = database.collection("point_logs");

		// Insert the defined document into the "point_logs" collection
		const result = await pointLogs.insertOne({
			address: data.address,
			bird_id: data.bird_id,
			amount: data.amount,
			timestamp: data.timestamp,
		});

		// Print the ID of the inserted document
		console.log(`A document was inserted with the _id: ${result.insertedId}`);

	} catch(error) {

		console.error(error);

	} finally {

		// Close the MongoDB client connection
		await client.close();

	}

};

module.exports = createOrUpdatePoint;
