# Scheduler

Paloma will execute daily searches for the highest APY pool on Curve and selects the best 
opportunities to join the selected pools. It obtains price feeds and calculates two pieces 
of information for the vault:

- Target pool
- Target pool enterance point

:::tip An off-chain script will move the vault liquidity from one Curve pool to another until Paloma is active.
:::

## Process

1. Strategy acquires data from Curve Pool performance
2. Strategy then identifies next best performing pool by APY
3. Kallisto update_pool function is called by any user to swap into the new pool

### Swapping Optimization

There are three scenarios where a swapping method is needed:

1. When users makes deposits and the deposit token is not in the target pool
2. When users withdraw, and the 
3. When the vault switches from one pool to another 

Kallisto uses the [CurveFi SwapRoute](https://github.com/curvefi/curve-js#router-exchange) to obtain the optimal swap route.

## Jobs

### Check for Pool Update

- JS script using Ethers.js and a cron job on the dedicated Kallisto server
- Cron job runs once a day
- JS script should connect to [quicknode endpoint](https://www.quicknode.com/endpoints/44685).
- JS script checks the time between now and when the current Curve pool was entered (`lock_period`) AND checks the current vault total cap.
    - Total cap calculation is the balance from Curve LP from vault `main_lp_token` multiplied by 
      [Curve LP price information](https://thegraph.com/explorer/subgraph?id=4yx4rR6Kf8WH4RJPGhLSHojUxJzRWgEZb51iTran1sEG&view=Overview):
      $$ main_lp_token \times LP price$$

Run the [DeFi python script](https://github.com/VolumeFi/volume_defi_strategy/tree/b4b7d3ea2d709ca271035d9d8f69e012845be6b8) IFF

  - **total cap below $100k and `lock_period` ≥ 3 months** OR
  - **total cap ≥ $100k and < $1MN  and `lock_period` ≥ 1 month** OR
  - **total cap ≥ $1MN and `lock_period`  ≥ 1 week**

The Amount and `lock_period` should be configurable.
  
The script will pass `swap_route` and `new_pool` (the pool address output from the script) as parameters to `update_pool`.

```rust{4-5}
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

```rust{=
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

### Make fee

Schedule a job that calculates the [performance fee](fees.md#fee-types) and calls the `make_fee` function of 
the Curve APY Chaser smart contract.

- Kallisto strategy collects information from the contract:
    - current tvl (total cap)
    - current timestamp
    - timestamp of previous run (when tvl was passed to script)

- IF the **return is ≥ 20%**:
    - records the fee
    - executes the [make_fee](https://github.com/kallisto-finance/curve-apy-vault/blob/4bfdfcbac62664569ace652aa606edd9e0df5e22/contracts/curve_apy_vault.vy#L573) 
      function of the smart contract with the fee amount from the monitor script
- ELSE, exits
