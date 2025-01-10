// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract SongBirdzLifeList is ERC721, Ownable, ReentrancyGuard {

  uint256 private mask4 = 0x3;
  uint256 private mask16 = 0xf;

  string private svgRectWidthHeightFill = '" width="1" height="1" fill="#';

  // Store token ID -> species ID map in a merkle tree and submit proofs

  // bytes32 private constant merkleTreeRoot = 0x4e6f72746865726e2043617264696e616c000000000000000000000000000000;

  // Keep track of the species identified by each user in a map

  // mapping(address => mapping (uint16 => bool)) ownerToSpeciesMap;

  // Mint checkmarks as soulbound erc-721 tokens with map from token ID -> species ID

  // uint16[] private tokenIdToSpeciesId;

  // TODO: The x=0 and y=0 outer ring of the grid should be a different color for each flock...
  //       This will let us reduce the for loops from 16x16 to 15x15
  //       Or should we just store the 0 color as the same for each of the flocks?

  // Store the image for each species as a 16x16 pixel image (4 bit colors)

  struct Species {
    uint8 color1;
    uint8 color2;
    uint8 color3;
    uint8 color4;
    uint8 pixelsIdx;
    string name;
  }

 // string[4] private colors = [
  //  "b45309",
   // "1c1917",
   // "eab308",
  //  "f5f3ff"
 //  ];

 string[100] private colors = [
    "b45309",
   "1c1917",
   "eab308",
    "f5f3ff",
    "034c04",
    "034c04",
    "9e2846",
    "b13059",
    "bc6ec7",
    "bc6ec7",
    "b45309",
   "1c1917",
   "eab308",
    "f5f3ff"
    "034c04",
    "034c04",
    "9e2846",
    "b13059",
    "bc6ec7",
    "bc6ec7",
    "b45309",
   "1c1917",
   "eab308",
    "f5f3ff"
    "034c04",
    "034c04",
    "9e2846",
    "b13059",
    "bc6ec7",
    "bc6ec7",
    "b45309",
   "1c1917",
   "eab308",
    "f5f3ff"
    "034c04",
    "034c04",
    "9e2846",
    "b13059",
    "bc6ec7",
    "bc6ec7",
    "b45309",
   "1c1917",
   "eab308",
    "f5f3ff"
    "034c04",
    "034c04",
    "9e2846",
    "b13059",
    "bc6ec7",
    "bc6ec7",
    "b45309",
   "1c1917",
   "eab308",
    "f5f3ff"
    "034c04",
    "034c04",
    "9e2846",
    "b13059",
    "bc6ec7",
    "bc6ec7",
    "b45309",
   "1c1917",
   "eab308",
    "f5f3ff"
    "034c04",
    "034c04",
    "9e2846",
    "b13059",
    "bc6ec7",
    "bc6ec7",
    "b45309",
   "1c1917",
   "eab308",
    "f5f3ff"
    "034c04",
    "034c04",
    "9e2846",
    "b13059",
    "bc6ec7",
    "bc6ec7",
    "b45309",
   "1c1917",
   "eab308",
    "f5f3ff"
    "034c04",
    "034c04",
    "9e2846",
    "b13059",
    "bc6ec7",
    "bc6ec7",
    "b45309",
   "1c1917",
   "eab308",
    "f5f3ff"
    "034c04",
    "034c04",
    "9e2846",
    "b13059",
    "bc6ec7",
    "bc6ec7"
  ];


  // uint256[4] private pixels = [
   // 150732414786097918012925780350643604681995739222366989644131638409991028736,
  //  17345289252808504828330377939953790932640638651206689124458516416,
  //  37700789428126978039292795412084056903150611574107096543077489693585047552,
   // 17345289789168474872486969613013828087497212657515620176766523264
 //  ];
 //
 uint256[200] private pixels = [
   150732414786097918012925780350643604681995739222366989644131638409991028736,
   17345289252808504828330377939953790932640638651206689124458516416,
   37700789428126978039292795412084056903150611574107096543077489693585047552,
  17345289789168474872486969613013828087497212657515620176766523264,
  150732414786097918012925780350643604681995739222366989644131638409991028736,
  17345289252808504828330377939953790932640638651206689124458516416,
  37700789428126978039292795412084056903150611574107096543077489693585047552,
 17345289789168474872486969613013828087497212657515620176766523264,
 150732414786097918012925780350643604681995739222366989644131638409991028736,
 17345289252808504828330377939953790932640638651206689124458516416,
 150732414786097918012925780350643604681995739222366989644131638409991028736,
 17345289252808504828330377939953790932640638651206689124458516416,
 37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416,
37700789428126978039292795412084056903150611574107096543077489693585047552,
17345289789168474872486969613013828087497212657515620176766523264,
150732414786097918012925780350643604681995739222366989644131638409991028736,
17345289252808504828330377939953790932640638651206689124458516416
  ];

  mapping(uint16 => Species) private species;

  constructor(address originalOwner) Ownable(originalOwner) ERC721("SongbirdzLifeList", "SongbirdzLifeList") {}

  /**
   * @dev Mint a new species in your Life List and mark it as identified.
   *
   * @param birdId     The bird token ID.
   * @param speciesId  The species ID.
   * @param mintProof  The merkle proof used to verify the combination of bird and species.
   */
   /*
  function publicMint(uint16 birdId, uint16 speciesId, bytes32[] memory mintProof) external nonReentrant {

    require(!ownerToSpeciesMap[msg.sender][speciesId], "must be a new species for sender");

    // Get the hash value for the bird ID
    bytes32 leafType = keccak256(bytes(abi.encodePacked(birdId)));

    // Get the hash value for the species ID
    bytes32 leafHash = keccak256(bytes(abi.encodePacked(speciesId)));

    // Generate the hash value for the leaf related to the combination
    bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(leafHash, leafType))));

    // Validate the species ID for the bird via the leaf hash value and proof provided
    bool isCorrect = MerkleProof.verify(mintProof, merkleTreeRoot, leaf);

    require(isCorrect, "must submit a valid merkle proof");

    // Store the type of species for the new token ID

    tokenIdToSpeciesId.push(speciesId);

    // Store the identification of this species for the user

    ownerToSpeciesMap[msg.sender][speciesId] = true;

    // This will assign ownership, and also emit the
    // Transfer event as required per ERC721
    _safeMint(msg.sender, tokenIdToSpeciesId.length - 1);

  }
  */

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
  function publicGenerateSpecies(uint16 speciesId, uint8 color1, uint8 color2, uint8 color3, uint8 color4, uint8 pixelIdx, string memory name) external onlyOwner {

    Species memory newSpecies = Species(
      color1,
      color2,
      color3,
      color4,
      pixelIdx,
      name
    );

    species[speciesId] = newSpecies;

  }

  /**
   * Gets the species name for the provided species ID.
   *
   * @param speciesId  The species ID.
   */
  function publicGetSpeciesName(uint16 speciesId) public view returns (string memory) {
      return species[speciesId].name;
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {

    // require(_ownerOf(tokenId) != address(0), "Token does not exist");

    // Get the species ID associated with the bird ID
    uint16 speciesId = uint16(tokenId);

    // uint256 speciesId = tokenIdToSpeciesId[tokenId];

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

  // PRIVATE METHODS

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
