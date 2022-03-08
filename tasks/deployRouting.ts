import "@nomiclabs/hardhat-web3";
import { ethers } from "hardhat";
import { task, types } from "hardhat/config"
const fs = require('./utils')

const ROUTING_ADDRES = process.env.ROUTING_ADDRES;

task("deployRouting", "Deploy Routing")
    .setAction(async (taskArgs, hre) => {
        await fs.readAndWriteEnv(async function (env: any) {
            const routingFactory = await hre.ethers.getContractFactory('Routing')
            const routing = await hre.upgrades.deployProxy(routingFactory, [env.ACCESS_MANAGER_ADDRES]);
            await routing.deployed();
            console.log("Routing deployed to:", routing.address);
            env.ROUTING_ADDRES = routing.address
        })
    });

task("setRoutingRules", "Set Routing Rules")
    .addParam("rules", "routing rules")
    .setAction(async (taskArgs, hre) => {
        await fs.readEnv(async function (env: any) {
            const routingFactory = await hre.ethers.getContractFactory('Routing')
            const routing = await routingFactory.attach(env.ROUTING_ADDRES);
            let rules: string[] = taskArgs.rules.split("|")
            const result = await routing.setRoutingRules(rules)
            console.log(result);
        })
    });

task("addRouting", "Add module routing")
    .addParam("module", "module name")
    .addParam("address", "the module address handled cross-chain packet ")
    .setAction(async (taskArgs, hre) => {
        await fs.readEnv(async function (env: any) {
            const routingFactory = await hre.ethers.getContractFactory('Routing')
            const routing = await routingFactory.attach(env.ROUTING_ADDRES);
            const result = await routing.addRouting(taskArgs.module, taskArgs.address)
            console.log(result);
        })
    });
module.exports = {};
