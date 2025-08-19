# SongBirdz Back-End

This project contains the back-end for the [SongBirdz NFT collection](https://songbirdz.cc). It includes the solidity contract, test code for that contract, a NodeJS server to serve images, metadata, and merkle proofs, as well as the scripts used to generate and deploy the collection.

You can find the front-end application [here](https://github.com/dry-tortuga/songbirdz-collection-frontend).

**NOTE:** The `./private` folder is not included in this repo, which contains the species names, images, audio files, and merkle trees for all 10 flocks in the collection... so you will need to generate it yourself if forking this repo!

# Solidity (ERC721 Contract)

The [Hardhat](https://hardhat.org/) configuration for all contracts is in the `./hardhat.config.js` file.

**NPM commands:**
- `npm run compile-contracts` - compiles all contracts.
- `npm run test-contracts` - tests all contracts.
- `npm run start-blockchain` - starts a local blockchain for testing.
- `npm run verify-testnet` - verifies a deployed ERC721 contract on testnet.
- `npm run verify-mainnet` - verifies a deployed ERC721 contract on mainnet.

## SongBirdz.sol - 10k NFT Collection

The ERC721 contract for the SongBirdz NFT collection is in the `./contracts/SongBirdz.sol` file.

Test code for the contract is in the `./test/SongBirdz.js` file.

**Hardhat scripts:**

- `./scripts/solidity/main/deployContract.js` - deploys the ERC721 contract.
- `./scripts/solidity/main/populateCollection.js` - populates the data for all 10,000 birds (10 flocks) in the ERC721 contract.
- `./scripts/solidity/main/bulkSend.js` - bulk transfers ERC721 tokens (i.e. birds).
- `./scripts/solidity/main/fetchHolders.js` - fetches all ERC721 token holders (i.e. bird owners).

**NPM commands:**

*(LOCAL)*
- `npm run deploy-local` - deploys the ERC721 contract to a local blockchain.
- `npm run populate-local` - populates the deployed ERC721 contract with data for all 10,000 birds (10 flocks) on a local blockchain.

*(TESTNET)*
- `npm run deploy-testnet` - deploys the ERC721 contract to testnet.
- `npm run populate-testnet` - populates the deployed ERC721 contract with data for all 10,000 birds (10 flocks) on testnet.

*(MAINNET)*
- `npm run deploy-mainnet` - deploys the ERC721 contract to mainnet.
- `npm run populate-mainnet` - populates the deployed ERC721 contract with data for all 10,000 birds (10 flocks) on mainnet.
- `npm run bulk-send-mainnet` - bulk sends ERC721 tokens on mainnet.
- `npm run fetch-holders-mainnet` - fetches the list of ERC721 token holders on mainnet.

## SongBirdzHOF.sol - Hall of Fame Collection

The ERC721 contract for the SongBirdz Hall of Fame collection is in the `./contracts/SongBirdzHOF.sol` file.

There is no test code for the contract.

**Hardhat scripts:**

- `./scripts/solidity/hof/deployContract.js` - deploys the ERC721 contract.
- `./scripts/solidity/hof/populateCollection.js` - adds trophy data to the ERC721 contract.

**NPM commands:**

*(LOCAL)*
- `npm run deploy-hof-local` - deploys the ERC721 contract to a local blockchain.
- `npm run populate-hof-local` - adds trophy data to the deployed ERC721 contract on a local blockchain.

*(TESTNET)*
- `npm run deploy-hof-testnet` - deploys the ERC721 contract to testnet.
- `npm run populate-hof-testnet` - adds trophy data to the deployed ERC721 contract on testnet.

*(MAINNET)*
- `npm run deploy-hof-mainnet` - deploys the ERC721 contract to mainnet.
- `npm run populate-hof-mainnet` - adds trophy data to the deployed ERC721 contract on mainnet.

# NodeJS (Server)

The `./server` folder contains all logic related to the back-end server which is used to serve images, audio files, metadata, and merkle proofs for the NFT collection.

Since each bird starts out unidentified, this back-end server is used to obfuscate the species name  associated with each bird until it has been successfully identified. Once all 10,000 birds are identified, the back-end server will be shut-down in favor of a decentralized solution.

It uses the OpenSea Streaming SDK to listen for ERC-721 transfer and sale events in real-time and award points to the user, as needed.

**API endpoints:**

- `GET /birds/image/:id` -> Returns the image file associated with the given bird ID.
- `GET /birds/metadata/:id` -> Returns the metadata associated with the given bird ID. If the bird is not yet identified, then the species name and description will be hidden. See [here](https://docs.opensea.io/docs/getting-started) for the expected JSON structure of the response.
- `GET /birds/merkle-proof/:id` -> Returns the merkle tree proof associated with the given bird ID and species name guess.
- `GET /birds/already-identified-list` -> Returns a list of bird IDs that have already been identified.
- `GET /birds/random-bird` -> Returns a random bird ID that is not yet identified.
- `GET /birds/points/leaderboard` -> Returns the points leaderboard for a specific season.
- `GET /birds/life-list/leaderboard` -> Returns the life list leaderboard across all seasons.
- `GET /birds/life-list/data` -> Returns the life list data for a specific user.
- `GET /birds/daily-streaks/active` -> Returns the daily streak leaderboard.
- `GET /birds/daily-streak` -> Returns the daily streak for a specific user.
- `POST /birds/daily-streak` -> Updates the daily streak for a specific user.
- `GET /birds/memory-match/leaderboard` -> Returns the leaderboard for the memory match game.
- `GET /birds/memory-match/games-played` -> Returns the games played (today) for a specific user for the memory match game.
- `POST /birds/memory-match/log` -> Stores the result of a memory match game for a specific user.

**Node scripts:**
- `./scripts/node/backfillBonusPoints.js` - backfills bonus points data based on offchain activities such as user activity on Twitter, Telegram, and Farcaster.
- `./scripts/node/backfillSpeciesPoints.js` - backfills points data based on ERC-721 transfer and sale events, using the OpenSea and Alchemy SDKs.
- `./scripts/node/generateImages.js` - generates the image files using Dalle-3 for a flock of 1000 birds.
- `./scripts/node/generateMerkleTree.js` - generates the merkle tree for a flock of 1000 birds.
- `./scripts/node/generateSpeciesAndAudio.js` - generates the species names, answer choices, and audio files for a flock of 1000 birds.
- `./scripts/node/refreshCacheOpensea.js` - refreshes the cached metadata for all 10,000 birds on OpenSea.
- `./scripts/node/regenerateAudio.js` - regenerates the audio files for a subset of the birds in a given flock.

**Bash scripts:**
- `./scripts/bash/backfillCache` - refreshes the server cache with up-to-date identification status for the 10,000 birds.
- `./scripts/bash/processImageFilesXXX` - converts the final image files from webp to jpg (256/768) for the 10,000 birds.
- `./scripts/bash/trimAudioFiles` - cleans up the final audio files for the 10,000 birds.

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 22.0.0 required)

2. Clone this repository

3. Navigate into the project directory

	```bash
	$ cd songbirdz-collection-backend
	```

4. Install the requirements

	```bash
	$ npm install
	$ npx api install "@opensea/v2.0#tyjem2mlwzlfgof"
	```

5. Make a copy of the example environment variables file

	On Linux systems:
	```bash
	$ cp .env.example .env.development
	```
	On Windows:
	```powershell
	$ copy .env.example .env.development
	```

6. Add your API keys, contract address, and wallet data to the newly created `.env.development` file

7. Start the blockchain on your local machine at http://localhost:8545

	```bash
	$ npm run start-blockchain
	```

8. Deploy the contract on your local machine to `0x5fbdb2315678afecb367f032d93f642f64180aa3`

	```bash
	$ npm run deploy-local
	```

9. Populate the NFT collection in the contract on your local machine

	```bash
	$ npm run populate-local
	```

10. Start the server on your local machine at http://localhost:3080

	```bash
	$ npm run start-server
	```

You should now be able to succesfully make API requests to the back-end server and run the front-end application!

## Deploying to Testnet

- [x] Populate the `.env.staging` file.
- [x] Ensure your Base Sepolia account has sufficient ETH to cover gas costs.
- [x] Deploy contract on Base Sepolia testnet via `npm run deploy-testnet`.
- [x] Navigate to https://sepolia.basescan.org and double check the contract on basescan.
- [x] Verify contract on Base Sepolia testnet via `npm run verify-testnet`.
- [x] Use the `publicSetBaseURI` method on basescan to update the `_baseURI` variable to "https://songbirdz.cc/birds/metadata/".
- [x] Use the `publicGetbaseURI` method to verify the `_baseURI` variable on basescan.
- [x] Use the `owner` method to verify the owner address on basescan.
- [x] Upload Picasso collection on Base Sepolia testnet via `npm run populate-testnet`.
- [x] Use the `publicGetNumBirds` and `collections` methods to verify Picasso collection on basescan.
- [x] Deploy the back-end server to gcloud/aws/azure/etc.
- [x] Deploy the front-end application to gcloud/aws/azure/etc.
- [x] Navigate to https://songbirdz.cc and verify that the application is working!
- [x] Successfully mint a bird NFT with Metamask - Chrome
- [x] Incorrectly mint a bird NFT with Metamask - Chrome
- [x] Successfully mint a bird NFT with Coinbase Wallet - Chrome
- [x] Incorrectly mint a bird NFT with Coinbase Wallet - Chrome
- [x] Successfully mint a bird NFT with Metamask - Mobile
- [x] Incorrectly mint a bird NFT with Metamask - Mobile
- [x] Successfully mint a bird NFT with Coinbase Wallet - Mobile
- [x] Incorrectly mint a bird NFT with Coinbase Wallet - Mobile
- [x] Verify the collection (i.e. metadata) on OpenSea testnet.

## Deploying to Production

- [x] Populate the `.env.production` file.
- [x] Ensure your Base account has sufficient ETH to cover gas costs.
- [x] Deploy contract on Base mainnet via `npm run deploy-mainnet`.
- [x] Navigate to https://basescan.org and double check the contract on basescan.
- [x] Verify contract on Base mainnet via `npm run verify-mainnet`.
- [x] Use the `publicSetBaseURI` method on basescan to update the `_baseURI` variable to "https://songbirdz.cc/birds/metadata/".
- [x] Use the `publicGetbaseURI` method to verify the `_baseURI` variable on basescan.
- [x] Use the `owner` method to verify the owner address on basescan.
- [x] Upload the Picasso collection on Base mainnet via `npm run populate-mainnet`.
- [x] Use the `publicGetNumBirds` and `collections` methods to verify Picasso collection on basescan.
- [x] Update front-end application About page to include link to Discord.
- [x] Update front-end application About page to include link to Contract on Base mainnet.
- [x] Update front-end application About page to include links to Github.
- [x] Deploy the back-end server to gcloud/aws/azure/etc.
- [x] Deploy the front-end application to gcloud/aws/azure/etc.
- [x] Navigate to https://songbirdz.cc and verify that the application is working!
- [x] Successfully mint a bird NFT with Metamask - Chrome
- [x] Incorrectly mint a bird NFT with Metamask - Chrome
- [x] Successfully mint a bird NFT with Coinbase Wallet - Chrome
- [x] Incorrectly mint a bird NFT with Coinbase Wallet - Chrome
- [x] Successfully mint a bird NFT with Metamask - Mobile
- [x] Incorrectly mint a bird NFT with Metamask - Mobile
- [x] Successfully mint a bird NFT with Coinbase Wallet - Mobile
- [x] Incorrectly mint a bird NFT with Coinbase Wallet - Mobile
- [x] Verify the collection (i.e. metadata) on OpenSea mainnet.

## Roadmap for Production
- [x] Upload the first 1,000 birds in the "Picasso Genesis" flock.
- [x] Successfully mint all 1,000 birds (0-999) in the "Picasso Genesis" flock.
- [x] Make public the (merkle-tree, images, species, audio) files for the "Picasso Genesis" flock.
- [x] Successfully mint all 1,000 birds (1000-1999) in the "Deep Blue" flock.
- [x] Make public the (merkle-tree, images, species, audio) files for the "Deep Blue" flock.
- [ ] Successfully mint all 1,000 birds (2000-2999) in the "Small & Mighty" flock.
- [x] Make public the (merkle-tree, images, species, audio) files for the "Small & Mighty" flock.
- [ ] Successfully mint all 1,000 birds (3000-3999) in the "Night & Day" flock.
- [x] Make public the (merkle-tree, images, species, audio) files for the "Night & Day" flock.
- [ ] Successfully mint all 1,000 birds (4000-4999) in the "Fire & Ice" flock.
- [x] Make public the (merkle-tree, images, species, audio) files for the "Fire & Ice" flock.
- [ ] Successfully mint all 1,000 birds (5000-5999) in the "Predator & Prey" flock.
- [x] Make public the (merkle-tree, images, species, audio) files for the "Predator & Prey" flock.
- [ ] Successfully mint all 1,000 birds (6000-6999) in the "Lovebirds" flock.
- [x] Make public the (merkle-tree, images, species, audio) files for the "Lovebirds" flock.
- [ ] Successfully mint all 1,000 birds (7000-7999) in the "Hatchlings" flock.
- [x] Make public the (merkle-tree, images, species, audio) files for the "Hatchlings" flock.
- [ ] Successfully mint all 1,000 birds (8000-8999) in the "Masters of Disguise" flock.
- [x] Make public the (merkle-tree, images, species, audio) files for the "Masters of Disguise" flock.
- [ ] Successfully mint all 1,000 birds (9000-9999) in the "Final Migration" flock.
- [x] Make public the (merkle-tree, images, species, audio) files for the "Final Migration" flock.
- [ ] Upload all metadata, images, and audio for the entire 10,000 NFT collection to a decentralized storage provider (i.e. [ipfs](https://ipfs.tech/).
- [ ] Use the `publicSetBaseURI` method on basescan to update the `_baseURI` variable to the new metadata URL in [ipfs](https://ipfs.tech/).
- [ ] Deploy a 2nd Solidity Contract to store Life List and Points data onchain.
- [ ] Official roadmap is now complete!
- [ ] TBD: Upload the web application to ipfs.
- [ ] TBD: Shut down the back-end server.
