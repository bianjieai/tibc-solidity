import "@nomiclabs/hardhat-web3";
import { ethers, upgrades } from "hardhat";
import { task, types } from "hardhat/config"
import { readFileSync } from 'fs';

const CLIENT_MANAGER_ADDRES = process.env.CLIENT_MANAGER_ADDRES;

let client = require("../test/proto/compiled.js");

task("deployClientManager", "Deploy Client Manager")
    .addParam("chain", "Chain Name")
    .setAction(async (taskArgs, hre) => {
        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await hre.upgrades.deployProxy(clientManagerFactory, [taskArgs.chain]);
        await clientManager.deployed();
        console.log("Client Manager deployed to:", clientManager.address);
        console.log("export CLIENT_MANAGER_ADDRES=%s", clientManager.address);
    });

task("upgradeClientManager", "Upgrade Client Manager")
    .addParam("chain", "Chain Name")
    .setAction(async (taskArgs, hre) => {
        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await hre.upgrades.upgradeProxy(String(CLIENT_MANAGER_ADDRES), clientManagerFactory);
        await clientManager.deployed();
        console.log("Client Manager upgraded to:", clientManager.address);
        console.log("export CLIENT_MANAGER_ADDRES=%s", clientManager.address);
    });
task("createClientFromFile", "Deploy Client Manager")
    .addParam("chain", "Chain Name")
    .addParam("client", "Client Address")
    .addParam("clientstate", "HEX encoding client client")
    .addParam("consensusstate", "HEX encoding consensus state")
    .setAction(async (taskArgs, hre) => {
    
        const clientStatebytes = await readFileSync(taskArgs.clientstate);

        const consensusStateBytes = await  readFileSync(taskArgs.consensusstate);

        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await clientManagerFactory.attach(String(CLIENT_MANAGER_ADDRES));

        const clientStateObj = JSON.parse(clientStatebytes.toString())

        const clientStateEncode = {
            chainId: clientStateObj.chainId,
            trustLevel: {
                numerator: clientStateObj.trustLevel.numerator,
                denominator: clientStateObj.trustLevel.denominator
            },

            trustingPeriod: clientStateObj.trustingPeriod,
            unbondingPeriod: clientStateObj.unbondingPeriod,
            maxClockDrift: clientStateObj.maxClockDrift,
            latestHeight: {
                revisionNumber: clientStateObj.latestHeight.revisionNumber,
                revisionHeight: clientStateObj.latestHeight.revisionHeight
            },
            merklePrefix: {
                keyPrefix: Buffer.from("tibc"),
            },
            timeDelay: 10,
        }


        const clientState = client.ClientState.encode(clientStateEncode).finish();

        const consensusStateObj = JSON.parse(consensusStateBytes.toString())

        const consensusStateEncode = {
            timestamp: {
                secs: consensusStateObj.timestamp.secs,
                nanos: consensusStateObj.timestamp.nanos,
            },
            root: Buffer.from(consensusStateObj.root, "hex"),
            nextValidatorsHash: Buffer.from(consensusStateObj.nextValidatorsHash, "hex")
        }

        const consensusState = client.ConsensusState.encode(consensusStateEncode).finish();

        const result = await clientManager.createClient(
            taskArgs.chain,
            taskArgs.client,
            clientState,
            consensusState);
        console.log(result);

    });

task("createClient", "Deploy Client Manager")
    .addParam("chain", "Chain Name")
    .addParam("client", "Client Address")
    .addParam("clientstate", "HEX encoding client client")
    .addParam("consensusstate", "HEX encoding consensus state")
    .setAction(async (taskArgs, hre) => {

        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await clientManagerFactory.attach(String(CLIENT_MANAGER_ADDRES));

        const clientStatebytes = Buffer.from(taskArgs.clientstate, "hex")

        const clientStateObj = JSON.parse(clientStatebytes.toString())

        const clientStateEncode = {
            chainId: clientStateObj.chainId,
            trustLevel: {
                numerator: clientStateObj.trustLevel.numerator,
                denominator: clientStateObj.trustLevel.denominator
            },

            trustingPeriod: clientStateObj.trustingPeriod,
            unbondingPeriod: clientStateObj.unbondingPeriod,
            maxClockDrift: clientStateObj.maxClockDrift,
            latestHeight: {
                revisionNumber: clientStateObj.latestHeight.revisionNumber,
                revisionHeight: clientStateObj.latestHeight.revisionHeight
            },
            merklePrefix: {
                keyPrefix: Buffer.from("tibc"),
            },
            timeDelay: 10,
        }


        const clientState = client.ClientState.encode(clientStateEncode).finish();

        const consensusStateBytes = Buffer.from(taskArgs.consensusstate, "hex")

        const consensusStateObj = JSON.parse(consensusStateBytes.toString())

        const consensusStateEncode = {
            timestamp: {
                secs: consensusStateObj.timestamp.secs,
                nanos: consensusStateObj.timestamp.nanos,
            },
            // root: Buffer.from("YXBwX2hhc2g=", "base64"),
            root: Buffer.from(consensusStateObj.root, "hex"),
            nextValidatorsHash: Buffer.from(consensusStateObj.nextValidatorsHash, "hex")
        }

        const consensusState = client.ConsensusState.encode(consensusStateEncode).finish();

        const result = await clientManager.createClient(
            taskArgs.chain,
            taskArgs.client,
            clientState,
            consensusState);
        console.log(result);

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

task("updateClient", "Deploy Client Manager")
    .addParam("chain", "chain name")
    .addParam("header", "HEX encoding header")
    .setAction(async (taskArgs, hre) => {

        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await clientManagerFactory.attach(String(CLIENT_MANAGER_ADDRES));

        const result = await clientManager.updateClient(taskArgs.chain, Buffer.from(taskArgs.header, "hex"))

        console.log(await result.wait());
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
