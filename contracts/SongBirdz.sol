// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract SongBirdz is ERC721Enumerable, Ownable, ReentrancyGuard {

  // Hardcode the mint price
  uint256 private constant MINT_PRICE = 0.0015 ether;

  // Hardcode the refunded amount for incorrect guesses
  uint256 private constant REFUND_AMOUNT = 0.00125 ether;

  // 0-65535, Maximum number of birds that can EVER be minted
  uint256 private constant MINT_TOTAL_SIZE = 10000;

  // 0-65535, The number of birds that is minted in each collection
  uint256 private constant COLLECTION_BIRD_SIZE = 1000;

  // True, if the base URI for the off-chain metadata is frozen to its final value
  bool private _baseURIMetadataIsFrozen = false;

  // The base URI for the off-chain metadata
  string private _baseURIMetadata = "";

  // Array to keep track of all the collections,
  // i.e. a merkle tree root hash for all bird data in each collection 
  bytes32[] public collections;

  // Keeps track of a correct/incorrect species identification for a bird
  event BirdIdentification(
    uint256 indexed birdId,
    address user,
    string speciesName
  );

  /**
   * @dev Throws if the bird ID to mint is invalid.
   *
   * @param birdId  The ID of the bird to mint.
   */
  modifier isMintIdValid(uint256 birdId) {

    require(
      collections.length > 0,
      "no birds yet to mint"
    );

    require(
      birdId < (collections.length * COLLECTION_BIRD_SIZE),
      "invalid bird ID"
    );

    require(
      _ownerOf(birdId) == address(0),
      "the bird is already owned"
    );

    _;

  }

  /**
   * @dev Throws if minting price does not match the amount sent.
   */
  modifier isMintPriceValid() {

    require(
      MINT_PRICE == msg.value,
      "incorrect ETH value sent"
    );

    _;

  }

  constructor(address originalOwner) payable Ownable(originalOwner) ERC721("Songbirdz", "SongBirdz") {}

  /**
   * @dev Returns the base URI for each token, which is used to link a bird ID
   *      to the URL of the associated, offchain metadata.
   */
  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURIMetadata;
  }

  /**
   * @dev Retrieves the base token URI for the contract.
   */
  function publicGetBaseURI() external view returns (string memory) {
    return _baseURIMetadata;
  }

  /**
   * @dev Updates the base token URI for the contract,
   *      with an option to permanently freeze the value.
   *
   * @dev NOTE: Only called by the contract owner.
   *
   * @param uri          The base token URI.
   * @param isUriFrozen  True, if permanently freezing the base token URI.
   */
  function publicSetBaseURI(string memory uri, bool isUriFrozen) external onlyOwner {

    // Check to make sure the base token URI is not already frozen
    require(
      !_baseURIMetadataIsFrozen,
      "the base uri cannot be changed"
    );

    // Update the URI
    _baseURIMetadata = uri;

    // Check if the URI is now permanently frozen
    if (isUriFrozen) {
      _baseURIMetadataIsFrozen = true;
    }

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
   * @dev Generates the list of birds in a specific collection,
   *      and stores the valid hash values for the
   *      species name, audio file, and image file via a merkle tree.
   *
   * @dev NOTE: Only called by the contract owner.
   * @dev NOTE: Each collection must have 1000 birds.
   * @dev NOTE: There will only be 10 collections in total.
   *
   * @param collectionId    The specific collection number.
   * @param merkleTreeRoot  The merkle tree root hash value for the collection.
   */
  function publicGenerateBirds(uint256 collectionId, bytes32 merkleTreeRoot) external onlyOwner {

    // Cannot skip collections
    require(
      collectionId == collections.length,
      "collection id is invalid"
    );

    // Cannot create more than 10000 birds in total
    require(
      (collectionId * COLLECTION_BIRD_SIZE) < MINT_TOTAL_SIZE,
      "total limit is 10000"
    );

    // Store the merkle tree root for the collection
    collections.push(merkleTreeRoot);

  }

  /**
   * @dev Mints a bird and assigns ownership to the sending user.
   *
   * @dev NOTE: The sending user must provide a merkle tree proof of the correct hash value
   *            for the species name that matches the bird ID.
   *
   * @param birdId        The ID of the bird to mint.
   * @param speciesProof  The merkle tree proof for the species guess.
   * @param speciesName   The species name (as plain text).
   * 
   * Emits a {BirdIdentification} event.
   */
  function publicMint(
    uint256 birdId,
    bytes32[] memory speciesProof,
    string memory speciesName
  )
    external
    payable
    nonReentrant
    isMintPriceValid()
    isMintIdValid(birdId)
  {

    // Get the ID of the collection containing the bird
    uint256 collectionId = birdId / COLLECTION_BIRD_SIZE;

    // Get the merkle tree root hash value for the collection
    bytes32 collectionRoot = collections[collectionId];

    // Get the hash value for the species name
    bytes32 speciesLeafGuess = keccak256(bytes(speciesName));

    // Get the leaf type
    string memory speciesLeafType = string.concat(Strings.toString(birdId), "-species");

    // Generate the hash value for the leaf related to the species guess
    bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(speciesLeafGuess, speciesLeafType))));

    // Validate the species guess via the leaf hash value and proof provided
    bool isCorrect = MerkleProof.verify(speciesProof, collectionRoot, leaf);

    // Log the species identification attempt
    emit BirdIdentification(birdId, msg.sender, speciesName);

    // If the proof is valid, then the bird can be minted
    if (isCorrect) {

      // This will assign ownership, and also emit the
      // Transfer event as required per ERC721
      _safeMint(msg.sender, birdId);

    // If the proof is invalid, refund a portion of the mint fee
    } else {

      payable(msg.sender).transfer(REFUND_AMOUNT);

    }

  }

  /**
   * @dev Returns the total number of birds in existence.
   */
  function publicGetNumBirds() external view returns (uint256) {
    return collections.length * COLLECTION_BIRD_SIZE;
  }

}
