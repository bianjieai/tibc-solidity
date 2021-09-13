import "@nomiclabs/hardhat-web3";
import { ethers } from "hardhat";
import { task, types } from "hardhat/config"

task("deployRouting", "Deploy Routing")
.setAction(async (taskArgs, hre) => {
    const routingFactory = await hre.ethers.getContractFactory('Routing')

    const routing = await routingFactory.deploy();
    await routing.deployed();
    console.log("Routing deployed to:", routing.address);
});

module.exports = {};
