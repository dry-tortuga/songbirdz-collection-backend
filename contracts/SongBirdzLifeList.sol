// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

// TODO: Make the user pay a small, nominal fee to be able to "own" a life list
//       Buy & Burn the bird strategies token

// TODO: Mint as soulbound erc-721 tokens (MAKE IT SOULBOUND)

// 300k gas -> ~$.02

interface ISongbirdz {
	function ownerOf(uint256 tokenId) external view returns (address);
}

contract SongBirdzLifeList is ERC721Enumerable, Ownable, ReentrancyGuard {

	/* -------------------- CONSTANTS --------------- */

	// The total number of birds
	uint16 private constant NUMBER_OF_BIRDS = 10000;

	// The total number of species
	uint16 private constant NUMBER_OF_SPECIES = 800;

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
	uint256 currentSpeciesId = 0;

	// There are a total of 800 species in the collection
	mapping(uint16 => Species) private species;

	// There are a total of 10000 birds in the collection
	mapping(uint16 => uint16) private birdIdToSpeciesId;

	// Mapping of soulbound token ID to species ID for the erc-721 nfts
	mapping(uint256 => uint16) private tokenIdToSpeciesId;

	// Mapping of owner to species ID to mark if the owner has identified a bird of that species
	mapping(address => mapping(uint16 => bool)) private ownerToIdentifiedSpeciesMap;

	/* ---------------------- CUSTOM EVENTS ------------------- */

	event SpeciesIdentified(
		address indexed user,
		uint256 indexed speciesId,
		uint256 birdId,
		string speciesName,
		uint256 newTokenId
	);

	/* ---------------------- CUSTOM ERRORS -------------------- */

	error SpeciesAlreadyExists();
	error SpeciesOutOfOrder();
	error MaxSpeciesReached();

	error InvalidBirdId();
	error SpeciesAlreadyIdentified();
	error NotBirdOwner();

	/* --------------------- CUSTOM STRUCTS --------------- */

	struct Species {
		bool exists; // Flag to indicate if this species has been added
		uint8 birdCount; // The number of birds in the collection that are this species (ranges from 1-50)
		bytes32 colors1; // Store the hex color codes (each color = 3 bytes, first 8 colors)
		bytes32 colors2; // Store the hex color codes (each color = 3 bytes, last 8 colors)
		bytes pixels; // Store the image for each bird as a 16x16 pixel image (0-16 value for each pixel = 128 bytes)
		string name; // The name of the species
		string family; // The family of the species
	}

	/* ----------------------- CONSTRUCTOR ------------------------- */

	// Contract constructor
	constructor(address songbirdzContractAddress) Ownable(msg.sender) ERC721("SongbirdzLifeList", "SongBirdzLifeList") {
		songbirdzContract = ISongbirdz(songbirdzContractAddress);
	}

	/* ------------------------ ADMIN METHODS (PUBLIC) -------------------------- */

	/**
	 * @dev Adds a new species to the collection.
	 *
	 * @dev NOTE: Only called by the contract owner.
	 */
	function publicGenerateSpecies(
		uint16 speciesId,
		bytes32 colors1,
		bytes32 colors2,
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
			true,
			uint8(birdIds.length), // set the bird count for this species
			colors1,
			colors2,
			pixels,
			name,
			family
		);

		species[speciesId] = newSpecies;

		// Map the bird token IDs (0-9999) to the species ID (0-799)
		for (uint16 i = 0; i < birdIds.length; i++) {
			birdIdToSpeciesId[birdIds[i]] = speciesId;
		}

		currentSpeciesId += 1;

	}

	/* -------------------- MECHANISM FUNCTIONS (PUBLIC) ------------------ */

	/**
	 * @dev Mint a new species record in your Life List and mark it as identified.
	 *
	 * @param birdId  The bird ID.
	 */
	function publicMintLifeListRecord(uint16 birdId) external nonReentrant {

		// Check to make sure the bird exists
		if (birdId >= NUMBER_OF_BIRDS) {
			revert InvalidBirdId();
		}

		// Get the species id for that bird
		uint16 speciesId = birdIdToSpeciesId[birdId];

		// Check to make sure the species has not already been identified by this user
		if (ownerToIdentifiedSpeciesMap[msg.sender][speciesId]) {
			revert SpeciesAlreadyIdentified();
		}

		// Check to make sure the msg.sender is the current owner of the bird
		// TODO: Handle birds that haven't been minted yet...
		// if (songbirdzContract.ownerOf(birdId) != msg.sender) {
		//	revert NotBirdOwner();
		// }

		// Permanently store the identification of this species for the user

		ownerToIdentifiedSpeciesMap[msg.sender][speciesId] = true;

		// Keep track of the species ID for the new soulbound erc-721 token

		uint256 newTokenId = totalSupply();

		tokenIdToSpeciesId[newTokenId] = speciesId;

		// This will assign ownership, and also emit the Transfer event as required per ERC721

		_safeMint(msg.sender, newTokenId);

		emit SpeciesIdentified(
			msg.sender,
			uint256(speciesId),
			uint256(birdId),
			species[speciesId].name,
			newTokenId
		);

	}

	/* ----------------------- READ ONLY FUNCTIONS (PUBLIC) --------------------- */

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
	) public pure override(ERC721, IERC721) {
		revert("SongBirdzLifeList: Tokens are non-transferable");
	}

	function safeTransferFrom(
		address from,
		address to,
		uint256 tokenId,
		bytes memory _data
	) public pure override(ERC721, IERC721) {
		revert("SongBirdzLifeList: Tokens are non-transferable");
	}

	function approve(address to, uint256 tokenId) public pure override(ERC721, IERC721) {
		revert("SongBirdzLifeList: Tokens are non-transferable");
	}

	function setApprovalForAll(address operator, bool approved) public pure override(ERC721, IERC721) {
		revert("SongBirdzLifeList: Tokens are non-transferable");
	}

	/* ------------------------ PRIVATE METHODS -------------------------- */

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

			uint8 colorIdx = (uint8(uint8(speciesToRender.pixels[byteIndex]) >> shift) & 0xf);

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
			s[i*2] = HEX_SYMBOLS[(uint8(color[i]) >> 4) & 0xe];
			s[(i*2)+1] = HEX_SYMBOLS[uint8(color[i]) & 0xe];
		}

		return string(s);

	}

}
