# Scheduler

[Paloma](https://github.com/palomachain/paloma) will execute daily searches for 
the highest APY pool on Curve and selects the best opportunities to join the selected 
pools. It obtains price feeds and calculates two pieces of information for the vault:

- Target pool
- Target pool entrance point

:::tip What is Paloma?

Paloma is an application-specific chain built using the CosmosSDK that can perform
job scheduling. The documentation for Paloma will be released soon.

**An off-chain script will move the vault liquidity from one Curve pool to another until Paloma is active.**

:::

## Process

1. Strategy acquires data from Curve Pool performance
2. Strategy then identifies next best-performing pool by APY
3. Kallisto update_pool function is called by any user to swap into the new pool

# Jobs

## Pools

### Target pool

Yield chasing is achieved by finding the target pool with the **highest APY** from a selection
of candidate pools. These candidate pools are a selection of Curve pools.

:::details Curve Pools vs. Crypto Pools

Becoming an LP in a Crypto pool is similar to stable pools. 
Crypto pools are Curve pools that hold assets at different prices. 
They use liquidity more effectively by concentrating it at current prices. 

:::

The following conditions choose the candidate pools:

- **APY**
- **TVL** > `tvl_threshold`
- **Daily volume** > `daily_volume_threshold`
- **Token imbalance** < `token_imbalance_threshold`

Once the target pool is chosen, it will change the *state config* and remain in
that state until the next daily pool update. The mechanism also manually excludes
some pools that may be highly volatile, offer a high risk of impermanent loss, etc.

### Check for Pool Update

- Kallisto strategy checks the time between now and when the current Curve pool was entered AND checks the current vault total cap.
- Total cap calculation is the balance from Curve LP from vault `main_lp_token` multiplied by
[Curve LP price information](https://thegraph.com/explorer/subgraph?id=4yx4rR6Kf8WH4RJPGhLSHojUxJzRWgEZb51iTran1sEG&view=Overview):
$$ main_lp_token \times LP price$$

Rebalance lock-up (`lock_period`) is the time the vault waits from one pool update to the
next one. It is determined by the vault volume. When the vault volume is small, the
rebalance lock-up time is large to reduce the cost of frequent trading. Once the volume
is large enough, the lock-up time becomes shorter to take advantage of the most up-to-date
market info. Currently, this parameter is in three different tiers:
* **total cap below $100k: `lock_period` = 1 month** OR
* **total cap ≥ $100k and < $1MN: `lock_period` = 1 week** OR
* **total cap ≥ $1MN: `lock_period`  = 1 day**

  The script will pass `swap_route` and `new_pool` (the pool address output from the script) 
as parameters to `update_pool`.

```js{4-5}
update_pool(address _out_token, int128 old_i, SwapRoute[] swap_route, address new_pool, address new_deposit, int128 new_i, uint8 new_pool_coin_count, address new_lp_token, bool new_is_crypto_pool)
      _out_token: withdraw token address from the old pool
      old_i : withdraw token index of the old pool
      swap_route: dynamic array of swap route
      new_pool: new pool address
      new_deposit: new deposit contract address
      new_i: deposit token index of the new pool
      new_pool_coin_count: new pool coin(underlying coin) counts
      new_lp_token: new curve LP token address
      new_is_crypto_pool: if crypto pool? if the index type of removing_liquidity_one_coin is uint256, it is true, if the index type is int128, it is false.
```

Once `update_pool` is updated, `SwapRoute` will interpret the new pool.

```js
struct SwapRoute:
    swap_pool: address - pool address to exchange
    j_token: address - token address to exchange out from the pool
    i: int128 - from token index
    j: int128 - to token index
    is_underlying: bool - true for pools that we should use exchange_underlying() function instead of exchange() function
    is_crypto_pool: bool - true for crypto pools that requires uint256 index instead of int128
    min_amount: uint256 - min token amount to exchange out for every swap
```

#### Pool Update Example

Example for switching from **MIM+3** to the **stETH**:

> The example uses the [updatepool.py script](scripts.md#updatepoolpy).

```shell
Vault.update_pool(USDT, 3, [[TRICRYPTO2_INFO[0], WETH, 0, 2, False, True, 
min_eth_amount_from_swap][WETH, VETH, 0, 0, False, False, 0]], STETH_INFO[0], 
STETH_INFO[1], 0, 2, STETH_INFO[2], False)
```

1. Determine the swap:
   - Withdraw **USDT** from **MIM+3**
   - Swap **USDT** -> **WETH**
   - Swap **WETH** -> **ETH**
   - Deposit **ETH** to **stETH**
2. Obtain the **USDT index** of **MIM+3**:
   - **0 : MIM+3**
   - **1: 3CRV (DAI + USDC + USDT)**
   - Therefore, **USDT index is `3`**
3. `SwapRoute` **USDT ->  WETH**: **[TRICRYPTO2_pool, WETH, 0, 2, False, True, min_eth_amount_from_swap]**
4. `SwapRoute` **WETH -> ETH**: **[WETH, VETH, 0, 0, False, False, 0]**
5. Deposit **ETH to stETH**; new pool information.
