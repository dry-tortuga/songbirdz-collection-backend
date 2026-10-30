// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @dev The Songbirdz Life List
 *
 * A soulbound ERC-721 collection that stores a permanent record of the species
 * each user has collected in the Songbirdz project. There is one NFT issued for
 * each species (per user) with SVG images from xPoli stored fully onchain,
 * similar to how they are rendered/stored for the Hall of Fame contract.
 *
 * Species records can be claimed in two ways:
 *   1. Ownership   -> the user currently owns a Songbirdz bird of that species.
 *   2. History     -> the user owned the bird in the past, verified via a merkle
 *                     tree of all past data uploaded by the contract owner.
 *
 * Records can be claimed one at a time, or in bulk within a single transaction.
 */
interface ISongbirdz {
	function ownerOf(uint256 tokenId) external view returns (address);
}

contract SongBirdzLifeList is ERC721, Ownable {

	/* -------------------- CONSTANTS --------------- */

	// The total number of birds in the Songbirdz collection
	uint16 private constant NUMBER_OF_BIRDS = 10000;

	// The total number of species in the Songbirdz collection
	uint16 private constant NUMBER_OF_SPECIES = 800;

	// The number of 256-bit rows needed for the species bitmask (800/256 = 3.125)
	uint256 private constant SPECIES_BITMAP_ROWS = 4;

	// The unlock tiers for the life list, i.e. the maximum number of species
	// that a user can record before needing to unlock the next tier
	uint16[5] private SPECIES_UNLOCK_TIERS = [5, 25, 100, 250, NUMBER_OF_SPECIES];

	// The price to unlock each tier (index 0 is never used)
	uint256[5] private SPECIES_UNLOCK_TIERS_PRICE_ETH = [
		0,
		10000000000000,
		100000000000000,
		1000000000000000,
		10000000000000000
	];

	string private constant svgStartString = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="auto">';
	string private constant svgEndString = '</svg>';

	bytes private constant HEX_SYMBOLS = "0123456789abcdef";

	string[10] private flocks = [
		"Picasso Genesis",
		"Deep Blue",
		"Small & Mighty",
		"Night & Day",
		"Fire & Ice",
		"Predator & Prey",
		"Lovebirds",
		"Hatchlings",
		"Masters of Disguise",
		"Final Migration"
	];

	/* -------------------- STATE VARIABLES --------------- */

	// Store an instance of the original Songbirdz contract
	ISongbirdz private songbirdzContract;

	// Starting from 0, the species must be uploaded in sequential order until we have all 800
	uint256 public currentSpeciesId = 0;

	// The merkle tree root used to verify past history claims
	bytes32 public historyMerkleTree;

	// True, if the merkle tree (for past species history) is permanently locked
	bool public isHistoryTreeLocked = false;

	// True, if backfill of user unlocked tiers (for past species history) is permanently locked
	bool public isHistoryTiersLocked = false;

	// There are a total of 800 species in the collection
	mapping(uint16 => Species) private species;

	// There are a total of 10000 birds in the collection
	mapping(uint16 => uint16) private birdIdToSpeciesId;

	// Mapping of soulbound token ID to species ID for the erc-721 nfts
	mapping(uint256 => uint16) private tokenIdToSpeciesId;

	// The ID of the next soulbound ERC-721 token to be minted
	uint256 private nextTokenId;

	// Every user that has claimed at least one species (used to build leaderboards)
	address[] private userList;

	// True, if the user has been added to the user list
	mapping(address => bool) private isUserListed;

	// The number of users at each species count, i.e. speciesCountHistogram[c]
	// is the number of users that have recorded exactly "c" species.
	// (Used to compute leaderboard ranks without iterating the user list)
	uint16[801] private speciesCountHistogram;

	// Mapping of user address to their life list data
	mapping(address => LifeList) private users;

	/* ---------------------- CUSTOM EVENTS ------------------- */

	event SpeciesIdentified(
		address indexed user,
		uint256 indexed speciesId,
		uint256 birdId,
		string speciesName,
		uint256 newTokenId
	);

	event TierUnlocked(
		address indexed user,
		uint256 tier
	);

	/* ---------------------- CUSTOM ERRORS -------------------- */

	error HistoryTreeLocked();
	error HistoryTiersLocked();
	error InvalidTier();
	error InvalidHistoryProof();

	error SpeciesAlreadyExists();
	error SpeciesOutOfOrder();
	error MaxSpeciesReached();

	error EmptyMint();
	error ArrayLengthMismatch();
	error InvalidBirdId();
	error SpeciesAlreadyIdentified();
	error NotBirdOwner();
	error NoRecordsToClaim();

	error AllTiersUnlocked();
	error InsufficientFunds();
	error TierCapacityReached();

	/* --------------------- CUSTOM STRUCTS --------------- */

	struct Species {
		bytes32 colors1; // Store the hex color codes (each color = 3 bytes, first 8 colors)
		bytes32 colors2; // Store the hex color codes (each color = 3 bytes, last 8 colors)
		uint8 birdCount; // The number of birds in the collection that are this species (ranges from 1-50)
		bool exists; // Flag to indicate if this species has been added
		bytes pixels; // Store the image for each bird as a 16x16 pixel image (0-16 value for each pixel = 128 bytes)
		string name; // The name of the species
		string family; // The family of the species
	}

	struct LifeList {
		uint16 count; // The number of species recorded by the user
		uint8 unlockedTier; // The current unlocked tier of the user
		mapping(uint16 => uint256) speciesBitmap; // Bitmask of the species recorded by the user (up to 4 rows of 256 bits)
	}

	/* ----------------------- CONSTRUCTOR ------------------------- */

	// Contract constructor
	constructor(address songbirdzContractAddress) Ownable(msg.sender) ERC721("SongbirdzLifeList", "SongbirdzLifeList") {
		songbirdzContract = ISongbirdz(songbirdzContractAddress);
	}

	/* ------------------------ ADMIN METHODS (PUBLIC) -------------------------- */

	/**
	 * @dev Updates the merkle tree root and locked status, which is used
	 * to allow users to record species IDs from the past history of Songbirdz.
	 *
	 * @dev NOTE: Only called by the contract owner.
	 */
	function publicSetMerkleTree(bytes32 _root, bool _locked) external onlyOwner {

		if (isHistoryTreeLocked) {
			revert HistoryTreeLocked();
		}

		historyMerkleTree = _root;
		isHistoryTreeLocked = _locked;

	}

	/**
	 * @dev Updates the current unlocked tier for a user, which is used
	 * to allow users to record species IDs from the past history of Songbirdz.
	 *
	 * @dev NOTE: Only called by the contract owner.
	 */
	function publicBackfillTiers(address _address, uint8 _tier, bool _locked) external onlyOwner {

		if (isHistoryTiersLocked) {
			revert HistoryTiersLocked();
		}

		if (_tier > SPECIES_UNLOCK_TIERS.length - 1) {
			revert InvalidTier();
		}

		LifeList storage user = users[_address];

		user.unlockedTier = _tier;

		isHistoryTiersLocked = _locked;

	}

	/**
	 * @dev Adds a new species to the collection.
	 *
	 * @dev NOTE: Only called by the contract owner.
	 */
	function publicGenerateSpecies(
		bytes32 colors1,
		bytes32 colors2,
		uint16 speciesId,
		bytes memory pixels,
		uint16[] memory birdIds,
		string memory name,
		string memory family
	) external onlyOwner {

		// Cannot add duplicate species
		if (species[speciesId].exists) {
			revert SpeciesAlreadyExists();
		}

		// Cannot add more than 800 total species
		if (speciesId >= NUMBER_OF_SPECIES) {
			revert MaxSpeciesReached();
		}

		// Cannot add species out of sequential order
		if (speciesId != currentSpeciesId) {
			revert SpeciesOutOfOrder();
		}

		// Create the new species
		Species memory newSpecies = Species(
			colors1,
			colors2,
			uint8(birdIds.length), // set the bird count for this species
			true,
			pixels,
			name,
			family
		);

		species[speciesId] = newSpecies;

		// Map the bird token IDs (0-9999) to the species ID (0-799)
		for (uint256 i = 0; i < birdIds.length; i++) {
			birdIdToSpeciesId[birdIds[i]] = speciesId;
		}

		currentSpeciesId += 1;

	}

	/**
	 * @dev Withdraws any ETH sent to the contract (tier unlock fees).
	 *
	 * @dev NOTE: Only called by the contract owner.
	 */
	function publicWithdrawETH() external onlyOwner {
		(bool sent, ) = payable(msg.sender).call{value: address(this).balance}("");
		if (!sent) {
			revert InsufficientFunds();
		}
	}

	/* -------------------- CLAIMING LIFE LIST RECORDS (PUBLIC) ------------------ */

	/**
	 * @dev Claims a new species record in your Life List by owning the bird.
	 *
	 * @param birdId  The ID of the bird you currently own.
	 */
	function publicMintLifeListRecordFromOwnership(uint16 birdId) external {

		LifeList storage user = users[msg.sender];

		// Can never claim species outside of the collection
		if (birdId >= NUMBER_OF_BIRDS) {
			revert InvalidBirdId();
		}

		// Can never claim to have identified a species that does not exist yet
		uint16 speciesId = birdIdToSpeciesId[birdId];

		if (!species[speciesId].exists) {
			revert InvalidBirdId();
		}

		// Can only claim a species once
		if (_isSpeciesRecorded(user, speciesId)) {
			revert SpeciesAlreadyIdentified();
		}

		// Must still own the bird
		if (songbirdzContract.ownerOf(birdId) != msg.sender) {
			revert NotBirdOwner();
		}

		// Store the recording

		uint16[] memory birdIdsToCommit = new uint16[](1);
		uint16[] memory speciesIdsToCommit = new uint16[](1);

		birdIdsToCommit[0] = birdId;
		speciesIdsToCommit[0] = speciesId;

		_commitLifeListRecords(user, birdIdsToCommit, speciesIdsToCommit, 1);

	}

	/**
	 * @dev Claims a new species record in your Life List from your past history,
	 * i.e. for birds that you owned in the past but have since sold.
	 *
	 * @param birdId        The ID of the bird you previously owned.
	 * @param speciesId     The species ID of that bird.
	 * @param speciesProof  Your merkle proof for the bird.
	 */
	function publicMintLifeListRecordFromHistory(
		uint16 birdId,
		uint16 speciesId,
		bytes32[] calldata speciesProof
	) external {

		LifeList storage user = users[msg.sender];

		// Can never claim species outside of the collection
		if (birdId >= NUMBER_OF_BIRDS) {
			revert InvalidBirdId();
		}

		// Can only claim a species once
		if (_isSpeciesRecorded(user, speciesId)) {
			revert SpeciesAlreadyIdentified();
		}

		// Validate the bird ownership claim via the merkle proof provided

		bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(birdId, speciesId, msg.sender))));

		if (!MerkleProof.verify(speciesProof, historyMerkleTree, leaf)) {
			revert InvalidHistoryProof();
		}

		// Store the recording

		uint16[] memory birdIdsToCommit = new uint16[](1);
		uint16[] memory speciesIdsToCommit = new uint16[](1);

		birdIdsToCommit[0] = birdId;
		speciesIdsToCommit[0] = speciesId;

		_commitLifeListRecords(user, birdIdsToCommit, speciesIdsToCommit, 1);

	}

	/* ------------------- CLAIMING MULTIPLE LIFE LIST RECORDS (PUBLIC) ------------------- */

	/**
	 * @dev Claims a new species record in your Life List for each bird that you
	 * currently own. This lets you claim multiple species in bulk within a
	 * single transaction, which saves on gas fees.
	 *
	 * @dev Birds that are outside of the bird collection, no longer owned by the
	 * user, not yet identified (i.e. without a species ID), or that belong to a
	 * species already claimed in a previous call (or earlier in this call) are
	 * silently skipped rather than reverting the whole transaction.
	 *
	 * @param birdIdsToClaim  The list of IDs of birds to claim.
	 */
	function publicMintLifeListRecordsFromOwnership(uint16[] calldata birdIdsToClaim) external {

		if (birdIdsToClaim.length == 0) {
			revert EmptyMint();
		}

		LifeList storage user = users[msg.sender];

		// Build the list of new species recordings to commit

		uint16[] memory birdIdsToCommit = new uint16[](birdIdsToClaim.length);
		uint16[] memory speciesIdsToCommit = new uint16[](birdIdsToClaim.length);
		uint256 numberOfNewRecords = 0;

		// Temporary bitmask to track species handled within this call
		uint256[SPECIES_BITMAP_ROWS] memory pendingSpeciesBitmap;

		for (uint256 i = 0; i < birdIdsToClaim.length; i++) {

			uint16 birdId = birdIdsToClaim[i];

			// Can never claim species outside of the collection
			if (birdId >= NUMBER_OF_BIRDS) {
				revert InvalidBirdId();
			}

			// Skip birds that are not yet identified (i.e. without a species ID)
			uint16 speciesId = birdIdToSpeciesId[birdId];

			if (!species[speciesId].exists) {
				continue;
			}

			// Skip species already recorded by this user (or earlier in this call)
			if (_isSpeciesRecorded(user, speciesId) || _isSpeciesRecorded(pendingSpeciesBitmap, speciesId)) {
				continue;
			}

			// Skip birds that are no longer owned by the user
			// (including birds that have never been minted at all)
			bool isOwnedByUser = false;

			try songbirdzContract.ownerOf(birdId) returns (address currentOwner) {
				isOwnedByUser = currentOwner == msg.sender;
			} catch {
				// Bird has never been minted -> skip
			}

			if (!isOwnedByUser) {
				continue;
			}

			// Add this recording to the list of new records to commit
			_markSpeciesRecorded(pendingSpeciesBitmap, speciesId);

			birdIdsToCommit[numberOfNewRecords] = birdId;
			speciesIdsToCommit[numberOfNewRecords] = speciesId;
			numberOfNewRecords++;

		}

		if (numberOfNewRecords == 0) {
			revert NoRecordsToClaim();
		}

		_commitLifeListRecords(user, birdIdsToCommit, speciesIdsToCommit, numberOfNewRecords);

	}

	/**
	 * @dev Claims a new species record in your Life List for each bird from your
	 * past history, i.e. for birds that you owned in the past but have since
	 * sold. This lets you claim multiple species in bulk within a single
	 * transaction, which saves on gas fees.
	 *
	 * @dev The arrays are parallel lists, i.e. the bird at index `i` is
	 * `birdIdsToClaim[i]` of species `speciesIdsToClaim[i]` with the merkle
	 * proof `speciesProofs[i]`.
	 *
	 * @dev Birds that are outside of the bird collection, not yet identified
	 * (i.e. without a species ID), or that belong to a species already claimed
	 * in a previous call (or earlier in this call) are silently skipped rather
	 * than reverting the whole transaction.
	 *
	 * @param birdIdsToClaim     The list of IDs of birds to claim.
	 * @param speciesIdsToClaim  The list of species IDs for each bird.
	 * @param speciesProofs      The list of merkle proofs for each bird.
	 */
	function publicMintLifeListRecordsFromHistory(
		uint16[] calldata birdIdsToClaim,
		uint16[] calldata speciesIdsToClaim,
		bytes32[][] calldata speciesProofs
	) external {

		if (birdIdsToClaim.length == 0) {
			revert EmptyMint();
		}

		if (birdIdsToClaim.length != speciesIdsToClaim.length || birdIdsToClaim.length != speciesProofs.length) {
			revert ArrayLengthMismatch();
		}

		LifeList storage user = users[msg.sender];

		// Build the list of new species recordings to commit

		uint16[] memory birdIdsToCommit = new uint16[](birdIdsToClaim.length);
		uint16[] memory speciesIdsToCommit = new uint16[](birdIdsToClaim.length);
		uint256 numberOfNewRecords = 0;

		// Temporary bitmask to track species handled within this call
		uint256[SPECIES_BITMAP_ROWS] memory pendingSpeciesBitmap;

		for (uint256 i = 0; i < birdIdsToClaim.length; i++) {

			uint16 birdId = birdIdsToClaim[i];
			uint16 speciesId = speciesIdsToClaim[i];

			// Can never claim species outside of the collection
			if (birdId >= NUMBER_OF_BIRDS) {
				revert InvalidBirdId();
			}

			// Skip species already recorded by this user (or earlier in this call)
			if (_isSpeciesRecorded(user, speciesId) || _isSpeciesRecorded(pendingSpeciesBitmap, speciesId)) {
				continue;
			}

			// Validate the bird ownership claim via the merkle proof provided

			bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(birdId, speciesId, msg.sender))));

			if (!MerkleProof.verify(speciesProofs[i], historyMerkleTree, leaf)) {
				revert InvalidHistoryProof();
			}

			// Add this recording to the list of new records to commit
			_markSpeciesRecorded(pendingSpeciesBitmap, speciesId);

			birdIdsToCommit[numberOfNewRecords] = birdId;
			speciesIdsToCommit[numberOfNewRecords] = speciesId;
			numberOfNewRecords++;

		}

		if (numberOfNewRecords == 0) {
			revert NoRecordsToClaim();
		}

		_commitLifeListRecords(user, birdIdsToCommit, speciesIdsToCommit, numberOfNewRecords);

	}

	/* ------------------- UNLOCKING TIERS (PUBLIC) ------------------- */

	/**
	 * @dev Unlock the next tier in your life list to increase your maximum
	 * number of species records.
	 */
	function publicUnlockNextTier() external payable {

		LifeList storage user = users[msg.sender];

		// Cannot unlock more than the maximum number of tiers
		if (user.unlockedTier == SPECIES_UNLOCK_TIERS.length - 1) {
			revert AllTiersUnlocked();
		}

		// Get the price for the next tier
		uint256 price = SPECIES_UNLOCK_TIERS_PRICE_ETH[user.unlockedTier + 1];

		// Check if the user has sent enough ETH to pay for the next tier
		if (msg.value < price) {
			revert InsufficientFunds();
		}

		user.unlockedTier++;

		emit TierUnlocked(msg.sender, user.unlockedTier);

	}

	/* ----------------------- READING LIFE LIST DATA (PUBLIC) --------------------- */

	/**
	 * Gets the total number of species uploaded to the collection.
	 */
	function publicGetTotalSpecies() public view returns (uint256) {
		return currentSpeciesId;
	}

	/**
	 * Gets the number of soulbound NFTs minted in the contract so far.
	 */
	function publicGetTotalTokensMinted() public view returns (uint256) {
		return nextTokenId;
	}

	/**
	 * Gets the name for the provided species ID.
	 *
	 * @param speciesId  The species ID.
	 */
	function publicGetNameForSpecies(uint16 speciesId) public view returns (string memory) {
		return species[speciesId].name;
	}

	/**
	 * Gets the family for the provided species ID.
	 *
	 * @param speciesId  The species ID.
	 */
	function publicGetFamilyForSpecies(uint16 speciesId) public view returns (string memory) {
		return species[speciesId].family;
	}

	/**
	 * Gets the bird count for the provided species ID,
	 *	i.e. the number of birds in the collection that are of that species.
	 *
	 * @param speciesId  The species ID.
	 */
	function publicGetBirdCountForSpecies(uint16 speciesId) public view returns (uint16) {
		return species[speciesId].birdCount;
	}

	/**
	 * Gets the flock for the provided species ID.
	 *
	 * @param speciesId  The species ID.
	 */
	function publicGetFlockForSpecies(uint16 speciesId) public view returns (string memory) {
		if (speciesId < 200) {
			return flocks[0];
		} else if (speciesId >= 600) {
			return flocks[9];
		} else {
			uint16 flockIndex = ((speciesId - 200) / 50) + 1;
			return flocks[flockIndex];
		}
	}

	/**
	 * Gets the species ID for the provided bird ID.
	 *
	 * @param birdId  The bird ID.
	 */
	function publicGetSpeciesIdForBird(uint16 birdId) public view returns (uint16) {
		return birdIdToSpeciesId[birdId];
	}

	/**
	 * Gets the species name for the provided bird ID.
	 *
	 * @param birdId  The bird ID.
	 */
	function publicGetSpeciesNameForBird(uint16 birdId) public view returns (string memory) {
		return publicGetNameForSpecies(birdIdToSpeciesId[birdId]);
	}

	/**
	 * Gets the species family for the provided bird ID.
	 *
	 * @param birdId  The bird ID.
	 */
	function publicGetSpeciesFamilyForBird(uint16 birdId) public view returns (string memory) {
		return publicGetFamilyForSpecies(birdIdToSpeciesId[birdId]);
	}

	/**
	 * Gets the flock for the provided bird ID.
	 *
	 * @param birdId  The bird ID.
	 */
	function publicGetFlockForBird(uint16 birdId) public view returns (string memory) {
		uint16 speciesId = birdIdToSpeciesId[birdId];
		return publicGetFlockForSpecies(speciesId);
	}

	/**
	 * Gets the unlocked tier for the provided address.
	 *
	 * @param _address  The address of the user.
	 */
	function publicGetUnlockedTier(address _address) public view returns (uint8) {
		return users[_address].unlockedTier;
	}

	/**
	 * Gets the price to unlock the next tier for the provided address.
	 * Returns 0 if all tiers are already unlocked.
	 *
	 * @param _address  The address of the user.
	 */
	function publicGetNextTierPrice(address _address) public view returns (uint256) {

		uint8 unlockedTier = users[_address].unlockedTier;

		if (unlockedTier == SPECIES_UNLOCK_TIERS.length - 1) {
			return 0;
		}

		return SPECIES_UNLOCK_TIERS_PRICE_ETH[unlockedTier + 1];

	}

	/**
	 * Gets whether at least one species has been recorded by the provided address.
	 *
	 * @param _address  The address of the user.
	 */
	function publicIsUserRecorded(address _address) public view returns (bool) {
		return isUserListed[_address];
	}

	/**
	 * Gets the number of users that have claimed at least one species.
	 */
	function publicGetTotalUsers() public view returns (uint256) {
		return userList.length;
	}

	/**
	 * Gets a page of users that have claimed at least one species.
	 * Useful for building leaderboards.
	 *
	 * @param startIndex  The index to start from.
	 * @param endIndex    The index to end at (exclusive).
	 */
	function publicGetUsers(uint256 startIndex, uint256 endIndex) public view returns (address[] memory) {

		// Clamp to the size of the user list
		if (endIndex > userList.length) {
			endIndex = userList.length;
		}

		if (startIndex > endIndex) {
			startIndex = endIndex;
		}

		address[] memory addresses = new address[](endIndex - startIndex);

		for (uint256 i = startIndex; i < endIndex; i++) {
			addresses[i - startIndex] = userList[i];
		}

		return addresses;

	}

	/**
	 * Gets the life list data for the provided address: the species count,
	 * the unlocked tier, and the list of recorded species IDs (ascending).
	 *
	 * @param _address  The address of the user.
	 */
	function publicGetLifeList(address _address) public view returns (
		uint16 count,
		uint8 unlockedTier,
		uint16[] memory speciesIds
	) {

		LifeList storage user = users[_address];

		count = user.count;
		unlockedTier = user.unlockedTier;

		speciesIds = new uint16[](count);

		uint256 index = 0;

		// Walk the species bitmask rows to extract each recorded species ID in ascending order
		for (uint16 row = 0; row < SPECIES_BITMAP_ROWS; row++) {

			uint256 rowData = user.speciesBitmap[row];

			while (rowData != 0) {

				// Find the position of the lowest set bit in this row
				uint256 bitIndex = 0;

				while (((rowData >> bitIndex) & 1) == 0) {
					bitIndex++;
				}

				// Record this species ID and clear the bit
				speciesIds[index] = uint16((row * 256) + bitIndex);
				rowData = rowData & (rowData - 1);
				index++;

			}

		}

	}

	/**
	 * Gets the completion data for the provided address: the species count,
	 * the total number of species, and the completion percentage expressed in
	 * basis points (i.e. 50% completion = 5000).
	 *
	 * @param _address  The address of the user.
	 */
	function publicGetLifeListCompletion(address _address) public view returns (
		uint16 count,
		uint16 total,
		uint16 completionInPercentBps
	) {

		LifeList storage user = users[_address];

		count = user.count;
		total = uint16(NUMBER_OF_SPECIES);
		completionInPercentBps = uint16((uint256(count) * 10000) / NUMBER_OF_SPECIES);

	}

	/**
	 * Gets the rank for the provided address, i.e. 1 + the number of users with
	 * a strictly higher species count. Users with an equal species count share
	 * the same rank. Returns 0 for users that have not claimed any species yet.
	 *
	 * @param _address  The address of the user.
	 */
	function publicGetLifeListRank(address _address) public view returns (uint256) {

		LifeList storage user = users[_address];

		// Users without any species records are not ranked
		if (user.count == 0) {
			return 0;
		}

		// Count all users with a strictly higher species count
		uint256 rank = 1;

		for (uint16 c = uint16(NUMBER_OF_SPECIES); c > user.count; c--) {
			rank += speciesCountHistogram[c];
		}

		return rank;

	}

	/**
	 * Gets the species count for a batch of addresses.
	 * Useful for ranking multiple users in a single call.
	 *
	 * @param _addresses  The list of user addresses.
	 */
	function publicGetCountsForUsers(address[] calldata _addresses) public view returns (uint16[] memory) {

		uint16[] memory counts = new uint16[](_addresses.length);

		for (uint256 i = 0; i < _addresses.length; i++) {
			counts[i] = users[_addresses[i]].count;
		}

		return counts;

	}

	/**
	 * Builds the token URI for a species soulbound record in the user's life list.
	 *
	 * @param tokenId  The token ID.
	 */
	function tokenURI(uint256 tokenId) public view override returns (string memory) {

		// Check to make sure the token exists
		_requireOwned(tokenId);

		// Get the species ID associated with this life list record
		uint16 speciesId = tokenIdToSpeciesId[tokenId];

		// Get JSON attributes
		string memory attributes = _buildAttributesJSON(speciesId);

		// Get image
		string memory image = _buildSVG(speciesId);

		// Encode SVG data to base64
		string memory base64Image = Base64.encode(bytes(image));

		// Build JSON metadata
		string memory json = string(
			abi.encodePacked(
				'{"name": "Songbirdz Identification #', Strings.toString(tokenId), '",',
				'"description": "The Songbirdz Life List stores a permanent record of the species of birds a user has collected. Pixel art by xPoli. Code by drytortuga. The art and species data is stored fully onchain.",',
				'"attributes":',
				attributes,
				',"image": "data:image/svg+xml;base64,',
				base64Image,
				'"}'
			)
		);

		// Encode JSON data to base64
		string memory base64Json = Base64.encode(bytes(json));

		// Construct final URI
		return string(abi.encodePacked('data:application/json;base64,', base64Json));

	}

	/* ------------------------ SOULBOUND ERC-721 METHODS -------------------------- */

	function transferFrom(
		address from,
		address to,
		uint256 tokenId
	) public override(ERC721) {
		revert("SongBirdzLifeList: Tokens are non-transferable");
	}

	function safeTransferFrom(
		address from,
		address to,
		uint256 tokenId,
		bytes memory _data
	) public override(ERC721) {
		revert("SongBirdzLifeList: Tokens are non-transferable");
	}

	function approve(address to, uint256 tokenId) public override(ERC721) {
		revert("SongBirdzLifeList: Tokens are non-transferable");
	}

	function setApprovalForAll(address operator, bool approved) public override(ERC721) {
		revert("SongBirdzLifeList: Tokens are non-transferable");
	}

	/* ------------------------ PRIVATE METHODS -------------------------- */

	/**
	 * @dev Commits a set of new species recordings to the user's life list.
	 *
	 * @dev Reverts if the user does not have enough space in their current
	 * unlocked tier to record all of the new species.
	 */
	function _commitLifeListRecords(
		LifeList storage user,
		uint16[] memory birdIdsToCommit,
		uint16[] memory speciesIdsToCommit,
		uint256 numberOfNewRecords
	) private {

		// Cannot hold more species records than the currently unlocked tier allows
		if (uint256(user.count) + numberOfNewRecords > SPECIES_UNLOCK_TIERS[user.unlockedTier]) {
			revert TierCapacityReached();
		}

		// Update the count histogram used for computing leaderboard ranks

		if (user.count > 0) {
			speciesCountHistogram[user.count] -= 1;
		}

		user.count += uint16(numberOfNewRecords);

		speciesCountHistogram[user.count] += 1;

		// Add the user to the global user list on their first recorded species
		if (!isUserListed[msg.sender]) {
			isUserListed[msg.sender] = true;
			userList.push(msg.sender);
		}

		// Permanently store each new recording and mint a soulbound token for each
		for (uint256 i = 0; i < numberOfNewRecords; i++) {

			uint16 speciesId = speciesIdsToCommit[i];

			// Record the species in the user's life list bitmask
			_markSpeciesRecorded(user, speciesId);

			// Mint a new soulbound ERC-721 token (assigns ownership and emits Transfer)
			uint256 newTokenId = nextTokenId++;

			tokenIdToSpeciesId[newTokenId] = speciesId;

			_safeMint(msg.sender, newTokenId);

			emit SpeciesIdentified(
				msg.sender,
				uint256(speciesId),
				uint256(birdIdsToCommit[i]),
				species[speciesId].name,
				newTokenId
			);

		}

	}

	/**
	 * @dev Returns true if the species ID has already been recorded by the user,
	 * as tracked in the permanent species bitmask of the user's life list.
	 */
	function _isSpeciesRecorded(LifeList storage user, uint16 speciesId) internal view returns (bool) {
		uint256 row = user.speciesBitmap[speciesId / 256];
		return ((row >> (uint256(speciesId) % 256)) & 1) == 1;
	}

	/**
	 * @dev Returns true if the species ID is marked in the provided bitmask
	 * (used to track species handled within a single claim call).
	 */
	function _isSpeciesRecorded(uint256[SPECIES_BITMAP_ROWS] memory bitmap, uint16 speciesId) internal pure returns (bool) {
		uint256 row = bitmap[uint256(speciesId) / 256];
		return ((row >> (uint256(speciesId) % 256)) & 1) == 1;
	}

	/**
	 * @dev Sets the bit for the species ID in the permanent species bitmask
	 * of the user's life list.
	 */
	function _markSpeciesRecorded(LifeList storage user, uint16 speciesId) internal {
		user.speciesBitmap[speciesId / 256] |= (1 << (uint256(speciesId) % 256));
	}

	/**
	 * @dev Sets the bit for the species ID in the provided bitmask
	 * (used to track species handled within a single claim call).
	 */
	function _markSpeciesRecorded(uint256[SPECIES_BITMAP_ROWS] memory bitmap, uint16 speciesId) internal pure {
		bitmap[uint256(speciesId) / 256] |= (1 << (uint256(speciesId) % 256));
	}

	/**
	 * @dev Build the JSON attributes for the token.
	 */
	function _buildAttributesJSON(uint16 speciesId) private view returns (string memory) {

		Species memory speciesToRender = species[speciesId];

		string memory attributes = string(
			abi.encodePacked(
				"[",
				'{"trait_type":"Species Name","value":"',
				speciesToRender.name,
				'"},{"trait_type":"Species ID","value":"',
				Strings.toString(speciesId),
				'"},{"trait_type":"Family","value":"',
				speciesToRender.family,
				'"},{"trait_type":"Flock","value":"',
				publicGetFlockForSpecies(speciesId),
				'"}]'
			)
		);

		return attributes;

	}

	/**
	 * @dev Build the SVG image for a species.
	 */
	function _buildSVG(uint16 speciesId) private view returns (string memory) {

		Species memory speciesToRender = species[speciesId];

		string[16] memory colorsToRender = _parseColorCode(
			speciesToRender.colors1,
			speciesToRender.colors2
		);

		string memory svgContent = "";

		for (uint256 i = 0; i < 256; i++) {

			// Get the position of the current pixel in the 16x16 grid
			uint256 gridX = i % 16;
			uint256 gridY = i / 16;

			// Get the index of the color code for the current pixel

			uint256 byteIndex = i / 2;
			uint256 shiftIndex = i % 2;

			uint256 shift = shiftIndex == 0 ? 4 : 0;

			uint8 colorIdx = uint8((uint8(speciesToRender.pixels[byteIndex]) >> shift) & 0x0f);

			svgContent = string(
				abi.encodePacked(
					svgContent,
					'<rect x="',
					Strings.toString(gridX),
					'" y="',
					Strings.toString(gridY),
					'" width="1" height="1" fill="#',
					colorsToRender[colorIdx],
					'" />'
				)
			);

		}

		return string(abi.encodePacked(
			svgStartString,
			svgContent,
			svgEndString
		));

	}

	/**
	 * @dev Parses the encoded value and converts to the 6 digit hex codes for each color.
	 */
	function _parseColorCode (bytes32 packedColors1, bytes32 packedColors2) private pure returns (string[16] memory) {

		// Build the final 6 hex chars for the color codes
		return [
			_bytes3ToColorString(bytes3(packedColors1)), // First color
			_bytes3ToColorString(bytes3(packedColors1 << 24)), // Second color
			_bytes3ToColorString(bytes3(packedColors1 << 48)), // Third color
			_bytes3ToColorString(bytes3(packedColors1 << 72)), // Fourth color
			_bytes3ToColorString(bytes3(packedColors1 << 96)), // Fifth color
			_bytes3ToColorString(bytes3(packedColors1 << 120)), // Sixth color
			_bytes3ToColorString(bytes3(packedColors1 << 144)), // Seventh color
			_bytes3ToColorString(bytes3(packedColors1 << 168)), // Eighth color
			_bytes3ToColorString(bytes3(packedColors2)), // Ninth color
			_bytes3ToColorString(bytes3(packedColors2 << 24)), // Tenth color
			_bytes3ToColorString(bytes3(packedColors2 << 48)), // Eleventh color
			_bytes3ToColorString(bytes3(packedColors2 << 72)), // Twelfth color
			_bytes3ToColorString(bytes3(packedColors2 << 96)), // Thirteenth color
			_bytes3ToColorString(bytes3(packedColors2 << 120)), // Fourteenth color
			_bytes3ToColorString(bytes3(packedColors2 << 144)), // Fifteenth color
			_bytes3ToColorString(bytes3(packedColors2 << 168)) // Sixteenth color
		];

	}

	function _bytes3ToColorString(bytes3 color) private pure returns (string memory) {

		bytes memory s = new bytes(6);

		for (uint256 i = 0; i < 3; i++) {
			s[i*2] = HEX_SYMBOLS[(uint8(color[i]) >> 4) & 0x0f];
			s[(i*2)+1] = HEX_SYMBOLS[uint8(color[i]) & 0x0f];
		}

		return string(s);

	}

}
