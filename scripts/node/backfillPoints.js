const { Alchemy, Network, Utils } = require("alchemy-sdk");
const fs = require("fs");
const OpenAI = require("openai");
const path = require("path");

const sdk = require("@api/opensea");

const db = require("../../server/db");
const {	SONGBIRDZ_CONTRACT_ABI } = require("../../server/constants");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const COLLECTION_NAME = "picasso";
const COLLECTION_START_INDEX = 0;
const COLLECTION_SIZE = 1000;

const OPENSEA_COLLECTION_SLUG = "songbirdz";

const OPENSEA_CONTRACT_MINT_PRICE = "1500000000000000";
const CONTRACT_GENESIS_BLOCK = 12723129;
const CONTRACT_GENESIS_TIME = new Date("2024-04-01 00:00");
const CURRENT_TIME = new Date();

const ONE_WEEK_IN_SECS = 604800;
const ONE_WEEK_IN_BLOCKS = 604800 / 12; // 1 block produced every 12 seconds

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const privatePath = path.join(__dirname, `../../private/${process.env.NODE_ENV}`);

// Get the list of species names to use as answer key for the collection

const speciesNames = fs.readFileSync(
	`${privatePath}/collections/${COLLECTION_NAME}/key.txt`, "utf8"
).split(/\r?\n/);

// https://docs.opensea.io/reference/list_events_by_collection

sdk.auth(process.env.OPENSEA_PRIVATE_API_KEY);

sdk.server("https://api.opensea.io");

// https://docs.alchemy.com/reference/alchemy-getassettransfers

const alchemy = new Alchemy({
	apiKey: process.env.ALCHEMY_API_KEY,
	network: Network.BASE_MAINNET,
});

/*
function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
*/

const finalPointResults = {};

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

			const from = event.from;
			const to = event.to;

			let pointsToAward = 0;

			// Check if the transfer was related to minting (i.e. successful identification)
			if (from === ZERO_ADDRESS) {

				pointsToAward = 10;

			// Otherwise, it was a simple transfer (or possibly a sale)
			} else {

				pointsToAward = 1;

			}

			// Check to make sure the results include an entry for the user's address
			if (!results[to]) {
				results[to] = {};
			}

			// Check to make sure the results don't already include this id/event combo
			if (!results[to][id] ||
				results[to][id] < pointsToAward) {

				// If not, then award the user the points!
				results[to][id] = pointsToAward;

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
			
			let from, to;

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

			if (event.payment.symbol !== "ETH") {
				throw new Error(`Encountered an invalid payment.symbol=${event.payment.symbol} for a sale!`);
			}

			if (event.payment.decimals !== 18) {
				throw new Error(`Encountered an invalid payment.decimals=${event.payment.decimals} for a sale!`);
			}

			let pointsToAward = 0;

			from = event.seller;
			to = event.buyer;

			// Check if the sale was above the minting price
			if (parseInt(event.payment.quantity, 10) > parseInt(OPENSEA_CONTRACT_MINT_PRICE, 10)) {

				pointsToAward = 3;

			// Otherwise, it's worth less points
			} else {

				pointsToAward = 1;

			}

			// Check to make sure the results include an entry for the user's address
			if (!finalResults[to]) {
				finalResults[to] = {};
			}

			// Check to make sure the results don't already include this id/event combo
			if (!finalResults[to][id] ||
				finalResults[to][id] < pointsToAward) {

				// If not, then award the user the points!
				finalResults[to][id] = pointsToAward;

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

			// Fetch all Alchemy events for the current time period

			result = await fetchAlchemyEvents(afterBlock, beforeBlock, result);

			// Fetch all OpenSea events for the current time period

			result = await fetchOpenseaEvents(after, before, result);

			// Move on to the next time period

			after.setSeconds(before.getSeconds() + ONE_WEEK_IN_SECS);
			before.setSeconds(before.getSeconds() + ONE_WEEK_IN_SECS);

			afterBlock += ONE_WEEK_IN_BLOCKS;
			beforeBlock += ONE_WEEK_IN_BLOCKS;

		}

		console.log("---------------- Final Point Results ------------------");
		console.log(result);

	} catch (error) {
		console.error(error);
	}

})();
