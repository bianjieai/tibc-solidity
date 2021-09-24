import "@nomiclabs/hardhat-web3";
import { ethers } from "hardhat";
import { task, types } from "hardhat/config"

const ROUTING_ADDRES = process.env.ROUTING_ADDRES;

task("deployRouting", "Deploy Routing")
    .setAction(async (taskArgs, hre) => {
        const routingFactory = await hre.ethers.getContractFactory('Routing')

        const routing = await hre.upgrades.deployProxy(routingFactory);
        await routing.deployed();
        console.log("Routing deployed to:", routing.address);
        console.log("export ROUTING_ADDRES=%s", routing.address);
    });

task("setRoutingRules", "Set Routing Rules")
    .addParam("rules", "routing rules")
    .setAction(async (taskArgs, hre) => {
        const routingFactory = await hre.ethers.getContractFactory('Routing')

        const routing = await routingFactory.attach(String(ROUTING_ADDRES));

        let rules: string[] = taskArgs.rules
        const result = await routing.setRoutingRules(rules)
        console.log(result);
    });

task("addRouting", "Add module routing")
    .addParam("module", "module name")
    .addParam("address", "module address")
    .setAction(async (taskArgs, hre) => {
        const routingFactory = await hre.ethers.getContractFactory('Routing')

        const routing = await routingFactory.attach(String(ROUTING_ADDRES));

        let rules: string[] = taskArgs.rules
        const result = await routing.addRouting(taskArgs.module, taskArgs.address)
        console.log(result);
    });

module.exports = {};
