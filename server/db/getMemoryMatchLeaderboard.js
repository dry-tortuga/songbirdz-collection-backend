const getCombinedLeaderboardQuery = (mode, address, limit, sortBy = 'total') => {

	// Base query parts that are always needed
    const baseQuery = [
        {
            $match: {
                mode
            }
        },
        {
            $group: {
                _id: "$address",
                total: {
                    $sum: "$score"
                },
                today: {
                    $sum: {
                        $cond: [{
                            $gte: ["$timestamp", new Date(new Date().setHours(0,0,0,0))]
                        }, "$score", 0]
                    }
                }
            }
        },
        {
            $sort: {
                [sortBy]: -1
            }
        },
        {
            $setWindowFields: {
                sortBy: { [sortBy]: -1 },
                output: {
                    rank: {
                        $rank: {}
                    }
                }
            }
        }
    ];

    // If address is provided, use facet to get both leaderboard and user stats
    if (address) {
        return [
            ...baseQuery,
            {
                $facet: {
                    leaderboard: [
                        { $limit: limit }
                    ],
                    userStats: [
                        {
                            $match: {
                                _id: address
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    leaderboard: {
                        $map: {
                            input: "$leaderboard",
                            as: "item",
                            in: {
                                address: "$$item._id",
                                total: "$$item.total",
                                today: "$$item.today",
                                rank: "$$item.rank"
                            }
                        }
                    },
                    userStats: {
                        $map: {
                            input: "$userStats",
                            as: "item",
                            in: {
                                address: "$$item._id",
                                total: "$$item.total",
                                today: "$$item.today",
                                rank: "$$item.rank"
                            }
                        }
                    }
                }
            }
        ];
    }

    // If no address, just return top X entries
    return [
        ...baseQuery,
        { $limit: limit },
        {
            $project: {
                address: "$_id",
                total: 1,
                today: 1,
                rank: 1,
                _id: 0
            }
        }
    ];

};

// Update the main function to accept sorting preference
const getMemoryMatchLeaderboard = async (client, data) => {

	try {

		const address = data.address;

		let mode = -1;
		if (data.mode === "easy") mode = 0;
		else if (data.mode === "medium") mode = 1;
		else if (data.mode === "hard") mode = 2;

		const limit = data.size;

		// Use sortBy parameter ('total' or 'today')
		const sortBy = data.sort_by || 'total';

		const database = client.db("songbirdz");
		const memoryMatchLogs = database.collection("memory_match_logs");

		const query = getCombinedLeaderboardQuery(mode, address, limit, sortBy);
		const result = await memoryMatchLogs.aggregate(query).toArray();

		// If address was provided, handle the faceted result
        if (address) {

        	const finalData = result[0].leaderboard;
            const userStats = result[0].userStats;

            if (userStats.length > 0 &&
                !finalData.some((entry) => entry.address === address)) {
                finalData.push(userStats[0]);
            }

            return finalData;

        }

        // If no address was provided, return the result directly
        return result;

	} catch (error) {
		console.error(error);
		return [];
	}

};

module.exports = getMemoryMatchLeaderboard;
