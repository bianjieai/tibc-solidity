import "@nomiclabs/hardhat-web3";
import { error } from "console";
import { task, types } from "hardhat/config"
const config = require('./config')

task("deployRouting", "Deploy Routing")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const routingFactory = await hre.ethers.getContractFactory('Routing')
            const routing = await hre.upgrades.deployProxy(routingFactory, [env.contract.accessManagerAddress]);
            await routing.deployed();
            console.log("Routing deployed to:", routing.address);
            env.contract.routingAddress = routing.address
        },true)
    });

task("setRoutingRules", "Set Routing Rules")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const routingFactory = await hre.ethers.getContractFactory('Routing')
            const routing = await routingFactory.attach(env.contract.routingAddress);
            let rules: string[] = env.network.rules.split("|")
            const result = await routing.setRoutingRules(rules)
            console.log(result);
        })
    });

task("addRouting", "Add module routing")
    .addParam("module", "module name")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const routingFactory = await hre.ethers.getContractFactory('Routing')
            const routing = await routingFactory.attach(env.contract.routingAddress);

            var moduleAddress = env.contract.modules[taskArgs.module]
            if (taskArgs.module == "NFT") {
                moduleAddress = env.contract.transferNFTAddress
            } else if (taskArgs.module == "MT") {
                moduleAddress = env.contract.transferMTAddress
            }else {
                throw error("module address not found")
            }
            const result = await routing.addRouting(taskArgs.module, moduleAddress)
            console.log(result);
        })
    });
module.exports = {};
