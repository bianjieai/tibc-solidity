import "@nomiclabs/hardhat-web3";
import { task, types } from "hardhat/config";
import { BigNumber } from "ethers";

const config = require('./config')

task("deployMtTransfer", "Deploy MT Transfer")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const transferFactory = await hre.ethers.getContractFactory('MultiTokenTransfer')
            const transfer = await hre.upgrades.deployProxy(transferFactory,
                [
                    env.contract.packetAddress,
                    env.contract.clientManagerAddress
                ]);
            await transfer.deployed();
            console.log("MtTransfer deployed to:", transfer.address);
            env.contract.transferMTAddress = transfer.address
        }, true)
    });

task("transferMT", "Sender MT")
    .addParam("mtid", "mt id")
    .addParam("destContract", "mt amount")
    .addParam("amount", "mt amount")
    .addParam("destchain", "dest chain name")
    .addParam("sender", "sender address")
    .addParam("receiver", "receiver address")
    .addParam("relaychain", "relay chain name", "", types.string, true)
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const transferFactory = await hre.ethers.getContractFactory('MultiTokenTransfer')
            const transfer = await transferFactory.attach(env.contract.transferMTAddress);
            const tokenID = BigNumber.from(taskArgs.mtid)

            const originToken = await transfer.getBinding(tokenID);

            let transferdata = {
                tokenId: tokenID,
                sender: taskArgs.sender,
                receiver: taskArgs.receiver,
                class: originToken.class,
                destChain: taskArgs.destchain,
                relayChain: taskArgs.relaychain,
                destContract: taskArgs.destContract,
                amount: taskArgs.amount,
            }

            console.log(transferdata)
            // return;
            let res = await transfer.sendTransfer(transferdata);
            console.log(await res.wait())
        })
    });

module.exports = {};
