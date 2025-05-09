// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SongBirdzHOF is ERC721, Ownable {

	string private svgStartString = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="auto">';
	string private svgEndString = '</svg>';

	// Keep track of the hex symbols
	bytes private constant HEX_SYMBOLS = "0123456789abcdef";

	// Store the image for each bird as a 16x16 pixel image (8 bit colors)

	struct Trophy {
		uint8 place; // 1, 2, 3, etc.
		uint32 points; // 700, 1840, 2400, etc.
		bytes32 colors; // Store the hex color codes (each color = 3 bytes, max 10 colors)
		bytes pixels; // Store the image for each bird as a 16x16 pixel image (4 bit colors)
		string season; // Big Onchain Summer 2024, Big Onchain Fall 2024, etc.
		string species; // Brandt, Bald Eagle, etc.
	}

	Trophy[] private trophies;

	constructor(address originalOwner) Ownable(originalOwner) ERC721("SongbirdzHOF", "SongbirdzHOF") {}

	/*--------------------- PUBLIC METHODS ------------------------*/

	/**
	* @dev Store the entry data for a trophy.
	*
	* @dev NOTE: Only called by the contract owner.
	*/
	function publicGenerateTrophy(
		address to,
		uint8 place,
		uint32 points,
		bytes32 colors,
		bytes memory pixels,
		string memory season,
		string memory species
	) external onlyOwner {

		// console.log("Colors %s", string(colors));
		console.log("Place %s", place);
		console.log("Points %s", points);
		console.log("Season %s", season);
		console.log("Species %s", species);

		Trophy memory newTrophy = Trophy(
			place,
			points,
			colors,
			pixels,
			season,
			species
		);

		trophies.push(newTrophy);

		// This will assign ownership and emit the Transfer event as required per ERC721
		_safeMint(to, trophies.length - 1);

	}

	function tokenURI(uint256 tokenId) public view override returns (string memory) {

		_requireOwned(tokenId);

		// Get JSON attributes
		string memory attributes = _buildAttributesJSON(tokenId);

		// Log attributes in solidity console
		console.log("Attributes: %s", attributes);

		// Get image
		string memory image = _buildSVG(tokenId);

		console.log("Image: %s", image);

		// Encode SVG data to base64
		string memory base64Image = Base64.encode(bytes(image));

		// Build JSON metadata
		string memory json = string(
			abi.encodePacked(
				'{"name": "Songbirdz Hall of Fame #', Strings.toString(tokenId), '",',
				'"description": "This collection honors the best onchain birders from past Songbirdz seasons. Pixel art by xPoli. Code by drytortuga.",',
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

	/*--------------------- PRIVATE METHODS ------------------------*/

	/**
	 * @dev Build the JSON attributes for the token.
	 */
	function _buildAttributesJSON(uint256 tokenId) private view returns (string memory) {

		Trophy memory trophyToRender = trophies[tokenId];

		string memory attributes = string(
			abi.encodePacked(
				"[",
				'{"trait_type":"Season","value":"',
				trophyToRender.season,
				'"},{"trait_type":"Place","value":"',
				Strings.toString(trophyToRender.place),
				'"},{"trait_type":"Points","value":"',
				Strings.toString(trophyToRender.points),
				'"},{"trait_type":"Species","value":"',
				trophyToRender.species,
				'"}]'
			)
		);

		return attributes;

	}

	/**
	 * @dev Build the SVG image for the token.
	 */
	function _buildSVG(uint256 tokenId) private view returns (string memory) {

		Trophy memory trophyToRender = trophies[tokenId];

		string[4] memory colorsToRender = _parseColorCode(trophyToRender.colors);

		console.log("colorsToRender[0]=%s", colorsToRender[0]);
		console.log("colorsToRender[1]=%s", colorsToRender[1]);
		console.log("colorsToRender[2]=%s", colorsToRender[2]);
		console.log("colorsToRender[3]=%s", colorsToRender[3]);

		string memory svgContent = "";

		for (uint256 i = 0; i < 256; i++) {

			// Get the position of the current pixel in the 16x16 grid
			uint256 gridX = i % 16;
			uint256 gridY = i / 16;

			// Get the index of the color code for the current pixel

			uint256 byteIndex = i / 4;
			uint256 shiftIndex = i % 4;

			uint256 shift =
				shiftIndex == 0 ? 6 : (
					shiftIndex == 1 ? 4 : (
						shiftIndex == 2 ? 2 : 0
					)
				);

			uint8 colorIdx = (uint8(uint8(trophyToRender.pixels[byteIndex]) >> shift) & 0x3);

			console.log("%d", colorIdx);

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
	function _parseColorCode (bytes32 packedColors) private pure returns (string[4] memory) {

		console.log("PARSING COLOR CODE");
		console.logBytes32(packedColors);

		// Build the final 6 hex chars for the color codes
		return [
			_bytes3ToColorString(bytes3(packedColors)), // First color
			_bytes3ToColorString(bytes3(packedColors << 24)), // Second color
			_bytes3ToColorString(bytes3(packedColors << 48)), // Third color
			_bytes3ToColorString(bytes3(packedColors << 72)) // Fourth color
		];

	}

	function _bytes3ToColorString(bytes3 color) private pure returns (string memory) {

		bytes memory s = new bytes(6);

		for (uint256 i = 0; i < 3; i++) {
			s[i*2] = HEX_SYMBOLS[uint8(color[i]) >> 4];
			s[(i*2)+1] = HEX_SYMBOLS[uint8(color[i]) & 0x0f];
		}

		return string(s);

	}

}
