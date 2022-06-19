# Pools

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
becomes shorter to take advantage of the most up-to-date market info. Currently, this parameter is 
in three different tiers:

- `lock_up = 3 months`, when vault cap is below $100K
- `lock_up = 1 month`, when vault cap is between $100K and $1MN
- `lock_up = 1 week`, when vault cap is above $1MN

The scheduler continously checks the volume of the vault and updates this parameter accordingly.

When triggered, the vault autonomously runs the `pool_update.py`, the target pool selection script. 
If the vault has just been intiatied, an update is required to find the target pool.
