import "@nomiclabs/hardhat-web3";
import { task, types } from "hardhat/config"

const CLIENT_MANAGER_ADDRES = process.env.CLIENT_MANAGER_ADDRES;
const PACKET_ADDRES = process.env.PACKET_ADDRES;
const ERC1155BANK_ADDRES = process.env.ERC1155BANK_ADDRES;

task("deployNFTTransfer", "Deploy NFT Transfer")
.setAction(async (taskArgs, hre) => {
    const transferFactory = await hre.ethers.getContractFactory('Transfer')

    const transfer = await hre.upgrades.deployProxy(transferFactory,[String(ERC1155BANK_ADDRES), String(PACKET_ADDRES), String(CLIENT_MANAGER_ADDRES)]);
    await transfer.deployed();
    console.log("Transfer deployed to:", transfer.address);
});

module.exports = {};
