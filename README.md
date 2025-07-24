# SongBirdz Back-End

This project contains the back-end for the [SongBirdz NFT collection](https://songbirdz.cc). It includes the solidity contract, test code for that contract, a NodeJS server to serve images, metadata, and merkle proof, as well as the scripts used to generate and deploy the collection.

You can find the front-end application [here](https://github.com/dry-tortuga/songbirdz-collection-frontend).

**NOTE:** The species names and merkle trees are hidden for now until each bird in the NFT collection has been successfully identified. This means the `./private` folder is not included in this repo, so you will need to generate it yourself if forking this repo!

# Solidity (ERC721 Contract)

The ERC721 contract for the SongBirdz NFT collection is in the `./contracts/SongBirdz.sol` file.

Test code for the contract is in the `./test/SongBirdz.js` file.

Hardhat configuration for the contract is in the `./hardhat.config.js` file.

There are 2 scripts related to the ERC721 contract:

1. `./scripts/solidity/deployContract.js` can be used to deploy the ERC721 contract to the local, test, and production environments.

2. `./scripts/solidity/populateCollection.js` can be used to populate the NFT collection once the ERC721 contract has been deployed to the local, test, and production environments.

There are npm commands related to the ERC721 contract:

1. `npm run compile-contracts` can be used to compile the ERC721 contract.

2. `npm run test-contracts` can be used to test the ERC721 contract.

# NodeJS (Server)

The `./server` folder contains all logic related to the back-end server which is used to serve images, metadata, and merkle proofs for the NFT collection.

Since each bird starts out unidentified, this back-end server is used to obfuscate the species name and image file associated with each bird until they've all been successfully identified. At that point in time, the back-end server will be shut-down and all species names, image data, and merkle trees will be moved to the front-end... and then eventually stored in a decentralized provider such as [nft.storage](https://nft.storage/).

The API endpoints for the server are:

- `GET /birds/image/:id` -> Returns the image file associated with the given bird ID.

- `GET /birds/metadata/:id` -> Returns the metadata associated with the given bird ID. If the bird is not yet identified, then the species name and description will be hidden. See [here](https://docs.opensea.io/docs/getting-started) for the expected JSON structure of the response.

- `GET /birds/merkle-proof/:id` -> Returns the merkle tree proof associated with the given bird ID and species name guess.

There are 4 node scripts related to the server:

1. `./scripts/node/generateImages.js` can be used to generate the image files using Dalle-3 for a collection of 1000 birds.

2. `./scripts/node/generateSpeciesAndAudio.js` can be used to generate the species names, answer choices, and audio files for a collection of 1000 birds.

3. `./scripts/node/generateMerkleTree.js` can be used to generate the merkle tree for a collection of 1000 birds.

4. `./scripts/node/backfillPoints.js` can be used to backfill any missing points based on transfer and sale events on OpenSea.

- `npx api install "@opensea/v2.0#tyjem2mlwzlfgof"`

There are 2 bash scripts related to the server:

1. `./scripts/bash/trimAudioFiles` can be used to clean up the final audio files for a collection of 1000 birds.

2. `./scripts/bash/processImageFilesXXX` can be used to clean up the final image files for a collection of 1000 birds.

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 16.18.0 required)

2. Clone this repository

3. Navigate into the project directory

	```bash
	$ cd songbirdz-collection-backend
	```

4. Install the requirements

	```bash
	$ npm install
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

8. Deploy the contract on your local machine at 0x5fbdb2315678afecb367f032d93f642f64180aa3

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

You should now be able to succesfully run the front-end application!

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
- [ ] Make public the (merkle-tree, images, species, audio) files for the "Small & Mighty" flock.
- [ ] Successfully mint all 1,000 birds (3000-3999) in the "Night & Day" flock.
- [ ] Make public the (merkle-tree, images, species, audio) files for the "Night & Day" flock.
- [ ] Successfully mint all 1,000 birds (4000-4999) in the "Fire & Ice" flock.
- [ ] Make public the (merkle-tree, images, species, audio) files for the "Fire & Ice" flock.
- [ ] Successfully mint all 1,000 birds (5000-5999) in the "Predator & Prey" flock.
- [ ] Make public the (merkle-tree, images, species, audio) files for the "Predator & Prey" flock.
- [ ] Successfully mint all 1,000 birds (6000-6999) in the "Lovebirds" flock.
- [ ] Make public the (merkle-tree, images, species, audio) files for the "Lovebirds" flock.
- [ ] Successfully mint all 1,000 birds (7000-7999) in the "Hatchlings" flock.
- [ ] Make public the (merkle-tree, images, species, audio) files for the "Hatchlings" flock.
- [ ] Successfully mint all 1,000 birds (8000-8999) in the "Masters of Disguise" flock.
- [ ] Make public the (merkle-tree, images, species, audio) files for the "Masters of Disguise" flock.
- [ ] Successfully mint all 1,000 birds (9000-9999) in the "Final Roost" flock.
- [ ] Make public the (merkle-tree, images, species, audio) files for the "Final Roost" flock.
- [ ] Upload all (metadata, merkle-trees, images, species, audio) files for the entire 10,000 NFT collection to a decentralized storage provider (i.e. [ipfs](https://ipfs.tech/).
- [ ] Use the `publicSetBaseURI` method on basescan to update the `_baseURI` variable to the new metadata URL in [ipfs](https://ipfs.tech/).
- [ ] Deploy a 2nd Solidity Contract to store Life List and Points data onchain.
- [ ] Roadmap is now complete!
- [ ] TBD: Upload the web application to ipfs.
- [ ] TBD: Shut down the back-end server.
