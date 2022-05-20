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
        }, true)
    });

task("transferNFT", "Sender NFT")
    .addParam("destContract", "mt amount")
    .addParam("nftid", "nft token id")
    .addParam("destchain", "dest chain name")
    .addParam("sender", "sender address")
    .addParam("receiver", "receiver address")
    .addParam("relaychain", "relay chain name", "", types.string, true)
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const transferFactory = await hre.ethers.getContractFactory('Transfer')
            const transfer = await transferFactory.attach(env.contract.transferNFTAddress);
            const tokenID = BigNumber.from(taskArgs.nftid);

            const originToken = await transfer.getBinding(tokenID);

            let transferdata = {
                tokenId: taskArgs.nftid,
                receiver: taskArgs.receiver,
                class: originToken.class,
                destChain: taskArgs.destchain,
                relayChain: taskArgs.relaychain,
                destContract: taskArgs.destContract,
                owner: taskArgs.sender,
            }
            console.log(transferdata);
            let res = await transfer.sendTransfer(transferdata);
            console.log(await res.wait())
        })
    });

module.exports = {};
