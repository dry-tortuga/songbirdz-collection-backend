const {
	time,
	loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const { _populateBirds, _getProof } = require("./_helpers");

const MINT_CORRECT_GUESS_PRICE = ethers.parseEther("0.0015");
const MINT_INVALID_GUESS_PRICE = ethers.parseEther("0.00025");

const COLLECTION_BIRD_SIZE = 1000;

// https://hardhat.org/hardhat-chai-matchers/docs/reference

describe("SongBirdz", () => {

	// We define a fixture to reuse the same setup in every test.
	// We use loadFixture to run this setup once, snapshot that state,
	// and reset Hardhat Network to that snapshot in every test.
	async function deploySongBirdzFixture() {

		// Contract is deployed using the first signer/account by default
		const [owner, otherAccount] = await ethers.getSigners();

		// Contract is deployed with an initial balance of 10 ETH
		const initialBalance = ethers.parseEther("10");

		const SongBirdz = await ethers.getContractFactory("SongBirdz");
		const contract = await SongBirdz.deploy(owner.address, { value: initialBalance });

		return { contract, owner, otherAccount };

	}

	describe("Deployment", () => {

		it("Should set the right contract owner", async () => {

			const { contract, owner } = await loadFixture(deploySongBirdzFixture);

			expect(await contract.owner()).to.equal(owner.address);

		});

	});

	describe("publicSetBaseURI + publicGetBaseURI", () => {

		it("Should update the base URI if called by the contract owner", async () => {

			const { contract, owner, otherAccount } = await loadFixture(deploySongBirdzFixture);

			const uri = "https://127.0.0.1/api/metadata";
			const isFrozen = false;

			await contract.publicSetBaseURI(uri, isFrozen);

			expect(await contract.publicGetBaseURI()).to.equal(uri);
			expect(await contract.connect(otherAccount).publicGetBaseURI()).to.equal(uri);

		});

		it("Should freeze the base URI if called by the contract owner", async () => {

			const { contract, owner, otherAccount } = await loadFixture(deploySongBirdzFixture);

			// Attempt #1 should change the base URI and freeze it
			const uri = "https://127.0.0.1/api/metadata";
			const isFrozen = true;

			await contract.publicSetBaseURI(uri, isFrozen);

			expect(await contract.publicGetBaseURI()).to.equal(uri);
			expect(await contract.connect(otherAccount).publicGetBaseURI()).to.equal(uri);

			// Attempt #2 to change the base URI should revert
			await expect(contract.publicSetBaseURI("https://localhost/test", isFrozen))
				.to.be.revertedWith("the base uri cannot be changed");

		});

		it("Should revert if called by a normal user", async () => {

			const { contract, otherAccount } = await loadFixture(deploySongBirdzFixture);

			const uri = "https://127.0.0.1/api/metadata";
			const isFrozen = true;

			await expect(contract.connect(otherAccount).publicSetBaseURI(uri, isFrozen))
				.to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount")
				.withArgs(otherAccount.address);

		});

	});

	describe("publicWithdraw", () => {

		it("Should withdraw funds if called by the contract owner", async () => {

			const { contract, owner, otherAccount } = await loadFixture(deploySongBirdzFixture);

			const initialBalance = ethers.parseEther("10");
			const finalBalance = ethers.parseEther("0");

			// Attempt #1 to withdraw all the funds
			await expect(contract.publicWithdraw())
				.to.changeEtherBalances(
					[owner, contract],
					[initialBalance, -initialBalance]
				);

			// Attempt #2 to withdraw zero funds
			await expect(contract.publicWithdraw())
				.to.changeEtherBalances(
					[owner, contract],
					[finalBalance, -finalBalance]
				);

		});

		it("Should revert if called by a normal user", async () => {

			const { contract, owner, otherAccount } = await loadFixture(deploySongBirdzFixture);

			// ERROR: Attempt to withdraw all the funds
			await expect(contract.connect(otherAccount).publicWithdraw())
				.to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount")
				.withArgs(otherAccount.address);

		});

	});

	describe("publicGenerateBirds + publicGetNumBirds", () => {

		it("Should revert if called by a normal user", async () => {

			const { contract, otherAccount } = await loadFixture(deploySongBirdzFixture);

			const collectionId = 0;
			const merkleTreeRoot = ethers.keccak256(ethers.toUtf8Bytes("Testing!"));

			await expect(contract.connect(otherAccount).publicGenerateBirds(
				collectionId,
				merkleTreeRoot,
			))
				.to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount")
				.withArgs(otherAccount.address);

		});

		it("Should revert if the collection ID is invalid (for the first collection)", async () => {

			const { contract, owner } = await loadFixture(deploySongBirdzFixture);

			const collectionId = 1;
			const merkleTreeRoot = ethers.keccak256(ethers.toUtf8Bytes("Testing!"));

			await expect(contract.publicGenerateBirds(
				collectionId,
				merkleTreeRoot,
			)).to.be.revertedWith("collection id is invalid");

		});

		it("Should revert if the collection ID is invalid (for the second collection)", async () => {

			const { contract, owner } = await loadFixture(deploySongBirdzFixture);

			const collectionId = 5;
			const merkleTreeRoot = ethers.keccak256(ethers.toUtf8Bytes("Testing!"));

			await contract.publicGenerateBirds(0, merkleTreeRoot);

			await expect(contract.publicGenerateBirds(
				collectionId,
				merkleTreeRoot,
			)).to.be.revertedWith("collection id is invalid");

		});

		it("Should revert if attempting to upload more than 10000 (i.e. MINT_TOTAL_SIZE)", async () => {

			const { contract, owner } = await loadFixture(deploySongBirdzFixture);

			for (let i = 0; i <= 10; i++) {

				const collectionId = i;
				const merkleTreeRoot = ethers.keccak256(ethers.toUtf8Bytes("Testing!"));

				if (i === 10) {

					await expect(contract.publicGenerateBirds(
						collectionId,
						merkleTreeRoot,
					)).to.be.revertedWith("total limit is 10000");

				} else {

					await contract.publicGenerateBirds(
						collectionId,
						merkleTreeRoot,
					);

					const total = await contract.publicGetNumBirds();

					expect(total).to.equal(COLLECTION_BIRD_SIZE * (i + 1));

				}

			}

		});

		it("Should upload the full 10000 collection if called by contract owner", async () => {

			const { contract, owner } = await loadFixture(deploySongBirdzFixture);

			for (let i = 0; i < 10; i++) {

				const collectionId = i;
				const merkleTreeRoot = ethers.keccak256(ethers.toUtf8Bytes(`Testing with collection #${i}!`));

				await contract.publicGenerateBirds(
					collectionId,
					merkleTreeRoot,
				);

				const total = await contract.publicGetNumBirds();

				expect(total).to.equal(COLLECTION_BIRD_SIZE * (i + 1));

				const storedCollectionRoot = await contract.collections(i);

				expect(storedCollectionRoot).to.equal(merkleTreeRoot);

			}

		});

	});

	describe("publicMint", () => {

		describe("validation - nonReentrant", () => {

			it.skip("Should revert if attempting to re-enter the same function call", async () => {

				const { contract, owner } = await loadFixture(deploySongBirdzFixture);

			});

		});

		describe("validation - mint price", () => {

			it("Should revert if no eth amount sent", async () => {

				const { contract, owner } = await loadFixture(deploySongBirdzFixture);

				// Populate the collection with some birds
				const { collectionId, tree } = await _populateBirds(contract);

				const birdId = 1;

				// Get the merkle tree proof for the bird
				const { proof, speciesName } = _getProof(tree, birdId);

				const tx = contract.publicMint(
					birdId,
					proof,
					speciesName,
				);

				await expect(tx).to.be.revertedWith("incorrect ETH value sent");

			});

			it("Should revert if eth amount sent is too low", async () => {

				const { contract, owner } = await loadFixture(deploySongBirdzFixture);

				// Populate the collection with some birds
				const { collectionId, tree } = await _populateBirds(contract);

				const birdId = 1;

				// Get the merkle tree proof for the bird
				const { proof, speciesName } = _getProof(tree, birdId);

				const tx = contract.publicMint(
					birdId,
					proof,
					speciesName,
					{ value: ethers.parseEther("0.0014") },
				);

				await expect(tx).to.be.revertedWith("incorrect ETH value sent");

			});

			it("Should revert if eth amount sent is too high", async () => {

				const { contract, owner } = await loadFixture(deploySongBirdzFixture);

				// Populate the collection with some birds
				const { collectionId, tree } = await _populateBirds(contract);

				const birdId = 1;

				// Get the merkle tree proof for the bird
				const { proof, speciesName } = _getProof(tree, birdId);

				const tx = contract.publicMint(
					birdId,
					proof,
					speciesName,
					{ value: ethers.parseEther("0.2") },
				);

				await expect(tx).to.be.revertedWith("incorrect ETH value sent");

			});

		});

		describe("validation - mint id", () => {

			it("Should revert if no birds exist yet", async () => {

				const { contract, owner } = await loadFixture(deploySongBirdzFixture);

				// DOES NOT EXIST
				const birdId = 1;

				const proof = [
					"0xe6bac30c4dac7eeefea1acda69408a321ab36881e66959e5513fa4d22761985a",
					"0x3c6bfd5cbc1d67ddcdf24f724d9da644da45a9582dbe9b44f953a0f3cb129ff0",
				];

				const speciesName = `Bird #${birdId}`;

				const tx = contract.publicMint(
					birdId,
					proof,
					speciesName,
					{ value: MINT_CORRECT_GUESS_PRICE },
				);

				await expect(tx).to.be.revertedWith("no birds yet to mint");

			});

			it("Should revert if bird does not exist (with non-zero uint256 id)", async () => {

				const { contract, owner } = await loadFixture(deploySongBirdzFixture);

				// Populate the collection with some birds
				const { collectionId, tree } = await _populateBirds(contract);

				// DOES NOT EXIST
				const birdId = 1005;

				// Get the merkle tree proof for a valid bird
				const { proof, speciesName } = _getProof(tree, 999);

				const tx = contract.publicMint(
					birdId,
					proof,
					speciesName,
					{ value: MINT_CORRECT_GUESS_PRICE },
				);

				await expect(tx).to.be.revertedWith("invalid bird ID");

			});

			it("Should revert if bird does not exist (with max uint256 id)", async () => {

				const { contract, owner } = await loadFixture(deploySongBirdzFixture);

				// Populate the collection with some birds
				const { collectionId, tree } = await _populateBirds(contract);

				// DOES NOT EXIST
				const birdId = ethers.MaxUint256;

				// Get the merkle tree proof for a valid bird
				const { proof, speciesName } = _getProof(tree, 999);

				const tx = contract.publicMint(
					birdId,
					proof,
					speciesName,
					{ value: MINT_CORRECT_GUESS_PRICE },
				);

				await expect(tx).to.be.revertedWith("invalid bird ID");


			});

			it("Should revert if bird is already owned", async () => {

				const { contract, owner, otherAccount } = await loadFixture(deploySongBirdzFixture);

				// Populate the collection with some birds
				const { collectionId, tree } = await _populateBirds(contract);

				const birdId = 1;

				// Get the merkle tree proof for a valid bird
				const { proof, speciesName } = _getProof(tree, birdId);

				// Attempt #1: Successfully mint the bird
				await contract.publicMint(
					birdId,
					proof,
					speciesName,
					{ value: MINT_CORRECT_GUESS_PRICE },
				);

				expect(await contract.ownerOf(birdId)).to.equal(owner.address);

				// Attempt #2: Should fail
				const tx = contract.connect(otherAccount).publicMint(
					birdId,
					proof,
					speciesName,
					{ value: MINT_CORRECT_GUESS_PRICE },
				);

				await expect(tx).to.be.revertedWith("the bird is already owned");

			});

		});

		describe("success", () => {

			it("should handle an incorrect identification attempt for a normal user", async () => {

				const { contract, otherAccount } = await loadFixture(deploySongBirdzFixture);

				// Populate the collection with some birds
				const { collectionId, tree } = await _populateBirds(contract);

				const birdId = 1;

				// Get the merkle tree proof for a valid bird
				const { proof, speciesName } = _getProof(tree, 5);

				// Attempt #1: Successfully mint the bird
				const tx = contract.connect(otherAccount).publicMint(
					birdId,
					proof,
					speciesName,
					{ value: MINT_CORRECT_GUESS_PRICE },
				);

				// Check that the ether payment/refund was processed
				await expect(tx).to.changeEtherBalances(
					[contract, otherAccount],
					[MINT_INVALID_GUESS_PRICE, -MINT_INVALID_GUESS_PRICE]
				);

				// Check that the identification event was logged
				await expect(tx)
					.to.emit(contract, "BirdIdentification")
					.withArgs(birdId, otherAccount.address, speciesName);

			});

			it("should handle an incorrect identification attempt for the contract owner", async () => {

				const { contract, owner } = await loadFixture(deploySongBirdzFixture);

				// Populate the collection with some birds
				const { collectionId, tree } = await _populateBirds(contract);

				const birdId = 1;

				// Get the merkle tree proof for a valid bird
				const { proof, speciesName } = _getProof(tree, 5);

				// Attempt #1: Successfully mint the bird
				const tx = contract.publicMint(
					birdId,
					proof,
					speciesName,
					{ value: MINT_CORRECT_GUESS_PRICE },
				);

				// Check that the ether payment/refund was processed
				await expect(tx).to.changeEtherBalances(
					[contract, owner],
					[MINT_INVALID_GUESS_PRICE, -MINT_INVALID_GUESS_PRICE]
				);

				// Check that the identification event was logged
				await expect(tx)
					.to.emit(contract, "BirdIdentification")
					.withArgs(birdId, owner.address, speciesName);

			});

			it("should handle a correct identification attempt for a normal user", async () => {

				const { contract, otherAccount } = await loadFixture(deploySongBirdzFixture);

				// Populate the collection with some birds
				const { collectionId, tree } = await _populateBirds(contract);

				const birdId = 1;

				// Get the merkle tree proof for a valid bird
				const { proof, speciesName } = _getProof(tree, birdId);

				// Attempt #1: Successfully mint the bird
				const tx = contract.connect(otherAccount).publicMint(
					birdId,
					proof,
					speciesName,
					{ value: MINT_CORRECT_GUESS_PRICE },
				);

				// Check that the ether payment was processed
				await expect(tx).to.changeEtherBalances(
					[contract, otherAccount],
					[MINT_CORRECT_GUESS_PRICE, -MINT_CORRECT_GUESS_PRICE]
				);

				// Check that the token transfer event was logged
				await expect(tx)
					.to.emit(contract, "Transfer")
					.withArgs(ethers.ZeroAddress, otherAccount.address, birdId)

				// Check that the identification event was logged
				await expect(tx)
					.to.emit(contract, "BirdIdentification")
					.withArgs(birdId, otherAccount.address, speciesName);

				// Check that the account is the new owner of the token
				expect(await contract.ownerOf(birdId)).to.equal(otherAccount.address);

			});

			it("should handle a correct identification attempt for the contract owner", async () => {

				const { contract, owner } = await loadFixture(deploySongBirdzFixture);

				// Populate the collection with some birds
				const { collectionId, tree } = await _populateBirds(contract);

				const birdId = 1;

				// Get the merkle tree proof for a valid bird
				const { proof, speciesName } = _getProof(tree, birdId);

				// Attempt #1: Successfully mint the bird
				const tx = contract.publicMint(
					birdId,
					proof,
					speciesName,
					{ value: MINT_CORRECT_GUESS_PRICE },
				);

				// Check that the ether payment was processed
				await expect(tx).to.changeEtherBalances(
					[contract, owner],
					[MINT_CORRECT_GUESS_PRICE, -MINT_CORRECT_GUESS_PRICE]
				);

				// Check that the token transfer event was logged
				await expect(tx)
					.to.emit(contract, "Transfer")
					.withArgs(ethers.ZeroAddress, owner.address, birdId)

				// Check that the identification event was logged
				await expect(tx)
					.to.emit(contract, "BirdIdentification")
					.withArgs(birdId, owner.address, speciesName);

				// Check that the account is the new owner of the token
				expect(await contract.ownerOf(birdId)).to.equal(owner.address);

			});

		});

	});

});
