# Introduction

Liquidity providers are often rewarded based on how much volume they control in a liquidity 
pool. Using Kallisto, a liquidity provider is able to automate their yield generation and risk 
management.

Kallisto is an automated yield maximizer that targets decentralized exchange liquidity pools to 
maximize yield for liquidity providers. Kallisto dynamically chases the best APY by using a DeFi 
asset management protocol, a Curve-based APY chaser vault, to provide dynamic liquidity.

Kallisto v1 was previously built on Terra, which is no longer functioning. Kallisto is moving to 
Ethereum to launch a new vault. This new vault will aim to provide a low-cost, data science-based 
strategy for liquidity providers to participate in Curve pools. By aggregating users’ deposits and 
monitoring price dynamics, the vault can significantly reduce the cost for staying in the highest 
APY pools on Curve.

# Architecture

Kallisto chases the highest APY on Curve by using a scheduler called Paloma. To start, scheduling
will be ran off-chain. Similar to the liquidation vaults in Kallisto v1, a cron job will execute 
smart contract functions and run a stragety script written in Python. Eventually, the strategy
and scheduling will be ran on Paloma.

## Scheduler

Paloma executes daily searches for the highest APY pool on Curve and selects the best opportunities to
join the selected pools. It obtains price feeds and calculates two pieces of information for the
vault:

- Target pool
- Target pool enterance point

## Target Pool

Yield chasing is achieved by finding the target pool with the **highest base APY** from a selection
of candidate pools. 

The candidate pools are chosen by the following conditions:

- **Base APY**
- **TVL** > `tvl_threshold`
- **Daily volume** > `daily_volume_threshold`
- **Token imbalance** < `token_imbalance_threshold`

Once the target pool is chosen, it will change the *state config* and remain in
that state until the next daily pool update. The mechanism also manually exclusdes

We also need to be able to manually exclude some pools that may be exteremly volatile,
offer a high risk of impermenant loss, etc.

## Pool Update

Pool update is a smart contract event that occurs when the time lag since the last
pool update exceeds the rebalance lock up. 

Rebalance lock up is the time the vault waits from one pool update to the next one. It is 
determined by the vault volume. When the vault volume is small, the rebalance lock up time is 
large to reduce the cost of frequent trading. Once the volume is large enough, the lock up time 
becomes shorter to take advantage of the most up-to-date market info. Currently this parameter is 
in three different tiers:

- `lock_up = 3 months`, when vault cap is below $100K
- `lock_up = 1 month`, when vault cap is between $100K and $1MN
- `lock_up = 1 week`, when vault cap is above $1MN

The scheduler continously checks the volume of the vault and updates this parameter accordingly.

When triggered, the vault autonomously runs the `pool_update.py`, the target pool selection script. 
If the vault has just been intiatied, an update is required to find the target pool.

## Deposits & Withdrawals

Users can deposit all Curve stablecoin, Bitcoin, and ETH.

Users can withdraw in two ways after removing liquidity:
1. Swap tokens into stablecoins for withdrawal
2. Return tokens that were moved from the target pool

Liqudity is removed as soon as a user withdraws.


## Swapping Optimization

There are three scenarios where a swapping method is needed:

1. When users makes deposits and the deposit token is not in the target pool
2. When users withdraw, and the 
3. When the vault switches from one pool to another 

We’re using [https://github.com/curvefi/curve-js#router-exchange](https://github.com/curvefi/curve-js#router-exchange) to get the optimal swap route

# Fees

## Cost Estimate

## Fee Structure

# Infrastructure
