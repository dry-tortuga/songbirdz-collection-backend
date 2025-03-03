const { OpenSeaStreamClient, Network } = require("@opensea/stream-js");
const { WebSocket } = require("ws");
const { LocalStorage } = require("node-localstorage");

const DB = require("../db");
const { processPoints, storePoints } = require("../utils/points");

// https://docs.opensea.io/reference/stream-api-overview

const OPENSEA_API_KEY = process.env.OPENSEA_PRIVATE_API_KEY;

const OPENSEA_COLLECTION_SLUG = process.env.OPENSEA_COLLECTION_SLUG;

// Choose the environments to listen to

let network = null, chain = null;

if (process.env.NODE_ENV === "staging") {

	network = Network.TESTNET;
	chain = "base_sepolia";

} else if (process.env.NODE_ENV === "production") {

	network = Network.MAINNET;
	chain = "base";

}

const SEASON_END_DATE = new Date('2025-02-28T23:00:00.000+00:00');

const initOpenseaStream = () => {

	if (!network) {
		console.error("Network is not specified for opensea stream...");
		return;
	}

	if (!chain) {
		console.error("Chain is not specified for opensea stream...");
		return;
	}

	if (!OPENSEA_API_KEY) {
		console.error("API key is not specified for opensea stream...");
		return;
	}

	if (!OPENSEA_COLLECTION_SLUG) {
		console.error("Collection slug is not specified for opensea stream...");
		return;
	}

	// Create a new connection to the database

	const db = new DB();

	// Create the client

	if (network) {

		const client = new OpenSeaStreamClient({
			token: OPENSEA_API_KEY,
			network,
			connectOptions: {
				transport: WebSocket,
				sessionStorage: LocalStorage
			},
		});

		client.onItemTransferred(OPENSEA_COLLECTION_SLUG, async (event) => {

			try {

				console.log('------------- OpenSea streamClient.onItemTransferred event --------');

				// Handle event

				const payload = event.payload;

				console.log(event);

				if (payload.collection.slug !== OPENSEA_COLLECTION_SLUG) {
					throw new Error(`Encountered an invalid collection.slug=${payload.collection.slug} for a transfer!`);
				}

				if (payload.item.chain.name !== chain) {
					throw new Error(`Encountered an invalid chain=${payload.collection.slug} for a transfer!`);
				}

				const timestamp = payload.event_timestamp;

				const nftPiecesID = payload.item.nft_id.split('/');

				if (nftPiecesID[0] !== chain) {
					throw new Error(`Encountered an invalid chain=${nftPiecesID[0]} for a transfer!`);
				}

				if (nftPiecesID[1].toLowerCase() !== process.env.SONGBIRDZ_CONTRACT_ADDRESS.toLowerCase()) {
					throw new Error(`Encountered an invalid contract address=${nftPiecesID[1]} for a transfer!`);
				}

				// Check to make sure the event occurred before the season end date
                                const sentAt = new Date(event.sent_at);

                                if (sentAt.valueOf() > SEASON_END_DATE.valueOf()) {

                                        console.log(`Ignoring event sent after deadline, i.e. sent_at=${event.sent_at}`);
                                        return;

                                }

				const parsedStringId = nftPiecesID[2];

				const quantity = payload.quantity;

				if (quantity !== 1) {
					throw new Error(`Encountered an invalid quantity=${quantity} for a transfer!`);
				}

				// Convert string value to decimal value for the bird ID
				const id = parseInt(parsedStringId, 10);

				const from = payload.from_account.address.toLowerCase();
				const to = payload.to_account.address.toLowerCase();

				// Process the event to determine the amount of points to award
				const {
					pointsToAward,
					speciesID,
				} = processPoints(id, from, to, {
					type: 'transfer',
				});

				const result = {
					[to]: {
						[speciesID]: {
							bird_id: id,
							amount: pointsToAward,
							timestamp: new Date(timestamp),
						},
					}
				};

				// Store the point results in the database

				console.log(result);

				await storePoints(db, result);

			} catch (error) {
				console.log(error);
			}

		});

		client.onItemSold(OPENSEA_COLLECTION_SLUG, async (event) => {

			try {

				// Handle event

				const payload = event.payload;

				console.log('------------- OpenSea streamClient.onItemSold event --------');
				console.log(event);

				if (payload.collection.slug !== OPENSEA_COLLECTION_SLUG) {
					throw new Error(`Encountered an invalid collection.slug=${payload.collection.slug} for a sale!`);
				}

				if (payload.item.chain.name !== chain) {
					throw new Error(`Encountered an invalid chain=${payload.collection.slug} for a sale!`);
				}

				const timestamp = payload.event_timestamp;

				const nftPiecesID = payload.item.nft_id.split('/');

				if (nftPiecesID[0] !== chain) {
					throw new Error(`Encountered an invalid chain=${nftPiecesID[0]} for a sale!`);
				}

				if (nftPiecesID[1].toLowerCase() !== process.env.SONGBIRDZ_CONTRACT_ADDRESS.toLowerCase()) {
					throw new Error(`Encountered an invalid contract address=${nftPiecesID[1]} for a sale!`);
				}

				// Check to make sure the event occurred before the season end date
                                const sentAt = new Date(event.sent_at);

                                if (sentAt.valueOf() > SEASON_END_DATE.valueOf()) {

                                        console.log(`Ignoring event sent after deadline, i.e. sent_at=${event.sent_at}`);
                                        return;

                                }

				const parsedStringId = nftPiecesID[2];

				const quantity = payload.quantity;
				const salePrice = parseInt(payload.sale_price, 10);

				if (quantity !== 1) {
					throw new Error(`Encountered an invalid quantity=${quantity} for a sale!`);
				}

				// Convert string value to decimal value for the bird ID
				const id = parseInt(parsedStringId, 10);

				const from = payload.maker.address.toLowerCase();
				const to = payload.taker.address.toLowerCase();

				// Process the event to determine the amount of points to award
				const {
					pointsToAward,
					speciesID,
				} = processPoints(id, from, to, {
					type: 'sale',
					pricePaid: salePrice,
				});

				const result = {
					[to]: {
						[speciesID]: {
							bird_id: id,
							amount: pointsToAward,
							timestamp: new Date(timestamp),
						},
					}
				};

				// Store the point results in the database

				console.log(result);

				await storePoints(db, result);

			} catch (error) {
				console.log(error);
			}

		});

	}

};

module.exports = initOpenseaStream;
