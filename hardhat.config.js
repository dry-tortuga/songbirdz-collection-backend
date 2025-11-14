require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-ledger");
require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

// Load our custom hardhat task scripts
// require("./scripts/solidity/main/bulkSend");
// require("./scripts/solidity/main/fetchHolders");
require("./scripts/solidity/main/fetchIdentifiedBirds");
require("./scripts/solidity/main/populateCollection");
require("./scripts/solidity/hof/populateCollection");
// require("./scripts/solidity/lifeList/populateSpecies");

// https://docs.base.org/guides/deploy-smart-contracts

const isUsingLedgerHardwareWallet = Boolean(process.env.LEDGER_HARDWARE_WALLET_PUB_KEY);

console.log(`Initializing hardhat.config.js with isUsingLedgerHardwareWallet=${isUsingLedgerHardwareWallet}`);

const config = {
	solidity: {
		version: "0.8.22",
	},
	networks: {},
	defaultNetwork: "base-local",
	etherscan: {
		apiKey: {
			'base-mainnet': process.env.BASESCAN_PRIVATE_API_KEY,
			'base-sepolia': process.env.BASESCAN_PRIVATE_API_KEY,
		},
		customChains: [{
			network: "base-mainnet",
			chainId: 8453,
			urls: {
				apiURL: "https://api.basescan.org/api",
				browserURL: "https://basescan.org"
			}
		}, {
			network: "base-sepolia",
			chainId: 84532,
			urls: {
				apiURL: "https://api-sepolia.basescan.org/api",
				browserURL: "https://sepolia.basescan.org"
			}
		}]
	},
};

if (process.env.NODE_ENV === "development") {

	config.networks["base-local"] = {
		url: process.env.BASE_NETWORK_RPC_URL,
		accounts: [
			process.env.DEV_WALLET_PRIVATE_KEY_OWNER,
			process.env.DEV_WALLET_PRIVATE_KEY_NON_OWNER,
		],
		gasPrice: "auto",
		blockGasLimit: 30000000
	};

} else if (process.env.NODE_ENV === "staging") {

	config.networks["base-sepolia"] = {
		url: process.env.BASE_NETWORK_RPC_URL,
		accounts: undefined,
		ledgerAccounts: [process.env.LEDGER_HARDWARE_WALLET_PUB_KEY],
		gasPrice: "auto",
		verify: {
			etherscan: {
				apiUrl: "https://api-sepolia.basescan.org",
				apiKey: process.env.BASESCAN_PRIVATE_API_KEY,
			},
		},
	};

} else if (process.env.NODE_ENV === "production") {

	config.networks["base-mainnet"] = {
		url: process.env.BASE_NETWORK_RPC_URL,
		accounts: undefined,
		ledgerAccounts: [process.env.LEDGER_HARDWARE_WALLET_PUB_KEY],
		gasPrice: "auto",
		verify: {
			etherscan: {
				apiUrl: "https://api.basescan.org",
				apiKey: process.env.BASESCAN_PRIVATE_API_KEY
			},
		},
	};

}

module.exports = config;
