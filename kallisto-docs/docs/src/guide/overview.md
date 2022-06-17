# Overview

Kallisto chases the highest APY on Curve by using a scheduler called Paloma. To start, scheduling
will be ran off-chain. Similar to the liquidation vaults in Kallisto v1, a cron job will execute 
smart contract functions and run a stragety script written in Python. Eventually, the strategy
and scheduling will be ran on Paloma.
