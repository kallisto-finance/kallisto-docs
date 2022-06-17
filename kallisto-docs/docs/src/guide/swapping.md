## Swapping Optimization

There are three scenarios where a swapping method is needed:

1. When users makes deposits and the deposit token is not in the target pool
2. When users withdraw, and the 
3. When the vault switches from one pool to another 

We’re using [https://github.com/curvefi/curve-js#router-exchange](https://github.com/curvefi/curve-js#router-exchange) to get the optimal swap route
