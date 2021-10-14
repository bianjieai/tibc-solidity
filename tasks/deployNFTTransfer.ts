import "@nomiclabs/hardhat-web3";
import { task, types } from "hardhat/config";
import { BigNumber } from "ethers";

const CLIENT_MANAGER_ADDRES = process.env.CLIENT_MANAGER_ADDRES;
const PACKET_ADDRES = process.env.PACKET_ADDRES;
const ERC1155BANK_ADDRES = process.env.ERC1155BANK_ADDRES;

task("deployNFTTransfer", "Deploy NFT Transfer")
    .setAction(async (taskArgs, hre) => {
        const transferFactory = await hre.ethers.getContractFactory('Transfer')

        const transfer = await hre.upgrades.deployProxy(transferFactory, [String(ERC1155BANK_ADDRES), String(PACKET_ADDRES), String(CLIENT_MANAGER_ADDRES)]);
        await transfer.deployed();
        console.log("Transfer deployed to:", transfer.address);
    });

task("transferNFT", "Sender NFT")
    .addParam("contract", "contract address ")
    .addParam("nftid", "NFT ID ")
    .addParam("class", "NFT denom class id ")
    .addParam("destchain", "dest chain ")
    .addParam("relaychain", "relaye chain ")
    .addParam("receiver", "Recipient address")
    .setAction(async (taskArgs, hre) => {
        const transferFactory = await hre.ethers.getContractFactory('Transfer')

        const transfer = await transferFactory.attach(taskArgs.contract);
        const tokenID = BigNumber.from(taskArgs.nftid)
        let transferdata = {
            tokenId: tokenID,
            receiver: taskArgs.receiver,
            class: taskArgs.class,
            destChain: taskArgs.destchain,
            relayChain: taskArgs.relaychain
        }
        let res = await transfer.sendTransfer(transferdata);
        console.log(await res.wait())
    });

module.exports = {};
