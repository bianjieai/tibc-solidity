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
yarn hardhat deployLibraries --network <ropsten>
```

* Deploy AccessManager

```shell
yarn hardhat deployAcessManager --network <ropsten> --wallet <walletAddress>
```

**The `<native-chain-name>` requires at least 9 characters in the cross-chain protocol.**

* Deploy ClientManager

```shell
yarn hardhat deployClientManager --network <ropsten> --chain <native-chain-name> --accm <acessManagerAddress>
```

* Deploy Tendermint Client
**When multiple light clients need to be created, multiple instances need to be deployed (Tendermint contracts)**

```shell
yarn hardhat deployTendermint --network <ropsten>
```

* Deploy Routing

```shell
yarn hardhat deployRouting --network <ropsten> --accm <acessManagerAddress>
```

* Deploy Packet

```shell
yarn hardhat deployPacket --network <ropsten>
```

* Deploy ERC1155

```shell
yarn hardhat deployERC1155Bank --network <ropsten>
```

* Deploy NFT Transfer

```shell
yarn hardhat deployNFTTransfer --network <ropsten>
```

### Transfer proxy contract ownership

For the safe upgrade of the contract, it is necessary to cooperate with the operation of the multi-signature wallet to transfer the ownership of the contract to the multi-signature wallet. Note that after the project is deployed, the proxy contract address of all contracts and the compilation information of the contract are recorded in the .openzeppelin directory. This information is needed when the contract upgrade is executed next time. Modify the following [script](#./script/transfer-ownership.js) to complete the ownership transfer. In the `scripts/transfer-ownership.js` file, you need to replace the `gnosisSafe` variable, which is the address of the multi-signature wallet. After the modification is complete, execute the following command:

```shell
npx hardhat run --network ropsten scripts/transfer-ownership.js
```

### Import the contract to Defender(optional)

Currently, only the `AccessManager` contract uses multi-signature control (except for the upgrade operation). The management authority of other contracts is managed by `AccessManager`, so in order to facilitate the operation, you need to import the `AccessManager` and `ClientManager` contracts into the `Defender`, Use the console to assign permissions.

### Register relayer

1. Grant someone permission to add relayer through the Defender management interface.

2. The authorized person can add a relayer through the ClientManager contract

```shell
yarn hardhat reisterRelayer --network ropsten --relayer <relayer-address>
```

But, both of the above steps can be operated by Defender.

### Add data packet receiving module

Grant operator ADD_ROUTING_ROLE(1f5d5d13d11690c734f3783b436f0f33696a050aed979e5362a3c49324de4427) permission

```shell
yarn hardhat addRouting --module NFT --address <transfer-contract-address>  --network ropsten
```

### Authorized transfer contract

Grant mint and burn permissions to the `<transfer-contract-address>`

## Upgrade contract

When you need to upgrade a contract, you need to recompile the updated code (note that the configuration in the .openzeppelin directory does not change), and then modify [script](#./script/propose-upgrade.js), where `proxyAddress` It refers to the contract address that needs to be upgraded (actually the proxy contract address), and then the contract to be upgraded is specified in the `getContractFactory` parameter.

Another thing to note is that when using `Defender` to cooperate with a multi-signature wallet to upgrade the contract, the key information provided by the `Defender` platform (the `defender` configuration domain in the `hardhat.config.ts` file) is required to create an upgrade proposal The upgrade proposal is sent to the members of the group, and the upgrade operation will only be performed after the upgrade proposal is approved by the multi-signature strategy.

```shell
npx hardhat run --network ropsten scripts/propose-upgrade.js
```
