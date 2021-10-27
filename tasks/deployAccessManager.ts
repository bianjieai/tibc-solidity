import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config"

task("deployAcessManager", "Deploy acessManager")
    .addParam("wallet", "multi sign address")
    .setAction(async (taskArgs, hre) => {
        const accessManagerFactory = await hre.ethers.getContractFactory('AccessManager')
        const accessManager = await hre.upgrades.deployProxy(accessManagerFactory,
            [taskArgs.wallet]);
        await accessManager.deployed();
        console.log("AccessManager deployed to:", accessManager.address);
        console.log("export ACCESS_MANAGER_ADDRES=%s", accessManager.address);
    });

module.exports = {};