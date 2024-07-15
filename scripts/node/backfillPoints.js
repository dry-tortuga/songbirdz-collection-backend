const { Alchemy, Network, Utils } = require("alchemy-sdk");
const fs = require("fs");
const OpenAI = require("openai");
const path = require("path");

const sdk = require("@api/opensea");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const DB = require("../../server/db");
const {
	SONGBIRDZ_CONTRACT_ABI,
	KEY_BIRD_DATA,
	SOURCE_SPECIES_DATA,
} = require("../../server/constants");
const {
	processPoints,
	storePoints,
} = require("../../server/utils/points");

const COLLECTION_NAME = "picasso";
const COLLECTION_START_INDEX = 0;
const COLLECTION_SIZE = 1000;

const OPENSEA_COLLECTION_SLUG = "songbirdz";

const CONTRACT_GENESIS_BLOCK = 12723129;
const CONTRACT_GENESIS_TIME = new Date("2024-04-01 00:00");
const CURRENT_TIME = new Date();
const CURRENT_BLOCK = 16267048;

const ONE_WEEK_IN_SECS = 604800;
const ONE_WEEK_IN_BLOCKS = 604800 / 2; // 1 block produced every 2 seconds

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// https://docs.opensea.io/reference/list_events_by_collection

sdk.auth(process.env.OPENSEA_PRIVATE_API_KEY);

sdk.server("https://api.opensea.io");

// https://docs.alchemy.com/reference/alchemy-getassettransfers

const alchemy = new Alchemy({
	apiKey: process.env.ALCHEMY_API_KEY,
	network: Network.BASE_MAINNET,
});

const fetchAlchemyEvents = async (after, before, results = {}) => {

	let isLoadingMore = true;
	let nextBatchCursor = undefined;

	// Loop through each batch in this time period
	while (isLoadingMore) {

		console.log(`-------- next=${nextBatchCursor} --------`);

		const data = await alchemy.core.getAssetTransfers({
			fromBlock: after,
			toBlock: before,
			category: ["erc721"],
			contractAddresses: [process.env.SONGBIRDZ_CONTRACT_ADDRESS],
			order: "asc", // Oldest to Newest
			withMetadata: true,
			maxCount: "0x3e8", // 1000
			pageKey: nextBatchCursor, // Key for the next page
		});

		console.log(data.pageKey);

		// Loop through each event in this time period
		for (let i = 0, len = data.transfers.length; i < len; i++) {

			const event = data.transfers[i];

			console.log(event);

			let parsedHexId = Utils.hexStripZeros(event.tokenId).replace('0x', '');

			// Handle edge case of the bird with ID = 0
			if (parsedHexId === "") {
				parsedHexId = "0";
			}

			// Convert hex value to decimal value for the bird ID
			const id = parseInt(parsedHexId, 16);

			if (event.category !== "erc721") {
				throw new Error(`Encountered an invalid token id=${event.tokenId}!`);
			}

			if (event.erc721TokenId !== event.tokenId) {
				throw new Error(`Encountered an invalid token id=${event.tokenId}!`);
			}

			const from = event.from.toLowerCase();
			const to = event.to.toLowerCase();

			// Process the event to determine the amount of points to award
			const {
				pointsToAward,
				speciesID,
			} = processPoints(id, from, to, {
				type: 'transfer',
			});

			// Check to make sure the results include an entry for the user's address
			if (!results[to]) {
				results[to] = {};
			}

			// Check to make sure the results include an entry for the bird's ID
			if (!results[to][speciesID]) {

				results[to][speciesID] = {
					bird_id: null,
					amount: 0,
					timestamp: null,
				};

			}

			// Check to make sure the results don't already include this id/event combo
			if (results[to][speciesID].amount < pointsToAward) {

				// If not, then award the user the points!

				results[to][speciesID].bird_id = id;
				results[to][speciesID].amount = pointsToAward;
				results[to][speciesID].timestamp = new Date(event.metadata.blockTimestamp);

			}

		}

		// Check the cursor for the next batch of results for this time period
		nextBatchCursor = data.pageKey;

		// If there's no next batch of results, then we're done!
		if (!nextBatchCursor) {
			isLoadingMore = false;
		}

	}

	return results;

};

const fetchOpenseaEvents = async (after, before, results = {}) => {

	const finalResults = Object.assign({}, results);

	let isLoadingMore = true;
	let nextBatchCursor = undefined;

	// Loop through each batch in this time period
	while (isLoadingMore) {

		console.log(`-------- next=${nextBatchCursor} --------`);

		// Fetch the events from the OpenSea API
		const { data } = await sdk.list_events_by_collection({
			collection_slug: OPENSEA_COLLECTION_SLUG,
			event_type: ["sale"],
			after: Math.floor(CONTRACT_GENESIS_TIME.getTime() / 1000),
			before: Math.floor(before.getTime() / 1000),
			limit: "50",
			next: nextBatchCursor,
		});

		console.log(data.next);

		// Loop through each event in this time period
		for (let i = 0, len = data.asset_events.length; i < len; i++) {

			const event = data.asset_events[i];

			console.log(event);

			const id = parseInt(event.nft.identifier, 10);
			
			const from = event.seller.toLowerCase();
			const to = event.buyer.toLowerCase();

			if (event.event_type !== "sale") {
				throw new Error(`Encountered an invalid event_type=${event.event_type}!`);				
			}

			if (event.chain !== "base") {
				throw new Error(`Encountered an invalid chain=${event.chain}!`);
			}

			if (isNaN(id)) {
				throw new Error(`Encountered an invalid nft.identifier=${event.nft.identifier}!`);	
			}

			if (event.quantity !== 1) {
				throw new Error(`Encountered an invalid quantity=${event.quantity} for a sale!`);
			}

			if (event.payment.symbol !== "ETH" && event.payment.symbol !== "WETH") {
				throw new Error(`Encountered an invalid payment.symbol=${event.payment.symbol} for a sale!`);
			}

			if (event.payment.decimals !== 18) {
				throw new Error(`Encountered an invalid payment.decimals=${event.payment.decimals} for a sale!`);
			}

			// Process the event to determine the amount of points to award
			const {
				pointsToAward,
				speciesID,
			} = processPoints(id, from, to, {
				type: 'sale',
				pricePaid: parseInt(event.payment.quantity, 10),
			});

			// Check to make sure the results include an entry for the user's address
			if (!finalResults[to]) {
				finalResults[to] = {};
			}

			// Check to make sure the results include an entry for the bird's ID
			if (!results[to][speciesID]) {

				results[to][speciesID] = {
					bird_id: null,
					amount: 0,
					timestamp: null,
				};

			}

			// Check to make sure the results don't already include this id/event combo
			if (finalResults[to][speciesID].amount < pointsToAward) {

				// If not, then award the user the points!

				results[to][speciesID].bird_id = id;
				results[to][speciesID].amount = pointsToAward;
				results[to][speciesID].timestamp = new Date(event.event_timestamp * 1000);

			}

		}

		// Check the cursor for the next batch of results for this time period
		nextBatchCursor = data.next;

		// If there's no next batch of results, then we're done!
		if (!nextBatchCursor) {
			isLoadingMore = false;
		}

	}

	return finalResults;

};

// Generate and store the final image files for the collection
(async () => {

	// Create a new connection to the database

	const db = new DB();

	let after = new Date(CONTRACT_GENESIS_TIME);
	let before = new Date(CONTRACT_GENESIS_TIME);

	before.setSeconds(before.getSeconds() + ONE_WEEK_IN_SECS);

	let afterBlock = CONTRACT_GENESIS_BLOCK;
	let beforeBlock = afterBlock + ONE_WEEK_IN_BLOCKS;

	let nextBatchCursor = undefined;

	try {

		let result = {};

		// Check if we've reached the current date
		while (after < CURRENT_TIME) {

			console.log(`-------- Fetching events from ${after} to ${before} --------`);

			if (before >= CURRENT_TIME) {
				beforeBlock = "latest";
			}

			if (afterBlock >= CURRENT_BLOCK) {
				afterBlock = "latest";
			}

			if (beforeBlock >= CURRENT_BLOCK) {
				beforeBlock = "latest";
			}

			// Fetch all Alchemy events for the current time period

			result = await fetchAlchemyEvents(afterBlock, beforeBlock, result);

			// Fetch all OpenSea events for the current time period

			result = await fetchOpenseaEvents(after, before, result);

			// Move on to the next time period

			after.setSeconds(before.getSeconds() + ONE_WEEK_IN_SECS);
			before.setSeconds(before.getSeconds() + ONE_WEEK_IN_SECS);

			if (afterBlock !== "latest") {
				afterBlock += ONE_WEEK_IN_BLOCKS;
			}

			if (beforeBlock !== "latest") {
				beforeBlock += ONE_WEEK_IN_BLOCKS;
			}

		}

		console.log("---------------- Final Point Results ------------------");
		console.log(result);

		// Store the point results in the database

		await storePoints(db, result);

		// Close the connection to the database

		await db.close();

	} catch (error) {
		console.error(error);
	}

})();
