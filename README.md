# tibc-solidity
Solidity Implementation of Terse IBC

## Compile
```
yarn & yarn compile
```

## Test

```
yarn test
```

## Deploy on Rinkeby testnet
Export the environment variables for each step below.

* Deploy libraries
```shell
yarn hardhat deployLibraries --network rinkeby
```

* Deploy ClientManager
```shell
yarn hardhat deployClientManager --network rinkeby --chain eth
```

* Deploy Tendermint Client
```shell
yarn hardhat deployTendermint --network rinkeby
```

* Deploy Routing
```shell
yarn hardhat deployRouting --network rinkeby
```

* Deploy Packet
```shell
yarn hardhat deployPacket --network rinkeby
```