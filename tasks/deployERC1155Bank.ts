import "@nomiclabs/hardhat-web3";
import { task, types } from "hardhat/config"

task("deployERC1155Bank", "Deploy ERC1155Bank")
.setAction(async (taskArgs, hre) => {
    const erc1155BankFactory = await hre.ethers.getContractFactory('ERC1155Bank')

    const bank = await erc1155BankFactory.deploy();
    await bank.deployed();
    console.log("ERC1155Bank deployed to:", bank.address);
});

module.exports = {};
