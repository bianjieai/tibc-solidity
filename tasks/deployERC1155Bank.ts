import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config"
const config = require('./config')

task("deployERC1155Bank", "Deploy ERC1155Bank")
    .addParam("owner", "Contract owner")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const erc1155BankFactory = await hre.ethers.getContractFactory('ERC1155Bank')
            const bank = await hre.upgrades.deployProxy(erc1155BankFactory, [taskArgs.owner]);
            await bank.deployed();
            console.log("ERC1155Bank deployed to:", bank.address);
            env.ERC1155BANK_ADDRES = bank.address
        },true)
    });

module.exports = {};