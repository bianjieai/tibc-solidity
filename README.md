# tibc-solidity

Solidity Implementation of Terse IBC

## Compile

```shell
yarn & yarn compile
```

## Test

```shell
yarn test
```

## Deploy on Ropsten testnet

### Build a Defender environment

1. 管理员创建defender账号，邀请其他人员加入该[组](#https://defender.openzeppelin.com/#/collaborators)。注意：由于defender的限制，只有通过邀请的方式注册defender账号，才能加入该组，不能直接注册defender账号。否则，当进行多签的时候，用户无法收到签名提议的通知。

2. 创建[多签钱包](#https://defender.openzeppelin.com/#/admin/addSafe)，选择要部署的网络、以及对应网络的地址和多签阀值。

3. 部署多签钱包，获取多签钱包地址。

### Deploy contract

Export the environment variables for each step below.

* Deploy libraries

```shell
yarn hardhat deployLibraries --network ropsten
```

* Deploy AccessManager

```shell
yarn hardhat deployAcessManager --network ropsten --wallet <walletAddress>
```

* Deploy ClientManager

```shell
yarn hardhat deployClientManager --network ropsten --chain eth --wallet <walletAddress>
```

* Deploy Tendermint Client

```shell
yarn hardhat deployTendermint --network ropsten
```

* Deploy Routing

```shell
yarn hardhat deployRouting --network ropsten --wallet <walletAddress>
```

* Deploy Packet

```shell
yarn hardhat deployPacket --network ropsten
```

* Deploy ERC1155

```shell
yarn hardhat deployERC1155Bank --network ropsten
```

* Deploy NFT Transfer

```shell
yarn hardhat deployNFTTransfer --network ropsten
```

### Transfer proxy contract ownership

### Import the contract to Defender

### Authorize account

### Register relayer

## Upgrade contract
