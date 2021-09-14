import "@nomiclabs/hardhat-web3";
import { task, types } from "hardhat/config"

task("deployTransfer", "Deploy Transfer")
.addParam("erc1155bank", "the erc1155Bank contract address")
.addParam("packet", "the packet contract address")
.addParam("clientmanager", "the packet contract address")
.setAction(async (taskArgs, hre) => {
    const transferFactory = await hre.ethers.getContractFactory('Transfer')

    const transfer = await transferFactory.deploy(taskArgs.erc1155bank, taskArgs.packet, taskArgs.clientmanager);
    await transfer.deployed();
    console.log("Transfer deployed to:", transfer.address);
});

module.exports = {};
