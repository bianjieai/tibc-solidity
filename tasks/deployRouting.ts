import "@nomiclabs/hardhat-web3";
import { task, types } from "hardhat/config"
const config = require('./config')

task("deployRouting", "Deploy Routing")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const routingFactory = await hre.ethers.getContractFactory('Routing')
            const routing = await hre.upgrades.deployProxy(routingFactory, [env.accessManagerAddress]);
            await routing.deployed();
            console.log("Routing deployed to:", routing.address);
            env.routingAddress = routing.address
        },true)
    });

task("setRoutingRules", "Set Routing Rules")
    .addParam("rules", "routing rules")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const routingFactory = await hre.ethers.getContractFactory('Routing')
            const routing = await routingFactory.attach(env.routingAddress);
            let rules: string[] = taskArgs.rules.split("|")
            const result = await routing.setRoutingRules(rules)
            console.log(result);
        })
    });

task("addRouting", "Add module routing")
    .addParam("module", "module name")
    .addParam("address", "the module address handled cross-chain packet ")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const routingFactory = await hre.ethers.getContractFactory('Routing')
            const routing = await routingFactory.attach(env.routingAddress);
            const result = await routing.addRouting(taskArgs.module, taskArgs.address)
            console.log(result);
        })
    });
module.exports = {};
