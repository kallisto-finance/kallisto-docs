# Curve Chaser Vault contract

<!-- Page is WIP 

Smart contract doc placeholder

-->

## Define Swap Routes and ERC20 events

First we define the swap routes for Curve. We must know what tokens are coming in and what tokens are going to come out of the swap and what contract addresses on the specific Curve pools will be used.

```Javascript
# define swap route
struct SwapRoute:
    swap_pool: address # swap pool to use for swap
    j_token: address # out token from the pool
    i: int128 # in token index
    j: int128 # out token index
    is_underlying: bool # true if exchange underlying coins using exchange_underlying()
    is_crypto_pool: bool # true if token index in uint256

# ERC20 events
event Transfer:
    _from: indexed(address)
    _to: indexed(address)
    _value: uint256

event Approval:
    _owner: indexed(address)
    _spender: indexed(address)
    _value: uint256

# Vault events
event Deposit:
    _token: indexed(address)
    _from: indexed(address)
    token_amount: uint256
    vault_balance: uint256

event Withdraw:
    _token: indexed(address)
    _from: indexed(address)
    token_amount: uint256
    vault_balance: uint256

event Updated:
    old_pool: indexed(address)
    new_pool: indexed(address)
    _timestamp: uint256
    from_amount: uint256
    to_amount: uint256

# ERC20 standard interfaces
name: public(String[64])
symbol: public(String[32])

balanceOf: public(HashMap[address, uint256])
allowance: public(HashMap[address, HashMap[address, uint256]])
totalSupply: public(uint256)

paused: public(bool)
main_pool: public(address) # main curve pool address
main_pool_coin_count: public(uint8) # (undelying) coin count
is_crypto_pool: public(bool) # true if main pool coin index type is uint256
```