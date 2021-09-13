import "@nomiclabs/hardhat-web3";
import { ethers } from "hardhat";
import { task, types } from "hardhat/config"

task("deployClientManager", "Deploy Client Manager")
.setAction(async (taskArgs, hre) => {
    const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

    const clientManager = await clientManagerFactory.deploy();
    await clientManager.deployed();
    console.log("Client Manager deployed to:", clientManager.address);
    console.log("export CLIENT_MANAGER_ADDRES=%s",clientManager.address);
});

module.exports = {};
