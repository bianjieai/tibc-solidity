import "@nomiclabs/hardhat-web3";
import { task, types } from "hardhat/config";
import { BigNumber } from "ethers";

const fs = require('./utils')

task("deployMtTransfer", "Deploy MT Transfer")
    .setAction(async (taskArgs, hre) => {
        await fs.readAndWriteEnv(async function (env: any) {
            const transferFactory = await hre.ethers.getContractFactory('MultiTokenTransfer')
            const transfer = await hre.upgrades.deployProxy(transferFactory,
                [
                    env.PACKET_ADDRES,
                    env.CLIENT_MANAGER_ADDRES
                ]);
            await transfer.deployed();
            console.log("MtTransfer deployed to:", transfer.address);
            env.MTTRANSFER_ADDRES = transfer.address
        })
    });

task("transferMT", "Sender MT")
    .addParam("transfer", "transferMT contract address ")
    .addParam("erc1155", "erc1155 contract address ")
    .addParam("mtid", "mt id")
    .addParam("amount", "mt amount")
    .addParam("destchain", "dest chain name")
    .addParam("receiver", "receiver address")
    .addParam("relaychain", "relay chain name", "", types.string, true)
    .setAction(async (taskArgs, hre) => {
        const transferFactory = await hre.ethers.getContractFactory('MultiTokenTransfer')
        const transfer = await transferFactory.attach(taskArgs.transfer);
        const tokenID = BigNumber.from(taskArgs.mtid)
        const erc1155BankFactory = await hre.ethers.getContractFactory('ERC1155Bank')
        const erc1155Bank = await erc1155BankFactory.attach(taskArgs.erc1155);
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
    });

module.exports = {};
