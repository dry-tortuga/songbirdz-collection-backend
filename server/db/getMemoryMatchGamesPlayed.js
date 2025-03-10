const getMemoryMatchGamesPlayed = async (client, address) => {

	const startOfDay = new Date(new Date().setHours(0,0,0,0));

	const count = await client.db().collection('memory_match_logs').countDocuments({
		address: address,
		timestamp: {
			$gte: startOfDay
		}
	});

	return count;

};

module.exports = getMemoryMatchGamesPlayed;
