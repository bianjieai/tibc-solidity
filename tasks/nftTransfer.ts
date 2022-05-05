import "@nomiclabs/hardhat-web3";
import { task, types } from "hardhat/config";
import { BigNumber } from "ethers";
const config = require('./config')

task("deployNFTTransfer", "Deploy NFT Transfer")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const transferFactory = await hre.ethers.getContractFactory('Transfer')
            const transfer = await hre.upgrades.deployProxy(transferFactory,
                [
                    env.contract.packetAddress,
                    env.contract.clientManagerAddress
                ]);
            await transfer.deployed();
            console.log("Transfer deployed to:", transfer.address);
            env.contract.transferNFTAddress = transfer.address
        },true)
    });

task("transferNFT", "Sender NFT")
    .addParam("transfer", "transferNft contract address ")
    .addParam("erc1155", "erc1155 contract address ")
    .addParam("nftid", "nft token id")
    .addParam("destchain", "dest chain name")
    .addParam("receiver", "receiver address")
    .addParam("relaychain", "relay chain name", "", types.string, true)
    .setAction(async (taskArgs, hre) => {
        const transferFactory = await hre.ethers.getContractFactory('Transfer')
        const transfer = await transferFactory.attach(taskArgs.transfer);
        const tokenID = BigNumber.from(taskArgs.nftid)
        const erc1155BankFactory = await hre.ethers.getContractFactory('ERC1155Bank')
        const erc1155Bank = await erc1155BankFactory.attach(taskArgs.erc1155);
        const originToken = await transfer.getBinding(tokenID);
        
        let transferdata = {
            tokenId: taskArgs.nftid,
            receiver: taskArgs.receiver,
            class: originToken.class,
            destChain: taskArgs.destchain,
            relayChain: taskArgs.relaychain,
            destContract: erc1155Bank.address,
            owner: "",
        }
        let res = await transfer.sendTransfer(transferdata);
        console.log(await res.wait())
    });

module.exports = {};
