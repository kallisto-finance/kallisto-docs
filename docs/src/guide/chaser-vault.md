# Curve Chaser Vault Contract

The `curve_apy_vault.vy` Vyper smart contract contains all the Kallisto Chaser 
Vault functionality. The [source code](https://github.com/kallisto-finance/curve-apy-vault) 
is maintained by the Volume Finance team. The contract is deployed on Ethereum
at 

## Swap Routes

The Chaser Vault defines swap routes for Curve. 
The `SwapRoute` takes in the addresses of the Curve pools used in the 
swapping, and defines the incoming token as well as the token to swap into. 

```js
struct SwapRoute:
    swap_pool: address
    j_token: address
    i: int128 # in token index
    j: int128 # out token index
    is_underlying: bool # true if exchange underlying coins using exchange_underlying()
    is_crypto_pool: bool # true if token index in uint256
```

:::details Parameters

| Key | Type | Description |
| --- | --- | --- |
| `swap_pool` | address | swap pool to use for swap |
| `j_token` | address | out token address from the pool |
| `i` | int128 | token index into the pool |
| `j` | address | swap pool to use for swap |
| `is_underlying` | bool | true if exchange underlying coins using exchange_underlying() |
| `is_crypto_pool` | bool | true if token index type is uint256 |

:::

## Contract Events

### ERC20 events

#### Transfer event 

Transfers from a destination address to a source address.

```js
event Transfer:
    _from: indexed(address)
    _to: indexed(address)
    _value: uint256

```

#### Approval event 

Grants permission to execute logic.

```js
event Approval:
    _owner: indexed(address)
    _spender: indexed(address)
    _value: uint256
```

### Vault events

#### Deposit event:

```js
event Deposit:
    _token: indexed(address)
    _from: indexed(address)
    token_amount: uint256
    vault_balance: uint256
```

:::details Parameters

| Key | Type | Description |
| --- | --- | --- |
| `token_address` | address | Address of deposited token |
| `amount` | uint256 | deposited amount |
| `i` | int128 | deposit token index of the main pool |
| `swap_route` | SwapRoute[] | best swap route on Curve |
| `min_amount` | uint256 | minimum amount of vault balance after deposit |

:::

#### Withdrawal event:

```js
event Withdraw:
    _token: indexed(address)
    _from: indexed(address)
    token_amount: uint256
    vault_balance: uint256
```

:::details Parameters

| Key | Type | Description |
| --- | --- | --- |
| `token_address` | address | withdrawal token address |
| `amount` | uint256 | withdrawal vault balance amount (not token amount) |
| `i` | int128 | withdrawal token index of the main pool |
| `swap_route` | SwapRoute[] | best swap route on Curve |
| `min_amount` | uint256 | minimum amount of withdrawn token from withdraw |

:::

Event to switch the Chaser vault position from the current Curve pool to 
the better Curve pool.

```js
event Updated:
    old_pool: indexed(address)
    new_pool: indexed(address)
    _timestamp: uint256
    from_amount: uint256
    to_amount: uint256
```

:::details Parameters

| Key | Type | Description |
| --- | --- | --- |
| `_out_token` | address | token to withdraw from current pool |
| `old_i` | int128 | withdraw token index of current pool |
| `swap_route` | SwapRoute[] | best swap route on Curve |
| `new_pool` | address | Address of new Curve pool |
| `new_deposit` | address | Address of new Curve deposit contract |
| `new_i` | int128 | deposit token index of new Curve Pool |
| `new_pool_coin_count` | uint8 | coin count of new Curve Pool |
| `new_lp_token` | address | Address of new Curve LP token |
| `new_is_crypto_pool` | bool | True if new main pool coin index type is uint256 |
| `new_lp_min_amount` | uint256 | minimum amount of new curve lp token |

:::

# ERC20 Standard Interfaces

The Chaser Vault Contract implements ERC20 interfaces
and follows the interfaces required to interact with Curve.

:::details Key Parametes and Constants

| Key 	| Type 	| Description 	|
|---	|---	|---	|
| `name` 	| public(String[64]) 	| token name 	|
| `symbol` 	| public(String[32]) 	| token symbol 	|
| `balanceOf` 	| public(HashMap[address, uint256]) 	| amount of tokens held by owner 	|
| `allowance` 	| public(HashMap[address, HashMap[address, uint256]]) 	| grant approval to transfer to another address 	|
| `totalSupply` 	| public(uint256) 	| total token supply 	|
| `paused` 	| public(bool) 	| if true, pause modifier will halt function's ability to work  	|
| `main_pool` 	| public(address) 	| main curve pool address 	|
| `main_pool_coin_count` 	| public(uint8) 	| coin count 	|
| `is_crypto_pool` 	| public(bool) 	| true if main pool coin index type is uint256 	|
| `main_deposit` 	| public(address) 	| main deposit address for meta pools; (0) for base pools, (1) for lending pools 	|
| `main_lp_token` 	| public(address) 	| the main token in the Curve LP address of main pool 	|
| `validators` 	| public (HashMap[address, bool]) 	| validators who can update pool 	|
| `admin` 	| public(address) 	| vault admin 	|
| `zap_deposit` 	| public(address) 	| ZAP deposit pool address that curve provides 	|
| `MAX_COINS` 	| constant(uint8) 	| max coin count 	|
| `VETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` 	| constant(address) 	| virtual ETH address 	|
| `WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` 	| constant(address) 	| wrapped ETH address 	|
| `IS_A_POOL_IN_DEPOSIT = 0x0000000000000000000000000000000000000001` 	| constant(address) 	| use address(1) as deposit address for aave pools 	|
| `INIT_ZAP_DEPOSIT = 0xA79828DF1850E8a3A3064576f380D90aECDD3359` 	| constant(address) 	| initiate ZAP deposit contract address 	|
| `TRUE_BYTES32 = 0x0000000000000000000000000000000000000000000000000000000000000001` 	| constant(bytes32) 	| conversion True into bytes32 	|
| `MAX_SWAP = 4` 	| constant(uint256) 	| max count of swap steps 	|

:::

## Interface

### `CrvPool`

```js
interface CrvPool:
    def remove_liquidity_one_coin(token_amount: uint256, i: int128, min_amount: uint256): nonpayable
    def exchange(i: int128, j: int128, dx: uint256, min_dy: uint256): payable
    def exchange_underlying(i: int128, j: int128, dx: uint256, min_dy: uint256): payable
```

### `CryptoPool`

```js
interface CryptoPool:
    def exchange(i: uint256, j: uint256, dx: uint256, min_dy: uint256): payable
    def exchange_underlying(i: uint256, j: uint256, dx: uint256, min_dy: uint256): payable
    def remove_liquidity_one_coin(token_amount: uint256, i: uint256, min_amount: uint256): nonpayable
```

### `CrvAPool`

```js
interface CrvAPool:
    def remove_liquidity_one_coin(token_amount: uint256, i: int128, min_amount: uint256, use_underlying: bool): nonpayable
```

### `CryptoAPool`

```js
interface CryptoAPool:
    def remove_liquidity_one_coin(token_amount: uint256, i: uint256, min_amount: uint256, use_underlying: bool): nonpayable
```

### `CrvZapDeposit`

```js
interface CrvZapDeposit:
    def remove_liquidity_one_coin(_pool: address, token_amount: uint256, i: int128, min_amount: uint256): nonpayable
```

### `CryptoZapDeposit`

```js
interface CryptoZapDeposit:
    def remove_liquidity_one_coin(_pool: address, token_amount: uint256, i: uint256, min_amount: uint256): nonpayable
```

### `CrvDeposit`

```js
interface CrvDeposit:
    def pool() -> address: view
```

### `ERC20`

```js
interface ERC20:
    def balanceOf(_to: address) -> uint256: view
```

### `WrappedEth`

```js
interface WrappedEth:
    def deposit(): payable
    def withdraw(amount: uint256): nonpayable
```

# Vault Initiation

The 
[external initiation function](https://github.com/kallisto-finance/curve-apy-vault/blob/main/contracts/curve_apy_vault.vy#L106) is called to set up the vault by specifying the **name**, 
**token symbol**, **vault admin**, **validators**, **main Curve pool**, and **main deposit**. 

```js
def __init__(_name: String[64], _symbol: String[32], _main_pool: address, _main_deposit: address, _main_pool_coin_count: uint8, _main_lp_token: address, _is_crypto_pool: bool):
```

# ERC20 Common Functions

:::details Function types

- **@public**: public accessibility
- **@internal**: only the contract itself and contracts deriving from it can access
- **@external**: can only be accessed externally
- **@private**: can be accessed only from the contract itself

:::

## Common Internal Functions

Internal functions are defined for minting, burning, safe transfer and safe transfer 
from alternative addresses.

### `mint`

Mints a token specified by its address at a specific amount.

```js
def _mint(_to: address, _value: uint256):
    assert _to != ZERO_ADDRESS # dev: zero address
    self.totalSupply += _value
    self.balanceOf[_to] += _value
    log Transfer(ZERO_ADDRESS, _to, _value)
```

### `burn`

Burn a token specified by its address at a specific amount.

```js
def _burn(_to: address, _value: uint256):
    assert _to != ZERO_ADDRESS # dev: zero address
    self.totalSupply -= _value
    self.balanceOf[_to] -= _value
    log Transfer(_to, ZERO_ADDRESS, _value)
```

### `safe_approve`

Approves the use of a token by a smart contract.

```js
def safe_approve(_token: address, _to: address, _value: uint256):
    _response: Bytes[32] = raw_call(
        _token,
        concat(
            method_id("approve(address,uint256)"),
            convert(_to, bytes32),
            convert(_value, bytes32)
        ),
        max_outsize=32
    )  # dev: failed approve
    if len(_response) > 0:
        assert convert(_response, bool) # dev: failed approve

```

### `safe_transfer` 

Transfers a token from the vault to another address.

```js
def safe_transfer(_token: address, _to: address, _value: uint256):
    _response: Bytes[32] = raw_call(
        _token,
        concat(
            method_id("transfer(address,uint256)"),
            convert(_to, bytes32),
            convert(_value, bytes32)
        ),
        max_outsize=32
    )  # dev: failed transfer
    if len(_response) > 0:
        assert convert(_response, bool) # dev: failed transfer
```

### `safe_transfer_from`

Transfers a token from one address to another address.

```js
def safe_transfer_from(_token: address, _from: address, _to: address, _value: uint256):
    _response: Bytes[32] = raw_call(
        _token,
        concat(
            method_id("transferFrom(address,address,uint256)"),
            convert(_from, bytes32),
            convert(_to, bytes32),
            convert(_value, bytes32)
        ),
        max_outsize=32
    )  # dev: failed transfer from
    if len(_response) > 0:
        assert convert(_response, bool) # dev: failed transfer from
```

## Common External Functions

These functions are used for accounting related purposes. 

### `transfer`

Sends token from the vault to another address.

```js
def transfer(_to : address, _value : uint256) -> bool:
    assert _to != ZERO_ADDRESS # dev: zero address
    self.balanceOf[msg.sender] -= _value
    self.balanceOf[_to] += _value
    log Transfer(msg.sender, _to, _value)
    return True
```

### `transferFrom`

Sends token from one address to another address.

```js
def transferFrom(_from : address, _to : address, _value : uint256) -> bool:
    assert _to != ZERO_ADDRESS # dev: zero address
    self.balanceOf[_from] -= _value
    self.balanceOf[_to] += _value
    self.allowance[_from][msg.sender] -= _value
    log Transfer(_from, _to, _value)
    return True
```

### `approve` 

Sets the amount as the allowance of spender over the caller’s tokens.

```js
def approve(_spender : address, _value : uint256) -> bool:
    assert _value == 0 or self.allowance[msg.sender][_spender] == 0
    self.allowance[msg.sender][_spender] = _value
    log Approval(msg.sender, _spender, _value)
    return True
```

### `increaseAllowance` 

Increases the allowance granted to spender by the caller.

```js
def increaseAllowance(_spender: address, _value: uint256) -> bool:
    allowance: uint256 = self.allowance[msg.sender][_spender]
    allowance += _value
    self.allowance[msg.sender][_spender] = allowance
    log Approval(msg.sender, _spender, allowance)
    return True
```

### `decreaseAllowance`

Decreases the allowance granted to spender by the caller.

```js
def decreaseAllowance(_spender: address, _value: uint256) -> bool:
    allowance: uint256 = self.allowance[msg.sender][_spender]
    allowance -= _value
    self.allowance[msg.sender][_spender] = allowance
    log Approval(msg.sender, _spender, allowance)
    return True
```

### `make_fee`

Charge fees in the form of transfering tokens into the admin account.

```js
@external
def make_fee(amount: uint256):
    assert msg.sender == self.admin
    self._mint(msg.sender, amount)
```

### `transfer_admin`

Transfer the admin address to another one.

```js
def transfer_admin(_admin: address):
# transfer admin permission
    old_admin: address = self.admin
    assert msg.sender == old_admin and _admin != ZERO_ADDRESS and old_admin != _admin
    self.validators[old_admin] = False
    self.validators[msg.sender] = True
    self.admin = _admin
```

### `set_validator`

Register a new validator or remove a current validator.

```js
def set_validator(_validator: address, _value: bool):
    assert msg.sender == self.admin
    self.validators[_validator] = _value
```

## Functions that Interact with Curve

### `deposit`

#### `@internal`

The 
[internal deposit function](https://github.com/kallisto-finance/curve-apy-vault/blob/main/contracts/curve_apy_vault.vy#L413) interacts with Curve's smart contracts and 
adds liquidity for one token into a Curve liquidity pool.

```js
def _deposit(main_pool_: address, _main_deposit: address, _main_pool_coin_count: uint8, i: int128, in_token: address, in_amount: uint256): 
```

#### `@external`

The 
[external deposit function](https://github.com/kallisto-finance/curve-apy-vault/blob/main/contracts/curve_apy_vault.vy#L413) works as a wrapper of the internal deposit and swap functions. 
It is called when users deposit their tokens into the vault. Upon being called, it swaps 
some of the deposit tokens for the tokens required by the pool, and adds liquidity.  

```js
def deposit(token_address: address, amount: uint256, i: int128, swap_route: DynArray[SwapRoute, MAX_SWAP], min_amount: uint256) -> uint256:
```

### `swap`

The [internal swap function](https://github.com/kallisto-finance/curve-apy-vault/blob/main/contracts/curve_apy_vault.vy#L359) interacts with Curve's smart contract and use a Curve liquidity pool to swap one token for another. The inputs include the Curve liquidity pool's address, the indices for the from_token and to_token, the addresses for the two tokens, the amount to swap for the from_token, and whether the pool is a crypto pool. Upon called, the function swaps the specified amount of the from_token for the to_token.

```js
def _swap(pool: address, i: int128, j: int128, from_token: address, to_token: address, is_underlying: bool, from_amount: uint256, is_crypto_pool: bool) -> uint256:
```

### `withdraw`

#### `@internal`

The 
[internal withdraw function](https://github.com/kallisto-finance/curve-apy-vault/blob/main/contracts/curve_apy_vault.vy#L447) interacts with the Curve smart contracts directly. It approves 
the transaction and removes liquidity in one token. The function requires inputs 
specifying the LP tokens and the main pool address to remove liquidity, and returned 
token address, index and the amount.

```js
def _withdraw(lp_token: address, _main_pool: address, out_token: address, i: int128, out_amount: uint256) -> uint256:
```

#### `@external`

The 
[external withdraw function](https://github.com/kallisto-finance/curve-apy-vault/blob/main/contracts/curve_apy_vault.vy#L500) is a wrapper of the internal withdraw function. 
It is called when users withdraw liquidity from the vault. The inputs include withdrawal 
token address and amount, swap route and the minimal amount for swapping. Since the users' 
withdrawal token may differ from the pool's tokens, a swap will be applied in that case.

```js
def withdraw(token_address: address, amount: uint256, i: int128, swap_route: DynArray[SwapRoute, MAX_SWAP], min_amount: uint256) -> uint256:
```

### `update_pool`

The [internal update pool function](https://github.com/kallisto-finance/curve-apy-vault/blob/main/contracts/curve_apy_vault.vy#L533) moves the vault's liquidity from one pool to another one. 
It first removes liquidity from the old pool and receives one token. Then, it 
swaps this token for the new token, and adds liquidity to the new pool. 
This is followed by updating the new LP amount. 

```js
def update_pool(_out_token: address, old_i: int128, swap_route: DynArray[SwapRoute, MAX_SWAP], new_pool: address, new_deposit: address, new_i: int128, new_pool_coin_count: uint8, new_lp_token: address, new_is_crypto_pool: bool, new_lp_min_amount: uint256):
```

## Emergency Functions

Emergency functions provide security for the vault and can only be executed by the admin.

### `set_main_pool`

Used by the admin to set the main pool.

```js
def set_main_pool(_new_pool: address):
    assert msg.sender == self.admin
    self.main_pool = _new_pool
```

### `set_main_deposit`

Used by the admin to set the main deposit. 

```js
def set_main_deposit(_new_deposit: address):
    assert msg.sender == self.admin
    self.main_deposit = _new_deposit
```

### `set_main_pool_coin_count`

Used by the admin to set the pool coin count. 

```js
def set_main_pool_coin_count(_new_main_pool_coin_count: uint8):
    assert msg.sender == self.admin
    self.main_pool_coin_count = _new_main_pool_coin_count
```

### `set_is_crypto_pool`

Used by the admin to set the new Curve pool. 

```js
def set_is_crypto_pool(_new_is_crypto_pool: bool):
    assert msg.sender == self.admin
    self.is_crypto_pool = _new_is_crypto_pool
```

### `set_main_lp_token`

Used by the admin to set the main liqudity pool token. 

```js
def set_main_lp_token(_new_main_lp_token: address):
    assert msg.sender == self.admin
    self.main_lp_token = _new_main_lp_token
```

### `set_zap_deposit`

Used by the admin to set the ZAP deposit. 

```js
def set_zap_deposit(_new_zap_deposit: address):
    assert msg.sender == self.admin
    self.zap_deposit = _new_zap_deposit
```

### `pause` 

Used by the admin to pause all functionality. 

```js
def pause(_paused: bool):
    assert msg.sender == self.admin
    self.paused = _paused
```
