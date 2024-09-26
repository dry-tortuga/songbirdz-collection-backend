// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract SongBirdzLifeList is ERC721, Ownable, ReentrancyGuard {

  // Store token ID -> species ID map in a merkle tree and submit proofs

  bytes32 private constant merkleTreeRoot = 0x4e6f72746865726e2043617264696e616c000000000000000000000000000000;

  // Keep track of the species identified by each user in a map

  mapping(address => mapping (uint16 => bool)) ownerToSpeciesMap;

  // Mint checkmarks as soulbound erc-721 tokens with map from token ID -> species ID

  uint16[] private tokenIdToSpeciesId;

  // Store the image for each species as a 16x16 pixel image (2 bit colors)

  uint8[] private speciesImages = [
    128,
    200
  ];

  bytes32[] private speciesNames = [
    bytes32(0x41636f726e20576f6f647065636b657200000000000000000000000000000000),
    bytes32(0x416c74616d697261204f72696f6c650a00000000000000000000000000000000)
  ];

  constructor(address originalOwner) Ownable(originalOwner) ERC721("SongbirdzLifeList", "SongBirdzLifeList") {}

  /**
   * @dev Mint a new species in your Life List and mark it as identified.
   *
   * @param birdId     The bird token ID.
   * @param speciesId  The species ID.
   * @param mintProof  The merkle proof used to verify the combination of bird and species.
   */
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
   * Gets the species name for the provided species ID.
   *
   * @param speciesId  The species ID.
   */
  function publicGetSpeciesName(uint256 speciesId) public view returns (string memory) {
    return string(abi.encodePacked(speciesNames[speciesId]));
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {

    // Get image
    string memory image = buildSVG(tokenId);

    // Encode SVG data to base64
    string memory base64Image = Base64.encode(bytes(image));

    // Build JSON metadata
    string memory json = string(
        abi.encodePacked(
            '{"name": "Songbirdz Life List #', Strings.toString(tokenId), '",',
            '"description": "Keep track of the Songbirdz on your Life List",',
            '"image": "data:image/svg+xml;base64,', base64Image, '"}'
        )
    );

    // Encode JSON data to base64
    string memory base64Json = Base64.encode(bytes(json));

    // Construct final URI
    return string(abi.encodePacked('data:application/json;base64,', base64Json));

  }

  function buildSVG(uint256 tokenId) public view returns (string memory) {

    require(_ownerOf(tokenId) != address(0), "Token does not exist");

    uint256 speciesId = tokenIdToSpeciesId[tokenId];

    uint256 speciesImage = speciesImages[speciesId];

    uint256 mask = 0x01;

    string memory svgContent = "";

    for (uint256 i = 0; i < 8; i++) {

      for (uint256 j = 0; j < 8; j++) {

        string memory finalColor = "FFF";

        if ((speciesImage & mask) > 0) {
          finalColor = "000";
        }

        svgContent = string(
          abi.encodePacked(
            svgContent,
            '<rect x="',
            Strings.toString(i * 50),
            '" y="',
            Strings.toString(j * 50),
            '" width="50" height="50" fill="#',
            finalColor,
            '" />'
          )
        );

        speciesImage >> 1;

      }

    }

    return string(abi.encodePacked(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">',
      svgContent,
      '</svg>'
    ));

  }

}
