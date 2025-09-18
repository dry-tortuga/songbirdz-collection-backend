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

// TODO: Mint checkmarks as soulbound erc-721 tokens (MAKE IT SOULBOUND)
//
// 300k gas -> ~$.02

interface ISongbirdz {
	function ownerOf(uint256 tokenId) external view returns (address);
}

contract SongBirdzLifeList is ERC721Enumerable, Ownable, ReentrancyGuard {

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

	// Store an instance of the original Songbirdz contract
	ISongbirdz private songbirdzContract;

	// Mint checkmarks as soulbound erc-721 tokens with map from token ID -> species ID

	// TODO: The x=0 and y=0 outer ring of the grid should be a different color for each flock...
	//       This will let us reduce the for loops from 16x16 to 15x15

	//       Or should we just store the 0 color as the same for each of the flocks?

	struct Species {
		bool exists; // Flag to indicate if this species has been added
		uint8 birdCount; // The number of birds in the collection that are this species (ranges from 1-50)
		bytes32 colors; // Store the hex color codes (each color = 3 bytes, 8 colors total)
		bytes pixels; // Store the image for each bird as a 16x16 pixel image (0-8 value for each pixel = 64 bytes)
		string name; // The name of the species
	}

	// There are a total of 800 species in the collection
	mapping(uint16 => Species) private species;

	// There are a total of 10000 birds in the collection
	mapping(uint16 => uint16) private birdIdToSpeciesId;

	// Mapping of owner to species ID to indicate if the owner has identified a bird of that species
	mapping(address => mapping(uint16 => bool)) private ownerToSpeciesMap;

	// Mapping of token ID to species ID for the erc-721 nfts
	mapping(uint256 => uint16) private tokenIdToSpeciesId;

	// Contract constructor
	constructor(address originalOwner, address songbirdzContractAddress) Ownable(originalOwner) ERC721("SongbirdzLifeList", "SongbirdzLifeList") {
		songbirdzContract = ISongbirdz(songbirdzContractAddress);
	}

	/* ------------------------ PUBLIC METHODS -------------------------- */

	/**
	* @dev Withdraws the ETH stored in the contract and sends to the contract owner.
	*
	* @dev NOTE: Only called by the contract owner.
	*/
	function publicWithdraw() external onlyOwner {
		uint256 balance = address(this).balance;
		payable(msg.sender).transfer(balance);
	}

	/**
	 * @dev Store the species data.
	 *
	 * @dev NOTE: Only called by the contract owner.
	 */
	function publicGenerateSpecies(
		uint16 speciesId,
		bytes32 colors,
		bytes memory pixels,
		uint16[] memory birdIds,
		string memory name
	) external onlyOwner {

		// Cannot add duplicate species
		require(
			!species[speciesId].exists,
			"species already exists"
		);

		// Cannot add more than 800 total species
		require(
			speciesId < NUMBER_OF_SPECIES,
			"total species count is 800"
		);

		// Create the new species
		Species memory newSpecies = Species(
			true,
			uint8(birdIds.length), // set the bird count for this species
			colors,
			pixels,
			name
		);

		species[speciesId] = newSpecies;

		// Map the bird IDs (0-9999) to the species ID (0-799)
		for (uint16 i = 0; i < birdIds.length; i++) {
			birdIdToSpeciesId[birdIds[i]] = speciesId;
		}

	}

	/**
	 * @dev Mint a new species in your Life List and mark it as identified.
	 *
	 * @param birdId  The bird ID.
	 */
	function publicMintLifeListRecord(uint16 birdId) external nonReentrant {

		// Check to make sure the bird exists
		require(
			birdId < NUMBER_OF_BIRDS,
			"bird id is invalid"
		);

		// Get the species id for that bird
		uint16 speciesId = birdIdToSpeciesId[birdId];

		// Check to make sure the species has not already been identified by this user
		require(
			!ownerToSpeciesMap[msg.sender][speciesId],
			"must be a new species for user"
		);

		// Check to make sure the msg.sender is the current owner of the bird
		// require(
		//	songbirdzContract.ownerOf(birdId) == msg.sender,
		//	"you are not the owner of this bird"
		// );

		// Store the identification of this species for the user

		ownerToSpeciesMap[msg.sender][speciesId] = true;

		// Keep track of the species ID for the new nft

		uint256 newTokenId = totalSupply();

		tokenIdToSpeciesId[newTokenId] = speciesId;

		// This will assign ownership, and also emit the Transfer event as required per ERC721

		_safeMint(msg.sender, newTokenId);

	}

	/**
	 * Gets the species name for the provided species ID.
	 *
	 * @param speciesId  The species ID.
	 */
	function publicGetSpeciesName(uint16 speciesId) public view returns (string memory) {
		return species[speciesId].name;
	}

	/**
	 * Gets the species count for the provided species ID,
	 *	i.e. the number of birds in the collection that are of that species.
	 *
	 * @param speciesId  The species ID.
	 */
	function publicGetSpeciesBirdCount(uint16 speciesId) public view returns (uint16) {
		return species[speciesId].birdCount;
	}

	/**
	 * Gets the flock name for the provided species ID.
	 *
	 * @param speciesId  The species ID.
	 */
	function publicGetSpeciesFlock(uint16 speciesId) public view returns (string memory) {

		// Ensure the species ID is valid
		require(
			speciesId < NUMBER_OF_SPECIES,
			"species id is invalid"
		);

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
		return species[birdIdToSpeciesId[birdId]].name;
	}

	/**
	 * Builds the token URI for a species record in the user's life list.
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
				'"},{"trait_type":"Species Id","value":"',
				Strings.toString(speciesId),
				'"},{"trait_type":"Species Bird Count","value":"',
				Strings.toString(speciesToRender.birdCount),
				'"},{"trait_type":"Flock","value":"',
				publicGetSpeciesFlock(speciesId),
				'"}]'
			)
		);

		return attributes;

	}

	function _buildSVG(uint16 speciesId) private view returns (string memory) {

		Species memory speciesToRender = species[speciesId];

		string[8] memory colorsToRender = _parseColorCode(speciesToRender.colors);

		string memory svgContent = "";

		for (uint256 i = 0; i < 256; i++) {

			// Get the position of the current pixel in the 16x16 grid
			uint256 gridX = i % 16;
			uint256 gridY = i / 16;

			// Get the index of the color code for the current pixel

			uint256 byteIndex = i / 2;
			uint256 shiftIndex = i % 2;

			uint256 shift = shiftIndex == 0 ? 3 : 0;

			uint8 colorIdx = (uint8(uint8(speciesToRender.pixels[byteIndex]) >> shift) & 0x8);

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
	function _parseColorCode (bytes32 packedColors) private pure returns (string[8] memory) {

		// Build the final 6 hex chars for the color codes
		return [
			_bytes3ToColorString(bytes3(packedColors)), // First color
			_bytes3ToColorString(bytes3(packedColors << 24)), // Second color
			_bytes3ToColorString(bytes3(packedColors << 48)), // Third color
			_bytes3ToColorString(bytes3(packedColors << 72)), // Fourth color
			_bytes3ToColorString(bytes3(packedColors << 96)), // Fifth color
			_bytes3ToColorString(bytes3(packedColors << 120)), // Sixth color
			_bytes3ToColorString(bytes3(packedColors << 144)), // Seventh color
			_bytes3ToColorString(bytes3(packedColors << 168)) // Eighth color
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
