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

* `v1.0` of the Kallisto Curve APY Chaser vault does not charge any fees.
* `v1.1` of the Kallisto Curve APY Chaser vault (includes staking of the Curve LP tokens and boosting of CRV rewards)
  charges a **2% management fee on the total value of the vault**

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


