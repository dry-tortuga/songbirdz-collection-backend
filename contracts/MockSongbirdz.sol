// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @dev A mock version of the Songbirdz contract used for testing purposes.
 */
contract MockSongbirdz is ERC721 {

	constructor() ERC721("Mock Songbirdz", "MockBirdz") {}

	function publicMintBird(address to, uint256 birdId) external {
		_mint(to, birdId);
	}

}
