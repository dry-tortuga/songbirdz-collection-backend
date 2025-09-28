// SPDX-License-Identifier: MIT
// Based on original NFTStrategyHook contract by TokenWorks (https://token.works/)

pragma solidity ^0.8.20;
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {SafeCast} from "@uniswap/v4-core/src/libraries/SafeCast.sol";
import {PoolId, PoolIdLibrary} from "@uniswap/v4-core/src/types/PoolId.sol";
import {BalanceDelta} from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {CurrencySettler} from "@uniswap/v4-core/test/utils/CurrencySettler.sol";
import {TickMath} from "@uniswap/v4-core/src/libraries/TickMath.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {StateLibrary} from "@uniswap/v4-core/src/libraries/StateLibrary.sol";
import {SafeTransferLib} from "solady/utils/SafeTransferLib.sol";
import {IBirdStrategy,IValidRouter} from "./Interfaces.sol";
import {ReentrancyGuard} from "solady/utils/ReentrancyGuard.sol";
import {ModifyLiquidityParams, SwapParams} from "@uniswap/v4-core/src/types/PoolOperation.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import "./Interfaces.sol";

/// @title BirdStrategyHook - Uniswap V4 Hook for BirdStrategy
/// @author drytortuga - https://github.com/dry-tortuga
/// Based on the original NFTStrategyHook contract by tokenWorks (https://token.works/)
/// See an example of original NFTStrategyHook contract at https://etherscan.io/address/0xe3C63A9813Ac03BE0e8618B627cb8170cfA468c4#code
contract BirdStrategyHook is BaseHook, ReentrancyGuard {

    using PoolIdLibrary for PoolKey;
    using StateLibrary for IPoolManager;
    using CurrencySettler for Currency;
    using SafeCast for uint256;
    using SafeCast for int128;

    /* ------------------- CONSTANTS ------------------- */

    uint128 private constant TOTAL_BIPS = 10000;
    uint128 private constant DEFAULT_FEE = 1000; // 10%
    uint128 private constant STARTING_BUY_FEE = 9500; // 95%
    uint160 private constant MAX_PRICE_LIMIT = TickMath.MAX_SQRT_PRICE - 1;
    uint160 private constant MIN_PRICE_LIMIT = TickMath.MIN_SQRT_PRICE + 1;

    IPoolManager immutable manager;
    IBirdStrategyController immutable birdStrategyController;

    /* ------------------- STATE VARIABLES ------------------- */

    address public feeAddress;

    uint256 public deployedAt;

    /* ------------------- CUSTOM ERRORS ------------------- */

    error NotBirdStrategyController();
    error NotBirdStrategyControllerOwner();

    error OnlyController();

    /* ------------------- CUSTOM EVENTS ------------------- */

    event HookFee(bytes32 indexed id, address indexed sender, uint128 feeAmount0, uint128 feeAmount1);
    event Trade(uint160 sqrtPriceX96, int128 ethAmount, int128 tokenAmount);

    /* ------------------- CONSTRUCTOR ------------------- */

    /// @notice Constructor initializes the hook with required dependencies
    /// @param _poolManager The Uniswap V4 Pool Manager interface
    /// @param _birdStrategyController The Bird Strategy Controller interface
    /// @param _feeAddress Address to send a portion of the fees
    constructor(
        IPoolManager _poolManager,
        IBirdStrategyController _birdStrategyController,
        address _feeAddress
    ) BaseHook(_poolManager) {
        manager = _poolManager;
        birdStrategyController = _birdStrategyController;
        feeAddress = _feeAddress;
    }

    /* ------------------ CONTROLLER FUNCTIONS (PUBLIC) ---------------- */

    /// @notice Updates the fee address #1 for receiving protocol fees
    /// @param _feeAddress New address to receive fees
    /// @dev Only callable by owner of the controller contract
    function updateFeeAddress(address _feeAddress) external {
        if (msg.sender != birdStrategyController.owner()) revert OnlyController();
        feeAddress = _feeAddress;
    }

    /* ------------------ MECHANISM FUNCTIONS (PUBLIC) ---------------- */

    // TODO: Determine if fancy fee logic is necessary...

    /// @notice Calculates current fee based on deployment block and direction
    /// @return Current fee in basis points
    function calculateFee(bool isBuying) public view returns (uint128) {
        if (!isBuying) return DEFAULT_FEE;
        if (birdStrategyController.deployerBuying()) return 0;

        if (deployedAt == 0) return DEFAULT_FEE;

        uint256 blocksPassed = block.number - deployedAt;
        uint256 feeReductions = (blocksPassed / 5) * 100; // bips to subtract

        uint256 maxReducible = STARTING_BUY_FEE - DEFAULT_FEE; // assumes invariant holds
        if (feeReductions >= maxReducible) return DEFAULT_FEE;

        return uint128(STARTING_BUY_FEE - feeReductions);
    }

    /// @notice Returns the hook's permissions for the Uniswap V4 pool
    /// @return Hooks.Permissions struct indicating which hooks are enabled
    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: true,
            afterInitialize: false,
            beforeAddLiquidity: true,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,
            afterSwap: true,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: true,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    /// @notice Allows the contract to receive additional ETH
    receive() external payable {}

    /* --------------------- INTERNAL FUNCTIONS (PRIVATE) --------------------- */

    /// @notice Process fees directly - distributes immediately
    /// @param feeAmount Amount of ETH fees to distribute
    function _processFees(address _birdStrategyAddress, uint256 feeAmount) internal {
        if (feeAmount == 0) return;

        // Calculate 90% for BirdStrategy, 10% for feeAddress
        uint256 depositAmount = (feeAmount * 90) / 100;
        uint256 feeAddressAmount = feeAmount - depositAmount;

        // Deposit fees into BirdStrategy collection
        IBirdStrategy(_birdStrategyAddress).addFees{value: depositAmount}();

        // Send fees to address #1
        SafeTransferLib.forceSafeTransferETH(feeAddress, feeAddressAmount);
    }

    /// @notice Validates initialization of a new pool
    /// @return Selector indicating successful hook execution
    function _beforeInitialize(address, PoolKey calldata key, uint160)
        internal
        override
        returns (bytes4)
    {
        // Ensure the call is coming from BirdStrategyController
        if (!birdStrategyController.loadingLiquidity()) {
            revert OnlyController();
        }

        // Store the deployment block for the new token pool
        deployedAt = block.number;

        return BaseHook.beforeInitialize.selector;
    }

    /// @notice Validates liquidity addition to a pool
    function _beforeAddLiquidity(address, PoolKey calldata, ModifyLiquidityParams calldata, bytes calldata)
        internal
        view
        override
        returns (bytes4)
    {
        // Ensure the call is coming from BirdStrategyController
        if (!birdStrategyController.loadingLiquidity()) {
            revert OnlyController();
        }
        return BaseHook.beforeAddLiquidity.selector;
    }

    /// @notice Validates swap operations
    /// @param sender The address initiating the call (router)
    /// @param key The pool key containing token pair and fee information
    /// @param params Swap parameters
    /// @param data Additional data passed to the hook
    /// @return Selector indicating successful hook execution, swap delta and dynamic fee
    function _beforeSwap(
        address sender,
        PoolKey calldata key,
        SwapParams calldata params,
        bytes calldata data
    ) internal override returns (bytes4, BeforeSwapDelta, uint24) {
        // Set midSwap flag on BirdStrategy contract
        if (birdStrategyController.routerRestrict()) {
            IBirdStrategy(Currency.unwrap(key.currency1)).setMidSwap(true);
        }
        return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
    }

    /// @notice Processes swap events and takes the swap fee
    /// @param sender The address initiating the call (router)
    /// @param key The pool key containing token pair and fee information
    /// @param params Swap parameters
    /// @param delta Balance changes resulting from the swap
    /// @return Selector indicating successful hook execution and fee amount
    function _afterSwap(
        address sender,
        PoolKey calldata key,
        SwapParams calldata params,
        BalanceDelta delta,
        bytes calldata
    ) internal override returns (bytes4, int128) {
        // Calculate fee based on the swap amount
        bool specifiedTokenIs0 = (params.amountSpecified < 0 == params.zeroForOne);
        (Currency feeCurrency, int128 swapAmount) =
            (specifiedTokenIs0) ? (key.currency1, delta.amount1()) : (key.currency0, delta.amount0());

        if (swapAmount < 0) swapAmount = -swapAmount;

        bool ethFee = Currency.unwrap(feeCurrency) == address(0);
        address birdStrategyAddress = Currency.unwrap(key.currency1);

        uint128 currentFee = calculateFee(params.zeroForOne);
        uint256 feeAmount = uint128(swapAmount) * currentFee / TOTAL_BIPS;

        if (feeAmount == 0) {
            return (BaseHook.afterSwap.selector, 0);
        }

        manager.take(feeCurrency, address(this), feeAmount);

        // Emit the HookFee event, after taking the fee
        emit HookFee(
            PoolId.unwrap(key.toId()),
            sender,
            ethFee ? uint128(feeAmount) : 0,
            ethFee ? 0 : uint128(feeAmount)
        );

        // Handle fee token deposit or conversion
        if (!ethFee) {
            uint256 feeInETH = _swapToEth(key, feeAmount);
            _processFees(birdStrategyAddress, feeInETH);
        } else {
            // Fee amount is in ETH
            _processFees(birdStrategyAddress, feeAmount);
        }

        // Get current price and emit
        emit Trade(_getCurrentPrice(key), delta.amount0(), delta.amount1());

        // Set midSwap to false
        if (birdStrategyController.routerRestrict()) {
            IBirdStrategy(Currency.unwrap(key.currency1)).setMidSwap(false);
        }
        return (BaseHook.afterSwap.selector, feeAmount.toInt128());
    }

    /// @notice Swaps a token to ETH
    /// @param key The pool key for the swap
    /// @param amount The amount of tokens to swap
    /// @return The amount of ETH received from the swap
    function _swapToEth(PoolKey memory key, uint256 amount) internal returns (uint256) {
        uint256 ethBefore = address(this).balance;

        BalanceDelta delta = manager.swap(
            key,
            SwapParams({
                zeroForOne: false,
                amountSpecified: -int256(amount),
                sqrtPriceLimitX96: MAX_PRICE_LIMIT
            }),
            bytes("")
        );

        // Handle token settlements
        if (delta.amount0() < 0) {
            key.currency0.settle(poolManager, address(this), uint256(int256(-delta.amount0())), false);
        } else if (delta.amount0() > 0) {
            key.currency0.take(poolManager, address(this), uint256(int256(delta.amount0())), false);
        }

        if (delta.amount1() < 0) {
            key.currency1.settle(poolManager, address(this), uint256(int256(-delta.amount1())), false);
        } else if (delta.amount1() > 0) {
            key.currency1.take(poolManager, address(this), uint256(int256(delta.amount1())), false);
        }

        return address(this).balance - ethBefore;
    }

    /// @notice Gets the current price of a token pair from the pool
    /// @param key The pool key containing the token pair and pool parameters
    /// @return The current sqrtpriceX96 from slot0
    function _getCurrentPrice(PoolKey calldata key) internal view returns (uint160) {
        (uint160 sqrtPriceX96,,,) = poolManager.getSlot0(key.toId());
        return sqrtPriceX96;
    }

}
