const {
	DB_COLLECTION_IDS,
	KEY_BIRD_DATA,
	SOURCE_SPECIES_DATA,
} = require("../constants");

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const OPENSEA_CONTRACT_MINT_PRICE = parseInt("1500000000000000", 10);

const convertBirdIDtoSpeciesID = (birdID) => {

	const speciesName = KEY_BIRD_DATA[birdID]?.name;

	if (!speciesName) {
		throw new Error(`Missing species name for bird_id=${birdID}!`);
	}

	const speciesData = SOURCE_SPECIES_DATA[speciesName];

	if (!speciesData) {
		throw new Error(`Missing species record for name=${speciesName}!`);
	}

	return speciesData.id;

};

const processPoints = (id, from, to, meta = {}) => {

	const speciesID = convertBirdIDtoSpeciesID(id);

	let pointsToAward = 0;

	// Check if the transfer was related to minting (i.e. successful identification)
	if (from === ZERO_ADDRESS) {

		pointsToAward = 10;

	// Check if the sale was above the minting price
	} else if (
		meta.type === "sale" &&
		meta.pricePaid > OPENSEA_CONTRACT_MINT_PRICE
	) {

		pointsToAward = 3;

	// Otherwise, all other ERC-721 transfers are worth only 1 point
	} else {
		pointsToAward = 1;
	}

	console.log(`pointsToAward=${pointsToAward}`);

	return {
		pointsToAward,
		speciesID,
	};

};

const storePoints = async (db, pointResults) => {

	// Loop through each address in the results
	for (const address in pointResults) {

		const birdIdentificationEvents = pointResults[address];

		// Loop through each species ID event for the address in the results
		for (const speciesID in birdIdentificationEvents) {

			console.log(
				`-------- Checking for id=${speciesID} for address=${address} ---------`
			);

			const data = birdIdentificationEvents[speciesID];

			const birdIntegerID = parseInt(data.bird_id, 10);
			const speciesIntegerID = parseInt(speciesID, 10);

			const existingLog = await db.fetchPointLog(
				DB_COLLECTION_IDS[3],
				address,
				speciesIntegerID
			);

			// Check to make sure the results don't already include this id/event combo
			if (!existingLog || existingLog.amount < data.amount) {

				await db.createOrUpdatePointLog(DB_COLLECTION_IDS[3], {
					address,
					species_id: speciesIntegerID,
					bird_id: birdIntegerID,
					amount: data.amount,
					timestamp: data.timestamp,
				});

			}

		}

	}

};

module.exports = {
	convertBirdIDtoSpeciesID,
	processPoints,
	storePoints,
};
