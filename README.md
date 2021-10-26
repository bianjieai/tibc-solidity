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

1. The administrator creates a defender account and invites other people to join the [group](#https://defender.openzeppelin.com/#/collaborators). Note: Due to the limitation of the defender, you can only join the group by registering the defender account by invitation, and you cannot directly register the defender account. Otherwise, when the multi-signature is performed, the user cannot receive the notification of the signature proposal.

2. Create a [multi-signature wallet](#https://defender.openzeppelin.com/#/admin/addSafe), select the network to be deployed, and the corresponding network address and multi-signature threshold.

3. Deploy a multi-signature wallet and obtain a multi-signature wallet address.

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

For the safe upgrade of the contract, it is necessary to cooperate with the operation of the multi-signature wallet to transfer the ownership of the contract to the multi-signature wallet. Note that after the project is deployed, the proxy contract address of all contracts and the compilation information of the contract are recorded in the .openzeppelin directory. This information is needed when the contract upgrade is executed next time. Modify the following [script](#./script/transfer-ownership.js) to complete the ownership transfer. In the `scripts/transfer-ownership.js` file, you need to replace the `gnosisSafe` variable, which is the address of the multi-signature wallet. After the modification is complete, execute the following command:

```shell
npx hardhat run --network ropsten scripts/transfer-ownership.js
```

### Import the contract to Defender && Authorize account

Currently, only the `AccessManager` contract uses multi-signature control (except for the upgrade operation). The management authority of other contracts is managed by `AccessManager`, so in order to facilitate the operation, you need to import the `AccessManager` and `ClientManager` contracts into the `Defender`, Use the console to assign permissions according to the following table.

| contract      | role_name                      | role_value                                                       |
| ------------- | ------------------------------ | ---------------------------------------------------------------- |
| clientManager | CREATE_CLIENT_ROLE             | cf83526043951e0ae3bc5b11e7a485f61baaf17277b2ad0841e35d5abe0d05fd |
| clientManager | UPGRADE_CLIENT_ROLE            | 8f5d2792a1fa2e423bdb2f27e1d5fbe0bf82904d867257a47a12c00f619f3fa9 |
| clientManager | REGISTER_RELAYER_ROLE          | 7d1460b63cf4a7c6c430432e77ee5362c0ab212bae6ee332cd661bb15f52c809 |
| routing       | SET_ROUTING_ROULES_ROLE        | 4e98d329974ca80a93cf972d0cb6da6ab889cef98382664c47b8e3adbdcde764 |
| routing       | ADD_ROUTING_ROLE               | 1f5d5d13d11690c734f3783b436f0f33696a050aed979e5362a3c49324de4427 |
| transfer      | ON_RECVPACKET_ROLE             | 37047b08f3a23fe2015ab7a09e9ea8fa4cd754a9cf05e3e1a97eaf5f7377cba4 |
| transfer      | ON_ACKNOWLEDGEMENT_PACKET_ROLE | 177411b22008009546b1b5adeaef545c56fc807383f00c329ad0647abc0ebbf0 |
|               |                                |                                                                  |

### Register relayer

```shell
yarn hardhat reisterRelayer --network ropsten --relayer <relayer-eth-address>
```

## Upgrade contract

When you need to upgrade a contract, you need to recompile the updated code (note that the configuration in the .openzeppelin directory does not change), and then modify [script](#./script/propose-upgrade.js), where `proxyAddress` It refers to the contract address that needs to be upgraded (actually the proxy contract address), and then the contract to be upgraded is specified in the `getContractFactory` parameter.

Another thing to note is that when using `Defender` to cooperate with a multi-signature wallet to upgrade the contract, the key information provided by the `Defender` platform (the `defender` configuration domain in the `hardhat.config.ts` file) is required to create an upgrade proposal The upgrade proposal is sent to the members of the group, and the upgrade operation will only be performed after the upgrade proposal is approved by the multi-signature strategy.

```shell
npx hardhat run --network ropsten scripts/propose-upgrade.js
```
