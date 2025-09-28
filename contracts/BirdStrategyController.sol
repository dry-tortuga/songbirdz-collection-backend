// SPDX-License-Identifier: MIT
// Based on original NFTStrategyFactory contract by TokenWorks (https://token.works/)
pragma solidity ^0.8.21;

import {Ownable} from "solady/auth/Ownable.sol";
import {BirdStrategy} from "./BirdStrategy.sol";
import {SafeTransferLib} from "solady/utils/SafeTransferLib.sol";
import {IPositionManager} from "@uniswap/v4-periphery/src/interfaces/IPositionManager.sol";
import {IAllowanceTransfer} from "permit2/src/interfaces/IAllowanceTransfer.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {Actions} from "@uniswap/v4-periphery/src/libraries/Actions.sol";
import {TickMath} from "@uniswap/v4-core/src/libraries/TickMath.sol";
import {IUniswapV4Router04} from "v4-router/interfaces/IUniswapV4Router04.sol";
import "./Interfaces.sol";
import {ReentrancyGuard} from "solady/utils/ReentrancyGuard.sol";

/// @title BirdStrategyController - Controls the Uniswap v4 pool and hooks for the BRDR token
/// @author drytortuga - https://github.com/dry-tortuga
/// Based on the original NFTStrategyFactory contract by tokenWorks (https://token.works/)
/// See an example of original NFTStrategyFactory contract at https://etherscan.io/address/0xA1a196b5BE89Be04a2c1dc71643689CE013c22e5#code

contract BirdStrategyController is Ownable, ReentrancyGuard {

	/* ------------------------- CONSTANTS ------------------------- */

    uint256 private constant ethToPair = 2 wei;
    uint256 private constant initialBuy = 0.125 ether;
    uint256 private constant initialStrategySeed = 0.05 ether;
    IPositionManager private immutable posm;
    IAllowanceTransfer private immutable permit2;
    IUniswapV4Router04 private immutable router;
    address private immutable poolManager;

    address public constant DEADADDRESS = 0x000000000000000000000000000000000000dEaD;

    /* ------------------------- STATE VARIABLES ------------------------- */

    /// @notice The Uniswap V4 hook
    address public hookAddress;

    /// @notice The BirdStrategy address
    address public birdStrategyAddress;

    /// @notice Gate the BirdStrategyHook to only when we're loading the new token
    bool public loadingLiquidity;

    /// @notice Skips buy fee for the deployer of the token
    bool public deployerBuying;

    /// @notice whether swaps are restricted through routers
    bool public routerRestrict;

    /// @notice list of valid routers
    mapping(address => bool) public listOfRouters;

    /* ----------------------- CUSTOM ERRORS ----------------------- */

    error HookNotSet();
    error StrategyAlreadyLaunched();
    error WrongEthAmount();

    /* -------------------- CONSTRUCTOR -------------------- */

    constructor(
        address _posm,
        address _permit2,
        address _poolManager,
        address _universalRouter,
        address payable _router
    ) {
        router = IUniswapV4Router04(_router);
        posm = IPositionManager(_posm);
        permit2 = IAllowanceTransfer(_permit2);
        poolManager = _poolManager;

        listOfRouters[address(this)] = true;
        listOfRouters[_posm] = true;
        listOfRouters[_permit2] = true;
        listOfRouters[_router] = true;
        listOfRouters[_universalRouter] = true;
        listOfRouters[DEADADDRESS] = true;

        routerRestrict = true;

        _initializeOwner(msg.sender);
    }

    /* --------------------- ADMIN FUNCTIONS (PUBLIC) --------------------- */

    /// @notice Set whether a router address is approved for use
    /// @param _router Router address to toggle
    /// @param status True to approve router, false to remove approval
    /// @dev Only callable by owner
    function setRouter(address _router, bool status) external onlyOwner {
        listOfRouters[_router] = status;
    }

    /// @notice Sets whether to enforce router restrictions
    /// @param status True to enable router restrictions, false to disable
    /// @dev Only callable by owner
    function setRouterRestrict(bool status) external onlyOwner {
        routerRestrict = status;
    }

    /// @notice Sets the hook attached to the BirdStrategy pool (one-time call on initialization)
    /// @param _hook The Uniswap v4 hook address
    /// @dev Only callable by owner
    function setHookAddress(address _hook) external onlyOwner {
        require(_hookAddress != address(0), "Invalid address");
        require(hookAddress == address(0), "Hook address already set");
        hookAddress = _hookAddress;
        listOfRouters[hookAddress] = true;
    }

    /// @notice Launches the BirdStrategy contract for the songbirdz collection with owner permissions
    /// @dev Only callable by contract owner. Deploys new strategy protocol and initializes liquidity
    function launchBirdStrategy() external payable nonReentrant onlyOwner returns (BirdStrategy) {

        // Validate the parameters passed
        if (hookAddress == address(0)) revert HookNotSet();
        if (birdStrategyAddress != address(0)) revert StrategyAlreadyLaunched();
        if (msg.value < (ethToPair + initialBuy + initialStrategySeed)) revert WrongEthAmount();

        BirdStrategy birdStrategy = new BirdStrategy(
            address(this),
            hookAddress,
            router
        );

        birdStrategyAddress = address(birdStrategy);

        // Costs 2 wei
        _loadLiquidity(birdStrategyAddress);

        // Buy 0.1e and send to deployer, i.e. get 1% of the token
        _buyDeployerTokens(initialBuy, strategyAddress, msg.sender);

        // Send remaining value to seed birdStrategy for some initial buys
        uint256 ethToSend = msg.value - ethToPair - initialBuy;
        SafeTransferLib.forceSafeTransferETH(birdStrategyAddress, ethToSend);

        return birdStrategy;
    }

    /* ----------------------- MECHANISM FUNCTIONS (PUBLIC) ----------------------- */

    function validTransfer(address from, address to) external view returns (bool) {
        if (!routerRestrict) return true;

        bool userToUser = !listOfRouters[from] && !listOfRouters[to];
        if (userToUser && (from != birdStrategyAddress && to != birdStrategyAddress)) {
            // Always allow transfers from poolManager
            if (from == address(poolManager)) return true;

            // Only allow transfers to poolManager during midSwap or loadingLiquidity
            if (to == address(poolManager)) {
                return IBirdStrategy(birdStrategyAddress).midSwap() || loadingLiquidity;
            }
            return false;
        }
        return true;
    }

    /* --------------------- INTERNAL FUNCTIONS (PRIVATE) --------------------- */

    /// @notice Internal function to load liquidity into the Uniswap V4 pool
    /// @param _strategyAddress Address of the BirdStrategy ERC20
    function _loadLiquidity(address _strategyAddress) internal {
        loadingLiquidity = true;

        // Create the pool with ETH (currency0) and TOKEN (currency1)
        Currency currency0 = Currency.wrap(address(0)); // ETH
        Currency currency1 = Currency.wrap(_strategyAddress); // BRDR

        uint24 lpFee = 0;
        int24 tickSpacing = 60;

        uint256 token0Amount = 1; // 1 wei
        uint256 token1Amount = 1_000_000_000 * 10**18; // 1B TOKEN

        // 10e18 ETH = 1_000_000_000e18 TOKEN
        uint160 startingPrice = 501082896750095888663770159906816;

        int24 tickLower = TickMath.minUsableTick(tickSpacing);
        int24 tickUpper = int24(175020);

        PoolKey memory key = PoolKey(currency0, currency1, lpFee, tickSpacing, IHooks(hookAddress));
        bytes memory hookData = new bytes(0);

        // Hardcoded from LiquidityAmounts.getLiquidityForAmounts
        uint128 liquidity = 158372218983990412488087;

        uint256 amount0Max = token0Amount + 1 wei;
        uint256 amount1Max = token1Amount + 1 wei;

        (bytes memory actions, bytes[] memory mintParams) =
            _mintLiquidityParams(key, tickLower, tickUpper, liquidity, amount0Max, amount1Max, address(this), hookData);

        bytes[] memory params = new bytes[](2);

        params[0] = abi.encodeWithSelector(posm.initializePool.selector, key, startingPrice, hookData);

        params[1] = abi.encodeWithSelector(
            posm.modifyLiquidities.selector, abi.encode(actions, mintParams), block.timestamp + 60
        );

        uint256 valueToPass = amount0Max;
        permit2.approve(_strategyAddress, address(posm), type(uint160).max, type(uint48).max);

        posm.multicall{value: valueToPass}(params);

        loadingLiquidity = false;
    }

    /// @notice Creates parameters for minting liquidity in Uniswap V4
    function _mintLiquidityParams(
        PoolKey memory poolKey,
        int24 _tickLower,
        int24 _tickUpper,
        uint256 liquidity,
        uint256 amount0Max,
        uint256 amount1Max,
        address recipient,
        bytes memory hookData
    ) internal pure returns (bytes memory, bytes[] memory) {
        bytes memory actions = abi.encodePacked(uint8(Actions.MINT_POSITION), uint8(Actions.SETTLE_PAIR));

        bytes[] memory params = new bytes[](2);
        params[0] = abi.encode(poolKey, _tickLower, _tickUpper, liquidity, amount0Max, amount1Max, recipient, hookData);
        params[1] = abi.encode(poolKey.currency0, poolKey.currency1);
        return (actions, params);
    }

    /// @notice Buys tokens with ETH and sends to deployer
    /// @param amountIn The amount of ETH to spend
    function _buyDeployerTokens(uint256 amountIn, address _strategyAddress, address caller) internal {
        deployerBuying = true;

        PoolKey memory key = PoolKey(
            Currency.wrap(address(0)),
            Currency.wrap(_strategyAddress),
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
            caller,
            block.timestamp
        );

        deployerBuying = false;
    }

}
