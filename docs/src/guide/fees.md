# Fees

## Cost Estimatation

Vault operation cost:

- Swap
- Add liquidity
- Remove liquidity

Vault user cost:

- Deposit
- Withdraw

## Fee Structure

There is a fee for using this vault. 

:::details Fee details

* `v1` of the Kallisto Curve APY Chaser vault does not charge any fees. 
* `v2` of the Kallisto Curve APY Chaser vault (includes staking of the Curve LP tokens) 
  charges a performance fee on the CRV tokens received from staking the Curve LP token. 
  **The fee is 20% of the CRV tokens received.** 
* `v3` of the Kallisto Curve APY Chaser vault (includes boosting of CRV rewards) charges 
  a performance fee on the CRV tokens received from staking the Curve LP token as well as 
  on the CRV tokens received from locking CRV and boosting the CRV rewards.. 
  **The fee is 20% of the CRV tokens received.**

:::

### Management Fee

A constant fee of 2% that is a flat rate taken from vault deposits over a year. 
**The fee is extracted by minting new shares of the vault, thereby diluting vault participants.** 
This function will be called whenever a user deposit or withdrawal is initiated to save on gas.  

For example, a vault takes about **0.0055%** of deposits per day on average 
$$0.02 \div 365 = 0.000055 $$

- It would dilute vault tokens by **0.0275%** after 5 days without harvesting
  $$5 \times 0.000055$$
- It would dilute vault tokens by **0.0385%** on the next harvest if it had not happened for 7 days
  $$7 \times 0.000055$$


