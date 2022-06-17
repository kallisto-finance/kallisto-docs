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

We will be charging fees for this vault. There’s a previous [EPIC](https://www.notion.so/EPIC-04-15-Kallisto-Fee-Structure-7ae68ba0385144af918469301d68f532) on fee structures for 
Kallisto vaults, which has a very thorough discussion. Since performance fees rely on a dynamic 
high water mark, which needs to be maintained on-chain, charging it will cost gas. Given the high 
gas expense on EVM, we will not be keeping track of a HWM and will charge fees without it.

Here are two proposals:

1. Charge a one-off management fee of [0.5%] at the time of deposit. There are two ways to allocate it:
    1. That portion of the deposit tokens will be kept in the vault under a “fee collector” user, which means no additional gas cost
    2. Send the fee to a separate wallet and keep it there. This costs gas and requires an additional wallet to pay for it
2. Share the LP earnings with the users, charging [5%] of the earnings periodically. This takes place when the vault does an update and takes liquidity from one pool to another. Allocation will be similar:
    1. That portion of the earned fees will be kept in the vault under a “fee collector” user, which means no additional gas cost
    2. Send the fee to a separate wallet and keep it there. This costs gas and requires an additional wallet to pay for it

With option 1 and $100MN TVL, the vault will be generating a one-off fee of $500K.
