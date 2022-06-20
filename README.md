<p align="center">
<img align="center" src="https://pbs.twimg.com/profile_images/1516477796029284353/KmZ8uxmk_400x400.jpg" width="200">
</p>

<div align="Center">
<h1>Kallisto Finance Documentation</h1>
<h3> A Decentralized and Automated Yield Chaser </h3>
<br>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![made-with-Markdown](https://img.shields.io/badge/Made%20with-Markdown-1f425f.svg)](https://www.markdownguide.org/)
</div>

<!-- TOC -->
- [Contributing to Documentation](#contributing-to-documentation)
- [Running Locally](#running-locally)
- [Style and Configuration Guide](#style-and-configuration-guide)
  - [Formatting](#formatting)
  - [Static Site Generator](#static-site-generator)
  - [Automated Deployments](#automated-deployments)
- [License](#license)
<!-- /TOC -->

---

Welcome to the official Kallisto Finance documentation.

Kallisto v1 was previously built on Terra, which is no longer functioning. Kallisto is heading 
to Ethereum to target the largest AMMs with a current focus in offering a Curve Finance (http://curve.finance/) APY chaser 
vault. This new vault will aim to provide a low-cost, data science-based strategy for liquidity 
providers to participate in liquidity pools on Curve. By aggregating users’ deposits, 
the vault can significantly reduce the cost for staying in the highest APY pools on Curve.

Kallisto’s Curve APY chaser vault acts as a DeFi asset management tool that automatically provides 
and deploys dynamic liquidity provider strategies for Curve liquidity pools. Kallisto monitors the overall pool 
statistics on Curve's DEX and searches for the best liquidity provider opportunities.

To avoid illiquidity risk and small cap coins’ high volatility, the vault only chases APY among a 
number of large, liquid and balanced pools.The vault screens for large, balanced pools as candidates 
and selects the pool with the highest APY with both base and CRV returns aggregated. By consistently 
moving liquidity into the optimal pool, the vault is designed to achieve the best return across all 
Curve pools while keeping liquidity risk low.

To chase the APY on Curve, Kallisto uses a scheduler called Paloma. Paloma is a job scheduler built
using the Cosmos SDK, that can scheduling transactions that control contracts on any other chain.
This allows Paloma to become responsble for systematic trade and liquidity execution on any decentralized 
exchange. To start, scheduling for Kallisto will be ran off-chain; similar to the liquidation vaults in 
Kallisto  v1, a cron job will execute smart contract functions and run a stragety script written in Python. 
Eventually, the strategy and scheduling will be ran on Paloma.

For now the off-chain scheduler runs multiple times daily and executes the strategy scripts for data feed and monitoring. 
At each update, the scripts query from the vault's smart contracts to check the balance and the status of the current pool.
To see if it is worth going into a new pool, the scripts analyze the size of the vault and the time it has spent in the current pool.
If conditions for pool update are met, the strategy scripts query Curve Finance's API endpoints to receive real time pool statistics and dettermine
which pool is the best one to join. Then it triggers an event and executes smart contract functions to move the vault's liquidity to the new pool.
The gas fee and transaction cost is shared by all the users.

## Contributing to Documentation

The Volume Finance team are the primary maintainers of the Kallisto Finance documentation and will review 
all issues and pull requests created in this repository.

## Running Locally

The documentation uses yarn as the package manager and the site is built from the source files in this 
repository. After cloning the source locally, you can start the websites with each of these respective 
commands. 

Ensure you run yarn at the root of the repository first to install dependencies:

```ssh
yarn install
```

You may need to install Vuepress locally:

```ssh
yarn add -D vuepress
```

To build and serve the documentation site in the local server, run:

```ssh
yarn dev
```

VuePress will start a hot-reloading development server at [localhost](http://localhost:8080)
using port `8080` as the default.

## Style and Configuration Guide

A writing style guide is in the process of being written.

### Formatting

Use [pretty-quick](https://prettier.io/docs/en/precommit.html#option-2-pretty-quickhttpsgithubcomazzpretty-quick) 
as a pre-commit formatting tool. There is an automatic pretty-quick check that occurs pre-commit to format your 
changed/staged files.

```ssh
yarn add pretty-quick
```

To format markdown pages, run the following in the `docs` folder:

```ssh
yarn pretty-quick --staged
```

To run pretty on the whole project: 

```ssh
yarn pretty-quick
```

### Static Site Generator

The documentation's latest version uses the [VuePress static website generator](https://vuepress.vuejs.org/) 
to convert the Markdown docs into a documentation website.

### Automated Deployments

The documentation site is built on the `gh-pages`` branch and automatically deployed to GitHub Pages.
The CICD production workflow will deploy main to the public Kallisto Finance Documentation site.

## License

The Kallisto Finance Documentation is licensed under the [MIT](LICENSE) free software license.
