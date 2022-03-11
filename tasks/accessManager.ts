import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config"
const config = require('./config')

task("deployAcessManager", "Deploy acessManager")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const accessManagerFactory = await hre.ethers.getContractFactory('AccessManager')
            const accessManager = await hre.upgrades.deployProxy(accessManagerFactory,
                [env.multiSignWalletAddress]);
            await accessManager.deployed();
            console.log("AccessManager deployed to:", accessManager.address);
            env.contract.accessManagerAddress = accessManager.address
        },true)
    });

module.exports = {};