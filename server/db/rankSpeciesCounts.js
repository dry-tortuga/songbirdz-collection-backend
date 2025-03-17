const { DB_COLLECTION_IDS } = require('../constants');

const rankSpeciesCounts = async (client, address, limit) => {

	const currentUserAddress = address ? address.toLowerCase() : null;

	try {

		// Connect to the "songbirdz" database
		const database = client.db("songbirdz");

		// Aggregate unique species counts across all collections
		const pipeline = [
			{
				$facet: {
					results: DB_COLLECTION_IDS.map((name) => ({
						$unionWith: {
							coll: name,
							pipeline: []
						}
					}))
				}
			},
			{ $unwind: "$results" },
			{
				$group: {
					_id: {
						address: "$results.address",
						species_id: "$results.species_id"
					}
				}
			},
			{
				$group: {
					_id: "$_id.address",
					uniqueSpeciesCount: { $sum: 1 }
				}
			},
			{
				$sort: {
					uniqueSpeciesCount: -1
				}
			},
			{
				$limit: limit
			},
			{
				$project: {
					address: "$_id",
					count: "$uniqueSpeciesCount",
					rank: { $add: [{ $indexOfArray: [ "$ROOT", "$$CURRENT" ] }, 1] },
					_id: 0
				}
			}
		];

		const finalData = await database.aggregate(pipeline).toArray();

		// Include current user if not in top results
		if (currentUserAddress &&
			finalData.findIndex((temp) => temp.address === currentUserAddress) === -1) {

			// Count unique species for current user
			const userPipeline = [
				{
					$facet: {
						results: DB_COLLECTION_IDS.map((name) => ({
							$unionWith: {
								coll: name,
								pipeline: [
									{ $match: { address: currentUserAddress } }
								]
							}
						}))
					}
				},
				{ $unwind: "$results" },
				{
					$group: {
						_id: {
							address: "$results.address",
							species_id: "$results.species_id"
						}
					}
				},
				{
					$group: {
						_id: "$_id.address",
						uniqueSpeciesCount: { $sum: 1 }
					}
				}
			];

			const userResult = await database.aggregate(userPipeline).toArray();

			// Get count of all users who have a higher species count
			const rankPipeline = [
				{
					$facet: {
						results: DB_COLLECTION_IDS.map((name) => ({
							$unionWith: {
								coll: name,
								pipeline: []
							}
						}))
					}
				},
				{ $unwind: "$results" },
				{
					$group: {
						_id: {
							address: "$results.address",
							species_id: "$results.species_id"
						}
					}
				},
				{
					$group: {
						_id: "$_id.address",
						uniqueSpeciesCount: { $sum: 1 }
					}
				},
				{
					$match: {
						uniqueSpeciesCount: {
							$gt: userResult.length > 0 ? userResult[0].uniqueSpeciesCount : 0
						}
					}
				},
				{
					$count: "rank"
				}
			];

			const rankResult = await database.aggregate(rankPipeline).toArray();
			const rank = (rankResult.length > 0 ? rankResult[0].rank : 0) + 1;

			finalData.push({
				address: currentUserAddress,
				count: userResult.length > 0 ? userResult[0].uniqueSpeciesCount : 0,
				rank,
			});

		}

		return finalData;

	} catch (error) {
		console.error(error);
		throw error;
	}

};

module.exports = rankSpeciesCounts;
