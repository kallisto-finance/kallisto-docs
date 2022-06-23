# Curve Chaser Vault Scripts

The Volume Finance team has developed scripts to trigger the logic in the 
[Chaser Vault smart contract](chaser-vault.md). These scripts are available in
the same [source code repository](https://github.com/kallisto-finance/curve-apy-vault).

## `deposit.py`

The deposit script

```python
def main():
    acct = accounts.load("deployer_account")
    Vault = Contract.from_abi("Curve APY Chaser Vault", "0xE9F20140Eb23A9d0AD2B2353F2FBE370203F3082", <PARAMETERS>)
    DAI = Contract.from_abi("DAI", "0x6B175474E89094C44Da98b954EedeAC495271d0F", <PARAMETERS>)
    DAI.approve(Vault, 1000 * 10 ** 18, {"from": acct})
    Vault.deposit(DAI, 1000 * 10 ** 18, 1, [], 1, {"from": acct})
```

## `withdraw.py`

The withdrawl script

```python
def main():
    acct = accounts.load("deployer_account")
    Vault = Contract.from_abi("Curve APY Chaser Vault", "0xE9F20140Eb23A9d0AD2B2353F2FBE370203F3082", <PARAMETERS>)
    DAI = Contract.from_abi("DAI", "0x6B175474E89094C44Da98b954EedeAC495271d0F", <PARAMETERS>)
    bal = Vault.balanceOf(acct)
    Vault.withdraw(DAI, bal, 1, [], 1, {"from": acct})
```

## `deploy.py`

The deployer script

```python
def main():
    acct = accounts.load("deployer_account")
    curve_apy_vault.deploy("Curve APY Vault", "CAV", "0x5a6A4D54456819380173272A5E8E9B9904BdF41B", "0xA79828DF1850E8a3A3064576f380D90aECDD3359", 4, "0x5a6A4D54456819380173272A5E8E9B9904BdF41B", False, {"from": acct})
```

## `updatepool.py`

The pool updater script

```python
def main():
    acct = accounts.load("deployer_account")
    Vault = Contract.from_abi("Curve APY Chaser Vault", "0xE9F20140Eb23A9d0AD2B2353F2FBE370203F3082", <PARAMETERS>)
    withdraw_token = ""
    token_index = 0
    swap_route = []
    main_pool = ""
    main_deposit = ""
    deposit_token_index = 0
    main_coin_count = 0
    lp_token = ""
    is_crypto = False
    Vault.update_pool(withdraw_token, token_index, swap_route, main_pool, main_deposit, deposit_token_index, main_coin_count, lp_token, is_crypto, 1, {"from": acct})
```