import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config";
const config = require('./config');

// accessRole
const relayerRole = "7d1460b63cf4a7c6c430432e77ee5362c0ab212bae6ee332cd661bb15f52c809";
const ruleRole = "eb0b46a2e1d224b88ad29174ad4028f054fb34998baa02c3166d005c7b752c3f";
const clientRole = "cf83526043951e0ae3bc5b11e7a485f61baaf17277b2ad0841e35d5abe0d05fd";
const routerRole = "1f5d5d13d11690c734f3783b436f0f33696a050aed979e5362a3c49324de4427";

task("deployAcessManager", "Deploy acessManager")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const accessManagerFactory = await hre.ethers.getContractFactory('AccessManager')
            const accessManager = await hre.upgrades.deployProxy(accessManagerFactory,
                [env.multiSignWalletAddress]);
            await accessManager.deployed();
            console.log("AccessManager deployed to:", accessManager.address);
            env.contract.accessManagerAddress = accessManager.address
        }, true)
    });

task("grantRoleForAccessManager", "grant Role For AccessManager")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {

            const accessManagerFactory = await hre.ethers.getContractFactory('AccessManager');
            const accessManager = await accessManagerFactory.attach(env.contract.accessManagerAddress);

            const roles = [
                Buffer.from(relayerRole, "hex"),
                Buffer.from(ruleRole, "hex"),
                Buffer.from(clientRole, "hex"),
                Buffer.from(routerRole, "hex"),
            ];

            const accounts = [
                env.contract.accessManagerAddress,
                env.contract.accessManagerAddress,
                env.contract.accessManagerAddress,
                env.contract.accessManagerAddress,
            ];

            const result = await accessManager.batchGrantRole(roles, accounts);
            console.log(result);

        }, true)
    });

task("getRoleFromAccessManager", "grant Role For transfer MT ")
.addParam("role", "role name ")
.addParam("account", "account address")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const accessManagerFactory = await hre.ethers.getContractFactory('AccessManager');
            const accessManager = await accessManagerFactory.attach(env.contract.accessManagerAddress);
            const role = Buffer.from(taskArgs.role, "hex");
            
            const prefix = taskArgs.account.slice(0,2);
            let account = taskArgs.account;
            if (prefix == "0x"){
                 account = account.slice(2);
            }

            const result = await accessManager.hasRole(role, account);
            console.log(result);
        }, true)
    });

module.exports = {};