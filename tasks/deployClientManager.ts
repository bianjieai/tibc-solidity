import "@nomiclabs/hardhat-web3";
import { task, types } from "hardhat/config"
const config = require('./config')

let client = require("../test/proto/compiled.js");

task("deployClientManager", "Deploy Client Manager")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')
            const clientManager = await hre.upgrades.deployProxy(clientManagerFactory, [
                env.network.nativeChainName,
                env.contract.accessManagerAddress
            ]);
            await clientManager.deployed();
            console.log("Client Manager deployed to:", clientManager.address);
            env.contract.clientManagerAddress = clientManager.address
        }, true)
    });

task("upgradeClientManager", "Upgrade Client Manager")
    .addParam("chain", "Chain Name")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')
            const clientManager = await hre.upgrades.upgradeProxy(
                env.contract.clientManagerAddress,
                clientManagerFactory
            );
            await clientManager.deployed();
            console.log("Client Manager upgraded to:", clientManager.address);
            env.contract.clientManagerAddress = clientManager.address
        })
    });
task("createClient", "Deploy Client Manager")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')
            const clientManager = await clientManagerFactory.attach(env.contract.clientManagerAddress);
            const clientStatebytes = Buffer.from(env.network.clientstate, "hex")
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
                timeDelay: 0,
            }


            const clientState = client.ClientState.encode(clientStateEncode).finish();
            const consensusStateBytes = Buffer.from(env.network.consensusstate, "hex")
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
                env.network.counterpartyChainName,
                env.contract.tmLightClientAddress,
                clientState,
                consensusState);
            console.log(result);
        }, true)
    });

task("registerRelayer", "Deploy Client Manager")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')
            const clientManager = await clientManagerFactory.attach(env.contract.clientManagerAddress);
            const result = await clientManager.registerRelayer(
                env.network.counterpartyChainName,
                env.network.relayerAddress
            );
            console.log(result);
        })
    });

task("updateClient", "Deploy Client Manager")
    .addParam("header", "HEX encoding header")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')
            const clientManager = await clientManagerFactory.attach(env.contract.clientManagerAddress);
            const result = await clientManager.updateClient(env.network.counterpartyChainName, Buffer.from(taskArgs.header, "hex"))
            console.log(await result.wait());
        })
    });

task("getClient", "Deploy Client Manager")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')
            const clientManager = await clientManagerFactory.attach(env.contract.clientManagerAddress);
            const result = await clientManager.getClient(
                env.network.counterpartyChainName,
            )
            console.log(await result.wait());
        })
    });

task("getRelayers", "Deploy Client Manager")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')
            const clientManager = await clientManagerFactory.attach(env.contract.clientManagerAddress);
            const result = await clientManager.relayers(
                env.network.counterpartyChainName,
                env.network.relayerAddress
            )
            console.log(result);
        })
    });

task("lastheight", "Deploy Client Manager")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')
            const clientManager = await clientManagerFactory.attach(env.contract.clientManagerAddress);
            const result = await clientManager.getLatestHeight(env.network.counterpartyChainName)
            console.log(result);
        })
    });

module.exports = {};
