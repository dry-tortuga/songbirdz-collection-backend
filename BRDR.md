# BRDR Token

BRDR is an ERC-20 token that implements an automated NFT trading strategy, constantly buying and selling NFTs from the Songbirdz collection. The protocol generates revenue through NFT trading and uses those proceeds to buy and burn BRDR tokens, creating deflationary pressure.

## Overview

The token operates by:
1. Using trading fees from the Uniswap v4 Pool to purchase floor NFTs from the Songbirdz collection
2. Relisting purchased NFTs at a markup (default 1.2x)
3. Using proceeds from NFT sales to buy and burn BRDR tokens
4. Incentivizing community participation through caller rewards

## Key Variables

- **MAX_SUPPLY**: 1,000,000,000 BRDR tokens
- **priceMultiplier**: 1200 (1.2x markup on NFT resales)
- **rewardAmount**: 10 (1% reward for triggering burns)
- **twapIncrement**: 0.25 ETH (max burn amount per TWAP)
- **twapDelayInBlocks**: 1 (minimum blocks between burns)
- **currentFees**: ETH available for NFT purchases
- **ethToTwap**: ETH queued for token burns

## Key Public Functions

### NFT Trading
- `buyTargetNFT(value, data, expectedId, target)`: Purchase an NFT from the Songbirdz collection
- `sellTargetNFT(tokenId)`: Sell a protocol-owned Songbirdz NFT at the listed price

### Token Burns
- `processTokenTwap()`: Execute scheduled token burn and earn % reward
- `buyAndBurnTokens()`: Directly burn tokens with ETH

### Admin Functions (Controller Only)
- `setPriceMultiplier(newMultiplier)`: Update NFT markup (1.1x - 10.0x)
- `setRewardAmount(newRewardAmount)`: Update burn reward (0.5% - 5%)

### Hook Functions
- `addFees()`: Deposit trading fees (uniswap v4 hook only)
- `setMidSwap(value)`: Control swap state (uniswap v4 hook only)

## Burn Rewards

Users can earn ETH rewards by calling `processTokenTwap()`:
- Burn 0.1 ETH → Receive 0.001 ETH reward
- Burn 0.25 ETH → Receive 0.0025 ETH reward

Max burn per transaction: 0.25 ETH.

## Deployment Steps

1. Deploy the `BirdStrategyController.sol` contract with:
	- `_posm`: Position Manager address
	- `_permit2`: Permit2 contract address
	- `_poolManager`: Pool Manager address
	- `_universalRouter`: Universal Router address
	- `_router`: Router address (payable)
2. Deploy the `BirdStrategyHook.sol` contract with:
	- `_poolManager`: IPoolManager address
	- `_birdStrategyController`: BirdStrategyController address
	- `_feeAddress`: Fee collection address
3. Call the `setHookAddress()` function on the `BirdStrategyController` contract with the deployed `BirdStrategyHook` contract address.
4. Call the `launchBirdStrategy()` function on the `BirdStrategyController` contract and send at least (2 wei + 0.125 ether + 0.05 ether = ~0.18 ether).
5. Manually trigger some NFT purchases using `buyTargetNFT()` in the `BirdStrategy` contract to get things rolling!