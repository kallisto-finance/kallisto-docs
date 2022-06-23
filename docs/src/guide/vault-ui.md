# Curve Chaser Vault UI

<!-- currently, too general -->

The Chaser Vault UI is available at [kallisto.finance](https://kallisto.finance/).
The vault UI acts as a dashboard for users to seamlessly chase APY on Curve. The
source code is available [here](https://github.com/kallisto-finance/kallisto-vault-ui).

A user is able to manage their liquidity by either adding or withdrawing assets.
The vault dashboard shows the active pool of the vault, the amount of liquidity
an account is providing, and how much of the pool liquidity belongs to an account.

The UI is built using NextJS, NodeJS and uses
[Storyblok](https://www.storyblok.com/docs/api/content-delivery).

> The UI takes in a `STORYBLOK_API_KEY` to use the Storyblok API.

The UI interacts with the [Chaser Vault smart contract](chaser-vault.md)
by providing the `KALLISTO_VAULT_ADDRESS` as an environment variable, and
queries data through a node provider.
