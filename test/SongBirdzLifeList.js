const {
	loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

const NUMBER_OF_SPECIES = 800;

const TIER_1_SIZE = 5;
const TIER_1_PRICE = 0;
const TIER_2_SIZE = 25;
const TIER_2_PRICE = ethers.parseEther("0.00001");

// https://hardhat.org/hardhat-chai-matchers/docs/reference

describe("SongBirdzLifeList", () => {

	async function deployLifeListFixture() {

		// Contract is deployed using the first signer/account by default
		const [owner, user1, user2, user3] = await ethers.getSigners();

		// Deploy the mock Songbirdz contract used for assignment of bird ownership
		const songbirdzContract = await ethers.deployContract("MockSongbirdz");

		const contract = await ethers.deployContract(
			"SongBirdzLifeList",
			[songbirdzContract.target],
		);

		return { contract, songbirdzContract, owner, user1, user2, user3 };

	}

	/**
	 * Helper method to add species to the collection for testing purposes.
	 *
	 * Species "i" has 5 birds with IDs (i*5) + (0-4), and color codes that
	 * are all equal to the species ID so they are easy to verify.
	 */
	async function generateSpecies(contract, count = 50) {

		for (let i = 0; i < count; i++) {

			const birdIds = [];
			for (let j = 0; j < 5; j++) {
				birdIds.push((i * 5) + j);
			}

			const speciesHex = Buffer.from(Array(32).fill(i)).toString("hex");

			const colors1 = `0x${speciesHex}`;
			const colors2 = `0x${speciesHex}`;

			const pixels = `0x${"01".repeat(128)}`;

			await contract.publicGenerateSpecies(
				colors1,
				colors2,
				i,
				pixels,
				birdIds,
				`Species ${i}`,
				`Family ${i}`,
			);

		}

	}

	describe("Deployment", () => {

		it("Should set the right contract owner", async () => {

			const { contract, owner } = await loadFixture(deployLifeListFixture);

			expect(await contract.owner()).to.equal(owner.address);

		});

		it("Should have no species uploaded initially", async () => {

			const { contract } = await loadFixture(deployLifeListFixture);

			expect(await contract.publicGetTotalSpecies()).to.equal(0);
			expect(await contract.publicGetTotalTokensMinted()).to.equal(0);
			expect(await contract.currentSpeciesId()).to.equal(0);

		});

	});

	describe("publicGenerateSpecies", () => {

		it("Should only be callable by the contract owner", async () => {

			const { contract, user1 } = await loadFixture(deployLifeListFixture);

			await expect(contract.connect(user1).publicGenerateSpecies(
				"0x1112223334445556667778889990001112223334445556667778889990001112",
				"0x9990001112223334445556667778889990001112223334445556667778889990",
				0,
				`0x${"01".repeat(128)}`,
				[0],
				"Species 0",
				"Family 0",
			)).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");

		});

		it("Should add a species correctly", async () => {

			const { contract } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract, 1);

			expect(await contract.publicGetTotalSpecies()).to.equal(1);
			expect(await contract.publicGetNameForSpecies(0)).to.equal("Species 0");
			expect(await contract.publicGetFamilyForSpecies(0)).to.equal("Family 0");
			expect(await contract.publicGetBirdCountForSpecies(0)).to.equal(5);

			expect(await contract.publicGetSpeciesIdForBird(3)).to.equal(0);
			expect(await contract.publicGetSpeciesNameForBird(3)).to.equal("Species 0");
			expect(await contract.publicGetSpeciesFamilyForBird(3)).to.equal("Family 0");

		});

		it("Should not allow species to be added out of order", async () => {

			const { contract } = await loadFixture(deployLifeListFixture);

			await expect(contract.publicGenerateSpecies(
				"0x1112223334445556667778889990001112223334445556667778889990001112",
				"0x9990001112223334445556667778889990001112223334445556667778889990",
				1,
				`0x${"01".repeat(128)}`,
				[0],
				"Species 1",
				"Family 1",
			)).to.be.revertedWithCustomError(contract, "SpeciesOutOfOrder");

		});

		it("Should not allow duplicate species to be added", async () => {

			const { contract } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract, 1);

			await expect(contract.publicGenerateSpecies(
				"0x1112223334445556667778889990001112223334445556667778889990001112",
				"0x9990001112223334445556667778889990001112223334445556667778889990",
				0,
				`0x${"01".repeat(128)}`,
				[0],
				"Species 0",
				"Family 0",
			)).to.be.revertedWithCustomError(contract, "SpeciesAlreadyExists");

		});

		it("Should map species to the correct flock", async () => {

			const { contract } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract, 610);

			expect(await contract.publicGetFlockForSpecies(0)).to.equal("Picasso Genesis");
			expect(await contract.publicGetFlockForSpecies(199)).to.equal("Picasso Genesis");
			expect(await contract.publicGetFlockForSpecies(200)).to.equal("Deep Blue");
			expect(await contract.publicGetFlockForSpecies(250)).to.equal("Small & Mighty");
			expect(await contract.publicGetFlockForSpecies(300)).to.equal("Night & Day");
			expect(await contract.publicGetFlockForSpecies(610 - 1)).to.equal("Final Migration");

			expect(await contract.publicGetFlockForBird(1001)).to.equal("Deep Blue");

		});

	});

	describe("publicMintLifeListRecordFromOwnership", () => {

		it("Should allow the owner to claim a species", async () => {

			const { contract, songbirdzContract, user1 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			await songbirdzContract.publicMintBird(user1.address, 3);

			await expect(contract.connect(user1).publicMintLifeListRecordFromOwnership(3))
				.to.emit(contract, "SpeciesIdentified")
				.withArgs(user1.address, 0, 3, "Species 0", 0);

			const [count, unlockedTier, speciesIds] = await contract.publicGetLifeList(user1.address);

			expect(count).to.equal(1);
			expect(unlockedTier).to.equal(0);
			expect(speciesIds.length).to.equal(1);
			expect(speciesIds[0]).to.equal(0);

			expect(await contract.ownerOf(0)).to.equal(user1.address);
			expect(await contract.publicGetTotalTokensMinted()).to.equal(1);

		});

		it("Should not allow claiming without owning the bird", async () => {

			const { contract, songbirdzContract, user1, user2 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			await songbirdzContract.publicMintBird(user2.address, 3);

			await expect(contract.connect(user1).publicMintLifeListRecordFromOwnership(3))
				.to.be.revertedWithCustomError(contract, "NotBirdOwner");

		});

		it("Should not allow claiming the same species twice", async () => {

			const { contract, songbirdzContract, user1 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			await songbirdzContract.publicMintBird(user1.address, 0);
			await songbirdzContract.publicMintBird(user1.address, 1);

			await contract.connect(user1).publicMintLifeListRecordFromOwnership(0);

			await expect(contract.connect(user1).publicMintLifeListRecordFromOwnership(1))
				.to.be.revertedWithCustomError(contract, "SpeciesAlreadyIdentified");

		});

		it("Should enforce the tier capacity limit", async () => {

			const { contract, songbirdzContract, user1 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			// Tier 1 allows a maximum of 5 species
			for (let i = 0; i < TIER_1_SIZE; i++) {
				await songbirdzContract.publicMintBird(user1.address, i * 5);
				await contract.connect(user1).publicMintLifeListRecordFromOwnership(i * 5);
			}

			await songbirdzContract.publicMintBird(user1.address, TIER_1_SIZE * 5);

			await expect(contract.connect(user1).publicMintLifeListRecordFromOwnership(TIER_1_SIZE * 5))
				.to.be.revertedWithCustomError(contract, "TierCapacityReached");

			const [count] = await contract.publicGetLifeList(user1.address);
			expect(count).to.equal(TIER_1_SIZE);

		});

		it("Should render the token URI correctly", async () => {

			const { contract, songbirdzContract, user1 } = await loadFixture(deployLifeListFixture);

			// Species 15 has color code "0f0f0f" which validates the hex parsing
			await generateSpecies(contract, 16);

			await songbirdzContract.publicMintBird(user1.address, 78);

			await contract.connect(user1).publicMintLifeListRecordFromOwnership(78);

			// It renders the SVG with the correct ( hexadecimal-parsed ) colors
			const uri = await contract.tokenURI(0);

			// Check the metadata contains the expected species info and SVG
			expect(uri.startsWith("data:application/json;base64,")).to.be.true;

			const decoded = JSON.parse(Buffer.from(uri.split("base64,")[1], "base64").toString());

			expect(decoded.attributes[0].value).to.equal("Species 15");
			expect(decoded.attributes[1].value).to.equal("15");
			expect(decoded.attributes[2].value).to.equal("Family 15");
			expect(decoded.image.startsWith("data:image/svg+xml;base64,")).to.be.true;

			const svg = Buffer.from(decoded.image.split("base64,")[1], "base64").toString();

			expect(svg.startsWith("<svg")).to.be.true;
			expect(svg.includes('fill="#0f0f0f"')).to.be.true;

		});

		it("Should not allow tokens to be transferred (SOULBOUND)", async () => {

			const { contract, songbirdzContract, user1, user2 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			await songbirdzContract.publicMintBird(user1.address, 3);

			await contract.connect(user1).publicMintLifeListRecordFromOwnership(3);

			await expect(contract.connect(user1).transferFrom(user1.address, user2.address, 0))
				.to.be.rejected;
			await expect(contract.connect(user1).safeTransferFrom(user1.address, user2.address, 0))
				.to.be.rejected;
			await expect(contract.connect(user1).approve(user2.address, 0))
				.to.be.rejected;
			await expect(contract.connect(user1).setApprovalForAll(user2.address, true))
				.to.be.rejected;

		});

	});

	describe("publicMintLifeListRecordsFromOwnership (BULK)", () => {

		it("Should claim multiple species in a single transaction", async () => {

			const { contract, songbirdzContract, user1 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			// Mint 6 birds of 4 different species
			await songbirdzContract.publicMintBird(user1.address, 0);
			await songbirdzContract.publicMintBird(user1.address, 1);
			await songbirdzContract.publicMintBird(user1.address, 6);
			await songbirdzContract.publicMintBird(user1.address, 10);
			await songbirdzContract.publicMintBird(user1.address, 11);
			await songbirdzContract.publicMintBird(user1.address, 16);

			await contract.connect(user1).publicMintLifeListRecordsFromOwnership([0, 1, 6, 10, 11, 16]);

			const [count, , speciesIds] = await contract.publicGetLifeList(user1.address);

			expect(count).to.equal(4);
			expect(speciesIds).to.deep.equal([0, 1, 2, 3]);

			expect(await contract.publicGetTotalTokensMinted()).to.equal(4);

			const counts = await contract.publicGetCountsForUsers([user1.address]);
			expect(counts).to.deep.equal([4n]);

		});

		it("Should skip unowned birds, duplicates, and unknown birds instead of reverting", async () => {

			const { contract, songbirdzContract, user1, user2 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			await songbirdzContract.publicMintBird(user1.address, 0);
			await songbirdzContract.publicMintBird(user2.address, 5);
			await songbirdzContract.publicMintBird(user1.address, 7);

			// bird 0 -> species 0 (owned)
			// bird 1 -> species 0 (unowned, same species as bird 0)
			// bird 5 -> species 1 (owned by someone else)
			// bird 6 -> species 1 (owned by no one)
			// bird 7 -> species 1 (owned, same species as bird 5? no, bird 5 owner skipped)

			await contract.connect(user1).publicMintLifeListRecordsFromOwnership([0, 1, 5, 6, 7]);

			const [count, , speciesIds] = await contract.publicGetLifeList(user1.address);

			expect(count).to.equal(2);
			expect(speciesIds).to.deep.equal([0, 1]);

		});

		it("Should revert if there is nothing to claim", async () => {

			const { contract, songbirdzContract, user1, user2 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			// Empty list
			await expect(contract.connect(user1).publicMintLifeListRecordsFromOwnership([]))
				.to.be.revertedWithCustomError(contract, "EmptyMint");

			// Bird ID outside of the collection
			await expect(contract.connect(user1).publicMintLifeListRecordsFromOwnership([10000]))
				.to.be.revertedWithCustomError(contract, "InvalidBirdId");

			// All birds unowned
			await songbirdzContract.publicMintBird(user2.address, 0);

			await expect(contract.connect(user1).publicMintLifeListRecordsFromOwnership([0]))
				.to.be.revertedWithCustomError(contract, "NoRecordsToClaim");

		});

		it("Should enforce the tier capacity limit for bulk claims", async () => {

			const { contract, songbirdzContract, user1 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			// Mint birds for 7 species but tier 1 only allows 5 species records
			for (let i = 0; i < 7; i++) {
				await songbirdzContract.publicMintBird(user1.address, i * 5);
			}

			await expect(contract.connect(user1).publicMintLifeListRecordsFromOwnership([0, 5, 10, 15, 20, 25, 30]))
				.to.be.revertedWithCustomError(contract, "TierCapacityReached");

			// Claim a single species first, then bulk claims should exclude the duplicate
			await contract.connect(user1).publicMintLifeListRecordFromOwnership(0);

			await contract.connect(user1).publicMintLifeListRecordsFromOwnership([0, 5, 10, 15, 20]);

			const [count, , speciesIds] = await contract.publicGetLifeList(user1.address);
			expect(count).to.equal(TIER_1_SIZE);
			expect(speciesIds).to.deep.equal([0, 1, 2, 3, 4]);

		});

	});

	describe("publicMintLifeListRecordFromHistory", () => {

		/**
		 * Builds a merkle tree containing a record for each (birdId, speciesId, address)
		 */
		async function deployLifeListTreeHistoryFixture() {

			const { contract, songbirdzContract, owner, user1, user2 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			// Give the users a bunch of birds, then simulate selling them
			await songbirdzContract.publicMintBird(user1.address, 0);
			await songbirdzContract.publicMintBird(user1.address, 6);
			await songbirdzContract.publicMintBird(user1.address, 10);
			await songbirdzContract.publicMintBird(user1.address, 50);
			await songbirdzContract.publicMintBird(user2.address, 1);

			// Simulate the users selling their birds
			await songbirdzContract.connect(user1).transferFrom(user1.address, user2.address, 0);
			await songbirdzContract.connect(user1).transferFrom(user1.address, user2.address, 6);
			await songbirdzContract.connect(user1).transferFrom(user1.address, user2.address, 10);
			await songbirdzContract.connect(user1).transferFrom(user1.address, user2.address, 50);
			await songbirdzContract.connect(user2).transferFrom(user2.address, user1.address, 1);

			// Build the merkle tree of all past history

			const values = [
				[0, 0, user1.address],
				[6, 1, user1.address],
				[10, 2, user1.address],
				[50, 10, user1.address],
				[1, 0, user2.address],
			];

			const tree = StandardMerkleTree.of(values, ["uint256", "uint256", "address"]);

			await contract.publicSetMerkleTree(tree.root, false);

			return { contract, songbirdzContract, owner, user1, user2, tree, values };

		}

		it("Should allow claiming your past species history", async () => {

			const { contract, user1, tree } = await loadFixture(deployLifeListTreeHistoryFixture);

			// Find the proof for bird 0 of species 0
			let proof;
			for (const [i, v] of tree.entries()) {
				if (v[0] === 0 && v[1] === 0 && v[2] === user1.address) {
					proof = tree.getProof(i);
				}
			}

			await expect(contract.connect(user1).publicMintLifeListRecordFromHistory(0, 0, proof))
				.to.emit(contract, "SpeciesIdentified")
				.withArgs(user1.address, 0, 0, "Species 0", 0);

			const [count, , speciesIds] = await contract.publicGetLifeList(user1.address);

			expect(count).to.equal(1);
			expect(speciesIds).to.deep.equal([0]);

		});

		it("Should not allow claiming history with an invalid proof", async () => {

			const { contract, user1, tree } = await loadFixture(deployLifeListTreeHistoryFixture);

			// Proof does not match the (birdId, speciesId, address) leaf being claimed
			let proof;
			for (const [i, v] of tree.entries()) {
				if (v[0] === 50 && v[1] === 10) {
					proof = tree.getProof(i);
				}
			}

			await expect(contract.connect(user1).publicMintLifeListRecordFromHistory(1, 2, proof))
				.to.be.revertedWithCustomError(contract, "InvalidHistoryProof");

		});

		it("Should not allow claiming another user's history", async () => {

			const { contract, user1, user2, tree } = await loadFixture(deployLifeListTreeHistoryFixture);

			// user2 tries to claim using user1's leaf
			let proof;
			for (const [i, v] of tree.entries()) {
				if (v[0] === 0 && v[1] === 0 && v[2] === user1.address) {
					proof = tree.getProof(i);
				}
			}

			await expect(contract.connect(user2).publicMintLifeListRecordFromHistory(0, 0, proof))
				.to.be.revertedWithCustomError(contract, "InvalidHistoryProof");

		});

		it("Should not allow claiming the same species twice", async () => {

			const { contract, songbirdzContract, user1, user2, tree } = await loadFixture(deployLifeListTreeHistoryFixture);

			let proof;
			for (const [i, v] of tree.entries()) {
				if (v[0] === 0 && v[1] === 0 && v[2] === user1.address) {
					proof = tree.getProof(i);
				}
			}

			await contract.connect(user1).publicMintLifeListRecordFromHistory(0, 0, proof);

			// user1 now owns bird 1 of species 0 (transferred from user2)
			await songbirdzContract.publicMintBird(user1.address, 4);

			await expect(contract.connect(user1).publicMintLifeListRecordFromOwnership(4))
				.to.be.revertedWithCustomError(contract, "SpeciesAlreadyIdentified");

			// And claiming species 0 from history again should revert too
			await expect(contract.connect(user1).publicMintLifeListRecordFromHistory(0, 0, proof))
				.to.be.revertedWithCustomError(contract, "SpeciesAlreadyIdentified");

		});

		it("Should lock the merkle tree permanently", async () => {

			const { contract } = await loadFixture(deployLifeListFixture);

			await contract.publicSetMerkleTree(ethers.ZeroHash, false);
			await contract.publicSetMerkleTree(ethers.ZeroHash, true);

			await expect(contract.publicSetMerkleTree(ethers.ZeroHash, false))
				.to.be.revertedWithCustomError(contract, "HistoryTreeLocked");

			expect(await contract.historyMerkleTree()).to.equal(ethers.ZeroHash);
			expect(await contract.isHistoryTreeLocked()).to.be.true;

		});

	});

	describe("publicMintLifeListRecordsFromHistory (BULK)", () => {

		it("Should claim multiple species in a single transaction", async () => {

			const { contract, user1 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			const values = [
				[0, 0, user1.address],
				[6, 1, user1.address],
				[10, 2, user1.address],
				[50, 10, user1.address],
			];

			const tree = StandardMerkleTree.of(values, ["uint256", "uint256", "address"]);

			await contract.publicSetMerkleTree(tree.root, false);

			const proofs = [];
			for (let i = 0; i < values.length; i++) {
				proofs.push(tree.getProof(i));
			}

			await contract.connect(user1).publicMintLifeListRecordsFromHistory(
				[0, 6, 10, 50],
				[0, 1, 2, 10],
				proofs,
			);

			const [count, , speciesIds] = await contract.publicGetLifeList(user1.address);

			expect(count).to.equal(4);
			expect(speciesIds).to.deep.equal([0, 1, 2, 10]);
			expect(await contract.publicGetTotalTokensMinted()).to.equal(4);

		});

		it("Should skip duplicates and invalid entries instead of reverting", async () => {

			const { contract, user1 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			const values = [
				[0, 0, user1.address],
				[6, 1, user1.address],
			];

			const tree = StandardMerkleTree.of(values, ["uint256", "uint256", "address"]);

			await contract.publicSetMerkleTree(tree.root, false);

			await contract.connect(user1).publicMintLifeListRecordFromHistory(0, 0, tree.getProof(0));

			// species 0 is already claimed (skipped), then species 1 and species 1 again (deduped)
			await expect(contract.connect(user1).publicMintLifeListRecordsFromHistory(
				[0, 6, 7],
				[0, 1, 1],
				[tree.getProof(0), tree.getProof(1), tree.getProof(1)],
			)).to.emit(contract, "SpeciesIdentified").withArgs(user1.address, 1, 6, "Species 1", 1);

			const [count, , speciesIds] = await contract.publicGetLifeList(user1.address);

			expect(count).to.equal(2);
			expect(speciesIds).to.deep.equal([0, 1]);

		});

		it("Should revert if the arrays do not match", async () => {

			const { contract, user1 } = await loadFixture(deployLifeListFixture);

			const values = [
				[0, 0, user1.address],
			];

			const tree = StandardMerkleTree.of(values, ["uint256", "uint256", "address"]);

			await contract.publicSetMerkleTree(tree.root, false);

			await expect(contract.connect(user1).publicMintLifeListRecordsFromHistory(
				[0],
				[0],
				[tree.getProof(0), tree.getProof(0)],
			)).to.be.revertedWithCustomError(contract, "ArrayLengthMismatch");

		});

		it("Should not allow claiming history for another user's leafs", async () => {

			const { contract, user1, user2 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			const values = [
				[0, 0, user2.address],
			];

			const tree = StandardMerkleTree.of(values, ["uint256", "uint256", "address"]);

			await contract.publicSetMerkleTree(tree.root, false);

			await expect(contract.connect(user1).publicMintLifeListRecordsFromHistory(
				[0],
				[0],
				[tree.getProof(0)],
			)).to.be.revertedWithCustomError(contract, "InvalidHistoryProof");

		});

	});

	describe("publicUnlockNextTier", () => {

		it("Should unlock the next tier with payment", async () => {

			const { contract, songbirdzContract, user1 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			// Fill up tier 1 (5 species max)
			for (let i = 0; i < TIER_1_SIZE; i++) {
				await songbirdzContract.publicMintBird(user1.address, i * 5);
				await contract.connect(user1).publicMintLifeListRecordFromOwnership(i * 5);
			}

			// Tier 1 is free -> cannot be unlocked again
			expect(await contract.publicGetNextTierPrice(user1.address)).to.equal(TIER_2_PRICE);

			// Cannot claim more than 5 species in tier 1
			await songbirdzContract.publicMintBird(user1.address, TIER_1_SIZE * 5);
			await expect(contract.connect(user1).publicMintLifeListRecordFromOwnership(TIER_1_SIZE * 5))
				.to.be.revertedWithCustomError(contract, "TierCapacityReached");

			// Unlock tier 2 (25 species max)
			await expect(contract.connect(user1).publicUnlockNextTier({ value: TIER_2_PRICE }))
				.to.emit(contract, "TierUnlocked")
				.withArgs(user1.address, 1);

			expect(await contract.publicGetUnlockedTier(user1.address)).to.equal(1);

			// Now the claim will succeed
			await contract.connect(user1).publicMintLifeListRecordFromOwnership(TIER_1_SIZE * 5);

			const [count] = await contract.publicGetLifeList(user1.address);
			expect(count).to.equal(TIER_1_SIZE + 1);

		});

		it("Should not allow unlocking with insufficient payment", async () => {

			const { contract, user1 } = await loadFixture(deployLifeListFixture);

			await expect(contract.connect(user1).publicUnlockNextTier({ value: TIER_2_PRICE - 1n }))
				.to.be.revertedWithCustomError(contract, "InsufficientFunds");

			expect(await contract.publicGetUnlockedTier(user1.address)).to.equal(0);

		});

		it("Should not be unlockable beyond the final tier", async () => {

			const { contract, user1 } = await loadFixture(deployLifeListFixture);

			// Unlock all tiers (using a payment larger than every tier price)
			for (let i = 0; i < 4; i++) {
				await contract.connect(user1).publicUnlockNextTier({ value: ethers.parseEther("0.01") });
			}

			expect(await contract.publicGetUnlockedTier(user1.address)).to.equal(4);
			expect(await contract.publicGetNextTierPrice(user1.address)).to.equal(0);

			await expect(contract.connect(user1).publicUnlockNextTier({ value: TIER_2_PRICE }))
				.to.be.revertedWithCustomError(contract, "AllTiersUnlocked");

		});

	});

	describe("publicGetLifeListCompletion + ranking", () => {

		it("Should rank users based on their completion percentage", async () => {

			const { contract, songbirdzContract, owner, user1, user2, user3 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			// user1 claims 3 species
			await songbirdzContract.publicMintBird(user1.address, 0);
			await songbirdzContract.publicMintBird(user1.address, 5);
			await songbirdzContract.publicMintBird(user1.address, 10);

			await contract.connect(user1).publicMintLifeListRecordsFromOwnership([0, 5, 10]);

			// user2 claims 3 species
			await songbirdzContract.publicMintBird(user2.address, 15);
			await songbirdzContract.publicMintBird(user2.address, 20);
			await songbirdzContract.publicMintBird(user2.address, 25);

			await contract.connect(user2).publicMintLifeListRecordsFromOwnership([15, 20, 25]);

			// user3 needs a bigger tier to hold 10 species
			await contract.publicBackfillTiers(user3.address, 1, false);

			// user3 claims 10 species
			for (let i = 0; i < 10; i++) {
				await songbirdzContract.publicMintBird(user3.address, 50 + (i * 5));
			}

			await contract.connect(user3).publicMintLifeListRecordsFromOwnership(
				Array.from({ length: 10 }, (_, i) => 50 + (i * 5)),
			);

			// Ranks: user3 is #1 with 10 species, user1 and user2 share #2 with 3 species each
			expect(await contract.publicGetLifeListRank(user3.address)).to.equal(1);
			expect(await contract.publicGetLifeListRank(user1.address)).to.equal(2);
			expect(await contract.publicGetLifeListRank(user2.address)).to.equal(2);

			// Completion % in basis points: 10/800 = 125 (1.25%)
			const [countU3, totalU3, completionU3] = await contract.publicGetLifeListCompletion(user3.address);
			expect(countU3).to.equal(10);
			expect(totalU3).to.equal(NUMBER_OF_SPECIES);
			expect(completionU3).to.equal(125);

			// 3/800 = 37 (0.37%)
			const [, , completionU1] = await contract.publicGetLifeListCompletion(user1.address);
			expect(completionU1).to.equal(37);

			// Unranked users get a rank of 0
			expect(await contract.publicGetLifeListRank(ethers.ZeroAddress)).to.equal(0);
			expect(await contract.publicGetLifeListRank(owner.address)).to.equal(0);

		});

		it("Should update the rank as user counts change", async () => {

			const { contract, songbirdzContract, user1, user2 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			// Give both users a bigger tier to hold 10 species
			await contract.publicBackfillTiers(user1.address, 1, false);
			await contract.publicBackfillTiers(user2.address, 1, false);

			// user1 claims 2 species
			await songbirdzContract.publicMintBird(user1.address, 0);
			await songbirdzContract.publicMintBird(user1.address, 5);

			await contract.connect(user1).publicMintLifeListRecordsFromOwnership([0, 5]);

			// user2 claims 10 species
			for (let i = 0; i < 10; i++) {
				await songbirdzContract.publicMintBird(user2.address, 50 + (i * 5));
			}

			await contract.connect(user2).publicMintLifeListRecordsFromOwnership(
				Array.from({ length: 10 }, (_, i) => 50 + (i * 5)),
			);

			expect(await contract.publicGetLifeListRank(user2.address)).to.equal(1);
			expect(await contract.publicGetLifeListRank(user1.address)).to.equal(2);

			// user1 catches up with 8 more species
			const birdIdsToClaim = [];
			for (let i = 2; i < 10; i++) {
				birdIdsToClaim.push(i * 5);
				await songbirdzContract.publicMintBird(user1.address, i * 5);
			}

			await contract.connect(user1).publicMintLifeListRecordsFromOwnership(birdIdsToClaim);

			// Both users now share rank #1 with 10 species each
			expect(await contract.publicGetLifeListRank(user1.address)).to.equal(1);
			expect(await contract.publicGetLifeListRank(user2.address)).to.equal(1);

		});

		it("Should track the user list correctly", async () => {

			const { contract, songbirdzContract, user1, user2, user3 } = await loadFixture(deployLifeListFixture);

			await generateSpecies(contract);

			expect(await contract.publicGetTotalUsers()).to.equal(0);
			expect(await contract.publicIsUserRecorded(user1.address)).to.be.false;

			// user1 claims 1 species
			await songbirdzContract.publicMintBird(user1.address, 0);
			await contract.connect(user1).publicMintLifeListRecordFromOwnership(0);

			// user2 claims 1 species
			await songbirdzContract.publicMintBird(user2.address, 5);
			await contract.connect(user2).publicMintLifeListRecordFromOwnership(5);

			expect(await contract.publicGetTotalUsers()).to.equal(2);
			expect(await contract.publicGetUsers(0, 10)).to.deep.equal([user1.address, user2.address]);

			// Counts for users (batch read)
			const counts = await contract.publicGetCountsForUsers([user1.address, user2.address, user3.address]);
			expect(counts).to.deep.equal([1n, 1n, 0n]);

			// Batch claim for user3
			await songbirdzContract.publicMintBird(user3.address, 10);
			await songbirdzContract.publicMintBird(user3.address, 15);

			await contract.connect(user3).publicMintLifeListRecordsFromOwnership([10, 15]);

			expect(await contract.publicGetTotalUsers()).to.equal(3);
			expect(await contract.publicIsUserRecorded(user3.address)).to.be.true;

			expect(await contract.publicGetUsers(2, 3)).to.deep.equal([user3.address]);

		});

	});

});
