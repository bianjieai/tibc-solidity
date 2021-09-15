import "@nomiclabs/hardhat-web3";
import { ethers } from "hardhat";
import { task, types } from "hardhat/config"

const CLIENT_MANAGER_ADDRES = process.env.CLIENT_MANAGER_ADDRES;

task("deployClientManager", "Deploy Client Manager")
    .addParam("chain", "Chain Name")
    .setAction(async (taskArgs, hre) => {
        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await clientManagerFactory.deploy(taskArgs.chain);
        await clientManager.deployed();
        console.log("Client Manager deployed to:", clientManager.address);
        console.log("export CLIENT_MANAGER_ADDRES=%s", clientManager.address);
    });


task("createClient", "Deploy Client Manager")
    .addParam("chain", "Chain Name")
    .addParam("client", "Client Address")
    .addParam("clientState", "HEX encoding client client")
    .addParam("consensusState", "HEX encoding consensus state")
    .setAction(async (taskArgs, hre) => {

        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await clientManagerFactory.attach(String(CLIENT_MANAGER_ADDRES));

        const result = await clientManager.createClient(taskArgs.chain,
            Buffer.from(taskArgs.client, "hex"),
            Buffer.from(taskArgs.clientState, "hex"),
            taskArgs.consensusState);
        console.log(result);
    });

task("updateClient", "Deploy Client Manager")
    .addParam("chain", "chain name")
    .addParam("header", "HEX encoding header")
    .setAction(async (taskArgs, hre) => {

        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await clientManagerFactory.attach(String(CLIENT_MANAGER_ADDRES));

        const result = await clientManager.updateClient(taskArgs.chain, Buffer.from(taskArgs.header, "hex"))

        console.log(await result.wait());
    });

task("reisterRelayer", "Deploy Client Manager")
    .addParam("chain", "Chain Name")
    .addParam("relayer", "Relayer Address")
    .setAction(async (taskArgs, hre) => {

        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await clientManagerFactory.attach(String(CLIENT_MANAGER_ADDRES));

        const result = await clientManager.registerRelayer(taskArgs.chain, taskArgs.relayer);
        console.log(result);
    });

task("getRelayers", "Deploy Client Manager")
    .addParam("chain", "Chain Name")
    .addParam("relayer", "Relayer Address")
    .setAction(async (taskArgs, hre) => {

        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await clientManagerFactory.attach(String(CLIENT_MANAGER_ADDRES));

        const result = await clientManager.relayers(taskArgs.chain, taskArgs.relayer)
        console.log(result);
    });

task("lastheight", "Deploy Client Manager")
    .addParam("chain", "Chain Name")
    .setAction(async (taskArgs, hre) => {

        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await clientManagerFactory.attach(String(CLIENT_MANAGER_ADDRES));

        const result = await clientManager.getLatestHeight(taskArgs.chain)

        console.log(await result.wait());
    });

module.exports = {};
