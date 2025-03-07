const updatePointLog = async (client, collectionId, data) => {

	try {

		// Connect to the "songbirdz" database and access the collection

		const database = client.db("songbirdz");
		const pointLogs = database.collection(collectionId);

		// Update the existing document in the collection
		const result = await pointLogs.updateOne(
			{
				address: data.address,
				species_id: data.species_id,
			},
			{
				$set: {
					bird_id: data.bird_id,
					amount: data.amount,
					timestamp: data.timestamp,
				}
			},
		);

		// Log the updated document
		console.log(`A document was updated for address=${data.address},species_id=${data.species_id}`);

		return result;

	} catch (error) {

		console.error(error);

	}

};

module.exports = updatePointLog;
