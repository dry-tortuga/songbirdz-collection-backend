// SPDX-License-Identifier: MIT
// Based on original NFTStrategy contract by TokenWorks (https://token.works/)
pragma solidity ^0.8.21;

import {ERC20} from "solady/tokens/ERC20.sol";
import {ReentrancyGuard} from "solady/utils/ReentrancyGuard.sol";
import {SafeTransferLib} from "solady/utils/SafeTransferLib.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {IUniswapV4Router04} from "v4-router/interfaces/IUniswapV4Router04.sol";
import "./Interfaces.sol";

/// @title BirdStrategy - An ERC20 token that constantly buys/sells NFTs from a list of collections
/// @author drytortuga - https://github.com/dry-tortuga
/// Based on the original NFTStrategy contract by tokenWorks (https://token.works/)
/// See an example of original NFTStrategy contract at https://etherscan.io/address/0x9ebf91b8d6ff68aa05545301a3d0984eaee54a03#code
contract BirdStrategy is ERC20, ReentrancyGuard {

    /* ------------------ CONSTANTS ------------------ */

    IUniswapV4Router04 private immutable router;
    string tokenName;
    string tokenSymbol;

    /// @notice The Uniswap V4 hook
    address public immutable hookAddress;

    /// @notice The Controller address
    address public immutable controllerAddress;

    /// @notice The Songbirdz NFT collection address
    address public immutable songbirdzAddress;

    uint256 public constant SONGBIRDZ_MINT_PRICE = 0.0015 ether;

    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 1e18;
    address public constant DEADADDRESS = 0x000000000000000000000000000000000000dEaD;

    /* ------------------ STATE VARIABLES ------------------ */

    /// @notice The price multiplier for re-listing an NFT after buying it
    uint256 public priceMultiplier = 1200; // 1.2x

    /// @notice Payout the reward for triggering a burn as X% of the amount burned
    uint256 public rewardAmount = 10; // 1%

    /// @notice Funds used to buy an NFT
    uint256 public currentFees;

    /// @notice Funds used to buy and burn BRDR after selling an NFT
    uint256 public ethToTwap;

    /// @notice twap increment when buying BRDR
    uint256 public twapIncrement = 0.25 ether;

    /// @notice twap delay when buying BRDR
    uint256 public twapDelayInBlocks = 1;

    /// @notice last twap block
    uint256 public lastTwapBlock;

    /// @notice Keeps track of the NFTs for sale by this protocol (tokenId -> price)
    mapping(uint256 => uint256) public nftForSale;

    /* -------------- CUSTOM EVENTS -------------- */

    event NFTBoughtByProtocol(uint256 indexed tokenId, uint256 purchasePrice, uint256 listPrice);
    event NFTSoldByProtocol(uint256 indexed tokenId, uint256 price, address buyer);

    /* -------------- CUSTOM ERRORS -------------- */

    error NFTNotForSale();
    error NFTPriceTooLow();
    error InsufficientContractBalance();
    error InvalidMultiplier();
    error InvalidRewardAmount();
    error NoETHToTwap();
    error TwapDelayNotMet();
    error NotEnoughEth();
    error NotFactory();
    error NotERC721();
    error AlreadyNFTOwner();
    error NeedToBuyNFT();
    error NotNFTOwner();
    error OnlyHook();
    error OnlyController();
    error InvalidCollection();
    error ExternalCallFailed(bytes reason);
    error NotValidSwap();
    error NotValidRouter();
    error ControllerNotSet();
    error HookNotSet();
    error RouterNotSet();
    error SongbirdzNotSet();

    error NotControllerOwner();
    error CollectionAlreadyAdded();
    error CollectionMissing();
    error MaxCollectionsReached();
    error NoCollectionsToBuy();
    error InvalidIndex();

    /* ------------------ CONSTRUCTOR ------------------ */

    /// @notice Initializes the contract with required addresses and permissions
    /// @param _controller Address of the BirdStrategyController contract
    /// @param _hook Address of the BirdStrategyHook contract
    /// @param _router Address of the Uniswap V4 Router contract
    /// @param _songbirdz Address of the Songbirdz NFT contract
    constructor(
    	address _controller,
        address _hook,
        IUniswapV4Router04 _router,
        address _songbirdz,
    ) payable {

        // Validate the parameters passed
        if (_controller == address(0)) revert ControllerNotSet();
        if (_hook == address(0)) revert HookNotSet();
        if (_router == address(0)) revert RouterNotSet();
        if (_songbirdz == address(0)) revert SongbirdzNotSet();

        controllerAddress = _controller;
        router = _router;
        hookAddress = _hook;
        songbirdzAddress = _songbirdz;

        tokenName = "Brdr";
        tokenSymbol = "BRDR";

        _mint(controllerAddress, MAX_SUPPLY);

    }

    /* ----------------- GETTERS (PUBLIC) ------------ */

    /// @notice Returns the name of the token
    /// @return The token name as a string
    function name() public view override returns (string memory)   {
        return tokenName;
    }

    /// @notice Returns the symbol of the token
    /// @return The token symbol as a string
    function symbol() public view override returns (string memory) {
        return tokenSymbol;
    }

    /* --------------------- HOOK FUNCTIONS (PUBLIC) --------------------- */

    /// @notice Allows the hook to deposit trading fees into the contract
    /// @dev Only callable by the hook contract
    /// @dev Fees are added to currentFees balance
    function addFees() external payable nonReentrant {
        if (msg.sender != hookAddress) revert OnlyHook();
        currentFees += msg.value;
    }

    /// @notice Sets midSwap to false
    /// @dev Only callable by the hook contract
    function setMidSwap(bool value) external {
        if (msg.sender != hookAddress) revert OnlyHook();
        midSwap = value;
    }

    /* ------------------ CONTROLLER FUNCTIONS (PUBLIC) ---------------- */

    /// @notice Updates the price multiplier for relisting songbirdz
    /// @param _newMultiplier New multiplier in basis points (1100 = 1.1x, 10000 = 10.0x)
    /// @dev Only callable by owner of controller contract. Must be between 1.1x (1100) and 10.0x (10000)
    function setPriceMultiplier(uint256 _newMultiplier) external {
        if (msg.sender != BirdStrategyController(controllerAddress).owner()) revert OnlyController();
        if (_newMultiplier < 1100 || _newMultiplier > 10000) revert InvalidMultiplier();
        priceMultiplier = _newMultiplier;
    }

    /// @notice Updates the price multiplier for relisting songbirdz
    /// @param _newMultiplier New multiplier in basis points (1100 = 1.1x, 10000 = 10.0x)
    /// @dev Only callable by owner of controller contract. Must be between 0.5% (5) and 5% (50)
    function setRewardAmount(uint256 _newRewardAmount) external {
        if (msg.sender != BirdStrategyController(controllerAddress).owner()) revert OnlyController();
        if (_newRewardAmount < 5 || _newRewardAmount > 50) revert InvalidRewardAmount();
        rewardAmount = _newRewardAmount;
    }

    /// @notice Mints a new NFT from the collection (can be manually triggered by anyone)
    /// @param expectedId The expected token ID of the NFT to be purchased
    /// @param speciesProof The merkle proof for the species
    /// @param speciesName The name of the species
    function mintTargetNFT(
        uint256 expectedId,
        bytes32[] memory speciesProof,
        string memory speciesName
    ) external nonReentrant {

        // Limit to only controller to avoid incorrect guesses...
	    if (msg.sender != BirdStrategyController(controllerAddress).owner()) revert OnlyController();

        IERC721 songbirdzCollection = IERC721(songbirdzAddress);

        // Store both balance and nft amount before calling external
        uint256 ethBalanceBefore = address(this).balance;
        uint256 nftBalanceBefore = songbirdzCollection.balanceOf(address(this));

        // Make sure we are not owner of the expected id
        if (songbirdzCollection.ownerOf(expectedId) == address(this)) {
            revert AlreadyNFTOwner();
        }

        // Ensure mint price is not more than currentFees
        if (SONGBIRDZ_MINT_PRICE > currentFees) {
            revert NotEnoughEth();
        }

        // Call external
        (bool success, bytes memory reason) = songbirdzCollection.publicMint{value: SONGBIRDZ_MINT_PRICE}(expectedId, speciesProof, speciesName);
        if (!success) {
            revert ExternalCallFailed(reason);
        }

        // Ensure we now have one more NFT
        uint256 nftBalanceAfter = songbirdzCollection.balanceOf(address(this));

        if (nftBalanceAfter != nftBalanceBefore + 1) {
            revert NeedToBuyNFT();
        }

        // Ensure we are now owner of expectedId
        if (songbirdzCollection.ownerOf(expectedId) != address(this)) {
            revert NotNFTOwner();
        }

        // Calculate actual cost of the NFT to base new price on
        uint256 cost = ethBalanceBefore - address(this).balance;
        currentFees -= cost;

        // List NFT for sale at priceMultiplier times the cost
        uint256 salePrice = cost * priceMultiplier / 1000;
        nftForSale[expectedId] = salePrice;

        emit NFTBoughtByProtocol(expectedId, cost, salePrice);

    }

    /* ------------------ MECHANISM FUNCTIONS (PUBLIC) ---------------- */

    /// @notice Buys a floor NFT from the collection (can be manually triggered by anyone)
    /// @param value The amount of ETH to spend on the NFT purchase
    /// @param data The calldata to send to the target contract for the NFT purchase
    /// @param expectedId The expected token ID of the NFT to be purchased
    /// @param target The target address for purchasing through
    function buyTargetNFT(
        uint256 value,
        bytes calldata data,
        uint256 expectedId,
        address target
    ) external nonReentrant {

    	// TODO: Implement the bug fixes from tokenworks related to Squiggles

        IERC721 songbirdzCollection = IERC721(songbirdzAddress);

        // Store both balance and nft amount before calling external
        uint256 ethBalanceBefore = address(this).balance;
        uint256 nftBalanceBefore = songbirdzCollection.balanceOf(address(this));

        // Make sure we are not owner of the expected id
        if (songbirdzCollection.ownerOf(expectedId) == address(this)) {
            revert AlreadyNFTOwner();
        }

        // Ensure value is not more than currentFees
        if (value > currentFees) {
            revert NotEnoughEth();
        }

        // Call external
        (bool success, bytes memory reason) = target.call{value: value}(data);
        if (!success) {
            revert ExternalCallFailed(reason);
        }

        // Ensure we now have one more NFT
        uint256 nftBalanceAfter = songbirdzCollection.balanceOf(address(this));

        if (nftBalanceAfter != nftBalanceBefore + 1) {
            revert NeedToBuyNFT();
        }

        // Ensure we are now owner of expectedId
        if (songbirdzCollection.ownerOf(expectedId) != address(this)) {
            revert NotNFTOwner();
        }

        // Calculate actual cost of the NFT to base new price on
        uint256 cost = ethBalanceBefore - address(this).balance;
        currentFees -= cost;

        // List NFT for sale at priceMultiplier times the cost
        uint256 salePrice = cost * priceMultiplier / 1000;
        nftForSale[expectedId] = salePrice;

        emit NFTBoughtByProtocol(expectedId, cost, salePrice);

    }

    /// @notice Sells an NFT owned by the contract for the listed price (can be manually triggered by anyone)
    /// @param tokenId The ID of the NFT to sell
    function sellTargetNFT(uint256 tokenId) external payable nonReentrant {

        // Get sale price
        uint256 salePrice = nftForSale[tokenId];

        // Verify NFT is for sale
        if (salePrice == 0) revert NFTNotForSale();

        // Verify sent ETH matches sale price
        if (msg.value != salePrice) revert NFTPriceTooLow();

        IERC721 songbirdzCollection = IERC721(songbirdzAddress);

        // Verify contract owns the NFT
        if (songbirdzCollection.ownerOf(tokenId) != address(this)) revert NotNFTOwner();

        // Transfer NFT to buyer
        songbirdzCollection.transferFrom(address(this), msg.sender, tokenId);

        // Remove NFT from sale
        delete nftForSale[tokenId];

        // Add sale price to fees
        ethToTwap += salePrice;

        emit NFTSoldByProtocol(tokenId, salePrice, msg.sender);

    }

    /// @notice Process the buy and burn of BIRDER tokens once every twapDelayInBlocks (can be manually triggered by anyone)
    /// @notice Eth amount to TWAP is twapIncrement, if we have less than that use the remaining amount
    /// @notice Payout reward to the caller at the end, we also need to subtract this from burnAmount
    function processTokenTwap() external nonReentrant {

        if (ethToTwap == 0) revert NoETHToTwap();

        // Check if enough blocks have passed since last TWAP
        if (block.number < lastTwapBlock + twapDelayInBlocks) revert TwapDelayNotMet();

        // Calculate amount to burn - either twapIncrement or remaining ethToTwap
        uint256 burnAmount = twapIncrement;
        if (ethToTwap < twapIncrement) {
            burnAmount = ethToTwap;
        }

        // Payout the reward as X% of burnAmount
        uint256 reward = (burnAmount * rewardAmount) / 1000;
        burnAmount -= reward;

        // Update state
        ethToTwap -= burnAmount + reward;
        lastTwapBlock = block.number;

        // Buy and burn the tokens
        _buyAndBurnTokens(burnAmount);

        // Send reward to caller
        SafeTransferLib.forceSafeTransferETH(msg.sender, reward);

    }

    /// @notice Allows anyone to buy and burn BRDR tokens with ETH
    /// @dev Burns tokens by sending them to the dead address
    function buyAndBurnTokens() external payable nonReentrant {
        if (msg.value == 0) revert NotEnoughEth();

        _buyAndBurnTokens(msg.value);
    }

    /// @notice Allows the contract to receive additional ETH for twap
    receive() external payable {}

    /* --------------------- INTERNAL FUNCTIONS ----------------- */

    /// @notice Buys BRDR tokens with ETH and burns them by sending to dead address
    /// @param amountIn The amount of ETH to spend on tokens that will be burned
    function _buyAndBurnTokens(uint256 amountIn) internal {

        PoolKey memory key = PoolKey(
            Currency.wrap(address(0)),
            Currency.wrap(address(this)),
            0,
            60,
            IHooks(hookAddress)
        );

        router.swapExactTokensForTokens{value: amountIn}(
            amountIn,
            0,
            true,
            key,
            "",
            DEADADDRESS,
            block.timestamp
        );

    }

    /// @notice Checks if a transfer is allowed based on swapping through the hook
    /// @param from The address sending tokens
    /// @param to The address receiving tokens
    /// @dev Reverts if transfer isn't through the hook
    function _afterTokenTransfer(address from, address to, uint256) internal view override {
        // Allow transfer if router restrictions are disabled or we're mid-swap
        if (!IBirdStrategyController(controllerAddress).routerRestrict() || midSwap) return;

        // Check if transfer is valid based on router restrictions
        // Reverts with NotValidRouter if transfer is between unauthorized addresses
        if (!IBirdStrategyController(controllerAddress).validTransfer(from, to)) {
            revert NotValidRouter();
        }
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external view returns (bytes4) {

   	    if (msg.sender != songbirdzAddress) {
            revert InvalidCollection();
        }

        return this.onERC721Received.selector;
    }

}
