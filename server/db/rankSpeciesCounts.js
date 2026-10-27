const { DB_COLLECTION_IDS, SPECIES_SUPPLY } = require('../constants');

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
				$unionWith: {
					coll: DB_COLLECTION_IDS[4],
					pipeline: []
				}
			},
			{
				$unionWith: {
					coll: DB_COLLECTION_IDS[5],
					pipeline: []
				}
			},
			{
				$match: {
					species_id: { $lt: 1000 }
				}
			},
			{
				$group: {
					_id: {
						address: "$address",
						species_id: "$species_id"
					},
					bird_id: {
						$first: "$bird_id"
					}
				}
			},
			{
				$group: {
					_id: "$_id.address",
					count: { $sum: 1 },
					species_docs: {
						$push: {
							species_id: "$_id.species_id",
							bird_id: "$bird_id"
						}
					}
				}
			},
			{
				$sort: {
					count: -1
				}
			},
			{
				$limit: limit
			},
			{
				$project: {
					address: "$_id",
					count: "$count",
					species_docs: "$species_docs",
					_id: 0
				}
			}
		];

		const results =
			await database.collection(DB_COLLECTION_IDS[0])
				.aggregate(pipeline).toArray();

		// Add rank & the user's rarest bird to each result
		const finalData = results.map((result, index) => ({

			address: result.address,
			count: result.count,
			rank: index + 1,

			...getRarestBird(result.species_docs),

		}));

		// Include current user if not in top results
		if (currentUserAddress &&
			finalData.findIndex((temp) => temp.address === currentUserAddress) === -1) {

			// Find the unique species (and a bird id for each) for current user
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
					$unionWith: {
						coll: DB_COLLECTION_IDS[4],
						pipeline: []
					}
				},
				{
					$unionWith: {
						coll: DB_COLLECTION_IDS[5],
						pipeline: []
					}
				},
				{
					$match: {
						address: currentUserAddress,
						species_id: { $lt: 1000 },
					}
				},
				{
					$group: {
						_id: "$species_id",
						bird_id: {
							$first: "$bird_id"
						}
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
					$unionWith: {
						coll: DB_COLLECTION_IDS[4],
						pipeline: []
					}
				},
				{
					$unionWith: {
						coll: DB_COLLECTION_IDS[5],
						pipeline: []
					}
				},
				{
					$match: {
						species_id: { $lt: 1000 }
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
							$gt: userResult.length
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
				count: userResult.length,
				rank,

				...getRarestBird(userResult.map((species) => ({
					species_id: species._id,
					bird_id: species.bird_id,
				}))),

			});

		}

		return finalData;

	} catch (error) {
		console.error(error);
		throw error;
	}

};

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

module.exports = rankSpeciesCounts;
