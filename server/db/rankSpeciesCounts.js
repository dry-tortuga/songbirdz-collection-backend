const { DB_COLLECTION_IDS } = require('../constants');

const rankSpeciesCounts = async (client, address, limit) => {

	const currentUserAddress = address ? address.toLowerCase() : null;

	try {

		// Connect to the "songbirdz" database
		const database = client.db("songbirdz");

		// Aggregate unique species counts across all collections
		const pipeline = [
			{
                $unionWith: {
                    coll: DB_COLLECTION_IDS[1],
                    pipeline: []
                }
            },
            {
	            $unionWith: {
	                coll: DB_COLLECTION_IDS[2],
	                pipeline: []
	            }
            },
            {
	            $unionWith: {
	                coll: DB_COLLECTION_IDS[3],
	                pipeline: []
	            }
            },
			{
				$group: {
					_id: {
						address: "$address",
						species_id: "$species_id"
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
					_id: 0
				}
			}
		];

		const finalData =
			await database.collection(DB_COLLECTION_IDS[0])
				.aggregate(pipeline).toArray();

		// Add rank to each result
		for (let i = 0; i < finalData.length; i++) {
			finalData[i].rank = i + 1;
		}

		// Include current user if not in top results
		if (currentUserAddress &&
			finalData.findIndex((temp) => temp.address === currentUserAddress) === -1) {

			// Count unique species for current user
			const userPipeline = [
				{
	                $unionWith: {
	                    coll: DB_COLLECTION_IDS[1],
	                    pipeline: []
	                }
	            },
	            {
		            $unionWith: {
		                coll: DB_COLLECTION_IDS[2],
		                pipeline: []
		            }
	            },
	            {
		            $unionWith: {
		                coll: DB_COLLECTION_IDS[3],
		                pipeline: []
		            }
	            },
				{
                    $match: { address: currentUserAddress }
                },
				{
					$group: {
						_id: {
							address: "$address",
							species_id: "$species_id"
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

			const userResult =
				await database.collection(DB_COLLECTION_IDS[0])
					.aggregate(userPipeline).toArray();

			// Get count of all users who have a higher species count
			const rankPipeline = [
				{
	                $unionWith: {
	                    coll: DB_COLLECTION_IDS[1],
	                    pipeline: []
	                }
	            },
	            {
		            $unionWith: {
		                coll: DB_COLLECTION_IDS[2],
		                pipeline: []
		            }
	            },
				{
		            $unionWith: {
		                coll: DB_COLLECTION_IDS[3],
		                pipeline: []
		            }
	            },
				{
                    $group: {
                        _id: {
                            address: "$address",
                            species_id: "$species_id"
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

			const rankResult =
				await database.collection(DB_COLLECTION_IDS[0])
					.aggregate(rankPipeline).toArray();

			const rank = rankResult.length > 0 ? (rankResult[0].rank + 1) : 'N/A';

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
