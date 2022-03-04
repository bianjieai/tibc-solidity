import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config"
const fs = require('./utils')

task("deployAcessManager", "Deploy acessManager")
    .addParam("wallet", "multi sign address")
    .setAction(async (taskArgs, hre) => {
        const accessManagerFactory = await hre.ethers.getContractFactory('AccessManager')
        const accessManager = await hre.upgrades.deployProxy(accessManagerFactory,
            [taskArgs.wallet]);
        await accessManager.deployed();
        console.log("AccessManager deployed to:", accessManager.address);
        await fs.readAndWriteEnv(function (env: any) {
            env.ACCESS_MANAGER_ADDRES = accessManager.address
        })
    });

module.exports = {};