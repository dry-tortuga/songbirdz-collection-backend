// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

// TODO: When you've collected all species in a family (or all 800), you can mint
// an item in the HOF????

// TODO: Make the user pay a small, nominal fee to be able to "own" a life list

// TODO: Mint checkmarks as soulbound erc-721 tokens (MAKE IT SOULBOUND)

interface ISongbirdz {
	function ownerOf(uint256 tokenId) external view returns (address);
}

contract SongBirdzLifeList is ERC721Enumerable, Ownable, ReentrancyGuard {

	// The total number of birds
	uint16 private constant NUMBER_OF_BIRDS = 10000;

	// The total number of species
	uint16 private constant NUMBER_OF_SPECIES = 800;

	uint8 private mask4 = 0x3;
	uint8 private mask16 = 0xf;

	string private svgRectWidthHeightFill = '" width="1" height="1" fill="#';

	// Store an instance of the original Songbirdz contract
	ISongbirdz private songbirdzContract;

	// Mint checkmarks as soulbound erc-721 tokens with map from token ID -> species ID

	// TODO: The x=0 and y=0 outer ring of the grid should be a different color for each flock...
	//       This will let us reduce the for loops from 16x16 to 15x15

	//       Or should we just store the 0 color as the same for each of the flocks?

	struct Species {
		uint8 color1;
		uint8 color2;
		uint8 color3;
		uint8 color4;
		uint8 pixelsIdx; // Store the image for each species as a 16x16 pixel image (4 bit colors)
		uint8 birdCount; // The number of birds in the collection that are this species (ranges from 1-50)
		bool exists; // Flag to indicate if this species has been added
		string name; // The name of the species
	}

	string[4] private colors = [
		"b45309",
		"1c1917",
		"eab308",
		"f5f3ff"
	];

	uint256[4] private pixels = [
		150732414786097918012925780350643604681995739222366989644131638409991028736,
		17345289252808504828330377939953790932640638651206689124458516416,
		37700789428126978039292795412084056903150611574107096543077489693585047552,
		17345289789168474872486969613013828087497212657515620176766523264
	];

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
		uint8 color1,
		uint8 color2,
		uint8 color3,
		uint8 color4,
		uint8 pixelIdx,
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
			color1,
			color2,
			color3,
			color4,
			pixelIdx,
			uint8(birdIds.length), // set the bird count for this species
			true, // set exists=true
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
		require(
			songbirdzContract.ownerOf(birdId) == msg.sender,
			"you are not the owner of this bird"
		);

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

		// Get image
		string memory image = _buildSVG(speciesId);

		// Encode SVG data to base64
		string memory base64Image = Base64.encode(bytes(image));

		// Build JSON metadata
		string memory json = string(
			abi.encodePacked(
				'{"name": "Songbirdz Identification #', Strings.toString(tokenId), '",',
				'"description": "Keep track of the Songbirdz on your Life List",',
				'"image": "data:image/svg+xml;base64,', base64Image, '"}'
			)
		);

		// Encode JSON data to base64
		string memory base64Json = Base64.encode(bytes(json));

		// Construct final URI
		return string(abi.encodePacked('data:application/json;base64,', base64Json));

	}

	/* ------------------------ PRIVATE METHODS -------------------------- */

	function _buildSVG(uint16 speciesId) private view returns (string memory) {

		Species memory speciesToRender = species[speciesId];

		string[4] memory colorsToRender = [
			colors[speciesToRender.color1],
			colors[speciesToRender.color2],
			colors[speciesToRender.color3],
			colors[speciesToRender.color4]
		];

		uint256[2] memory pixelsToRender = [
			pixels[speciesToRender.pixelsIdx],
			pixels[speciesToRender.pixelsIdx + 1]
		];

		string memory svgContent = "";

		for (uint256 i = 0; i < 256; i++) {

			// Get the position of the current pixel in the 16x16 grid
			uint256 gridX = i % 16;
			uint256 gridY = i / 16;

			// Keep track of the index of the color for the current pixel
			uint256 colorIdx = 0;

			uint256 pixelArrayIndex = i / 128;

			colorIdx = pixelsToRender[pixelArrayIndex] & mask4;

			pixelsToRender[pixelArrayIndex] = pixelsToRender[pixelArrayIndex] >> 2;

			svgContent = string(
				abi.encodePacked(
					svgContent,
					'<rect x="',
					Strings.toString(gridX),
					'" y="',
					Strings.toString(gridY),
					svgRectWidthHeightFill,
					colorsToRender[colorIdx],
					'" />'
				)
			);

		}

		return string(abi.encodePacked(
			'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="auto">',
			svgContent,
			'</svg>'
		));

	}

}
