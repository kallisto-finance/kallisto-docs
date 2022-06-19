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

### Fee types

* **Performance fee**: A Variable that is deducted from the yield earned every time a vault *harvests* 
  a strategy.
* **Management Fee**: A constant fee of 2% that is a flat rate taken from vault deposits over a year. 
  **The fee is extracted by minting new shares of the vault, thereby diluting vault participants.** 
  This is done at the time of harvest, and calculated based off of time since the previous harvest.

For example, a vault takes about **0.0055%** of deposits per day on average 
$$0.02 \div 365 = 0.000055 $$

- It would dilute vault tokens by **0.0275%** after 5 days without harvesting
  $$5 \times 0.000055$$
- It would dilute vault tokens by **0.0385%** on the next harvest if it had not happened for 7 days
  $$7 \times 0.000055$$
- Vaults will only harvest if they are profitable after fees so that users won't withdraw less than their deposit.

On the [yearn.finance](https://yearn.finance/) user interface, yield is displayed as net APY. This means that both 
fees and compounding returns are taken into consideration in the rates presented. Since harvests don't occur on a set basis, 
yield is estimated based off of historical data. For more information, see [How to Understand yVault ROI](https://docs.yearn.finance/getting-started/guides/how-to-understand-yvault-roi).

:::details Here are two proposals

1. Charge a one-off management fee of [0.5%] at the time of deposit. There are two ways to allocate it:
   * That portion of the deposit tokens will be kept in the vault under a “fee collector” user, which means no additional 
     gas cost.
   * Send the fee to a separate wallet and keep it there. This costs gas and requires an additional wallet to pay for it
2. Share the LP earnings with the users, charging [5%] of the earnings periodically. This takes place when the vault does an 
   update and takes liquidity from one pool to another. Allocation will be similar:
   * That portion of the earned fees will be kept in the vault under a “fee collector” user, which means no additional gas cost
   * Send the fee to a separate wallet and keep it there. This costs gas and requires an additional wallet to pay for it

With option 1 and $100MN TVL, the vault will be generating a one-off fee of $500K.

There’s a previous [EPIC](https://www.notion.so/EPIC-04-15-Kallisto-Fee-Structure-7ae68ba0385144af918469301d68f532) 
on fee structures for Kallisto vaults, which has a very thorough discussion. Since performance fees rely on a dynamic 
high water mark, which needs to be maintained on-chain, charging it will cost gas. Given the high gas expense on EVM, 
we will not be keeping track of a HWM and will charge fees without it.

:::

