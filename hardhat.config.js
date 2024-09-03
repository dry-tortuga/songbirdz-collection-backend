require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-ledger");
require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

// Load our custom hardhat task scripts
require("./scripts/solidity/fetchHolders");
require("./scripts/solidity/populateCollection");

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
		url: "http://localhost:8545",
		accounts: [
			process.env.WALLET_PRIVATE_KEY_OWNER,
			process.env.WALLET_PRIVATE_KEY_NON_OWNER,
		],
		gasPrice: 1000000000,
	};

} else if (process.env.NODE_ENV === "staging") {

	config.networks["base-sepolia"] = {
		url: "https://sepolia.base.org",
		accounts:
			isUsingLedgerHardwareWallet ? undefined : [process.env.WALLET_PRIVATE_KEY_OWNER],
		ledgerAccounts:
			isUsingLedgerHardwareWallet ? [process.env.LEDGER_HARDWARE_WALLET_PUB_KEY] : undefined,
		gasPrice: 1000000000,
		verify: {
			etherscan: {
				apiUrl: "https://api-sepolia.basescan.org",
				apiKey: process.env.BASESCAN_PRIVATE_API_KEY,
			},
		},
	};

} else if (process.env.NODE_ENV === "production") {

	config.networks["base-mainnet"] = {
		url: "https://mainnet.base.org",
		accounts:
			isUsingLedgerHardwareWallet ? undefined : [process.env.WALLET_PRIVATE_KEY_OWNER],
		ledgerAccounts:
			isUsingLedgerHardwareWallet ? [process.env.LEDGER_HARDWARE_WALLET_PUB_KEY] : undefined,
		gasPrice: 1000000000,
		verify: {
			etherscan: {
				apiUrl: "https://api.basescan.org",
				apiKey: process.env.BASESCAN_PRIVATE_API_KEY
			},
		},
	};

}

module.exports = config;
