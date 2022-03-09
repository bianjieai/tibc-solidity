import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config"
const config = require('./config')

task("deployAcessManager", "Deploy acessManager")
    .addParam("wallet", "multi sign address")
    .setAction(async (taskArgs, hre) => {
        const accessManagerFactory = await hre.ethers.getContractFactory('AccessManager')
        const accessManager = await hre.upgrades.deployProxy(accessManagerFactory,
            [taskArgs.wallet]);
        await accessManager.deployed();
        console.log("AccessManager deployed to:", accessManager.address);
        await config.load(function (env: any) {
            env.accessManagerAddress = accessManager.address
        },true)
    });

module.exports = {};