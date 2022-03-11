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
        },true)
    });

task("transferMT", "Sender MT")
    .addParam("mtid", "mt id")
    .addParam("amount", "mt amount")
    .addParam("destchain", "dest chain name")
    .addParam("receiver", "receiver address")
    .addParam("relaychain", "relay chain name", "", types.string, true)
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const transferFactory = await hre.ethers.getContractFactory('MultiTokenTransfer')
            const transfer = await transferFactory.attach(env.contract.transferMTAddress);
            const tokenID = BigNumber.from(taskArgs.mtid)

            const erc1155BankFactory = await hre.ethers.getContractFactory('ERC1155Bank')
            const erc1155Bank = await erc1155BankFactory.attach(env.contract.erc1155BankAddress);
            const originToken = await transfer.getBinding(tokenID);

            let transferdata = {
                tokenId: tokenID,
                receiver: taskArgs.receiver,
                class: originToken.class,
                destChain: taskArgs.destchain,
                relayChain: taskArgs.relaychain,
                destContract: erc1155Bank.address,
                amount: taskArgs.amount,
            }
            let res = await transfer.sendTransfer(transferdata);
            console.log(await res.wait())
        })
    });

module.exports = {};
