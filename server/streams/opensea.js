import { OpenSeaStreamClient, Network } from '@opensea/stream-js';
import { WebSocket } from 'ws';
import { LocalStorage } from 'node-localstorage';

// https://docs.opensea.io/reference/stream-api-overview

const OPENSEA_API_KEY = process.env.OPENSEA_PRIVATE_API_KEY;

const OPENSEA_COLLECTION_SLUG = process.env.OPENSEA_COLLECTION_SLUG;

// Choose the environments to listen to

let network = null;

if (process.env.NODE_ENV === 'staging') {

	network = Network.TESTNET;

} else if (process.env.NODE_ENV === 'production') {

	network = Network.MAINNET;

}

const initOpenseaStream = () => {

	if (!network) {
		console.error('Network is not specified for opensea stream...');
		return;
	}

	if (!OPENSEA_API_KEY) {
		console.error('API key is not specified for opensea stream...');
		return;
	}

	if (!OPENSEA_COLLECTION_SLUG) {
		console.error('Collection slug is not specified for opensea stream...');
		return;
	}

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

		client.onItemTransferred(OPENSEA_COLLECTION_SLUG, (event) => {

			// Handle event

		});

		client.onItemSold(OPENSEA_COLLECTION_SLUG, (event) => {

			// Handle event

		});

	}

};

module.exports = initOpenseaStream;
