import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config"
const config = require('./config')


task("deployPacket", "Deploy Packet")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const packetFactory = await hre.ethers.getContractFactory('Packet')
            const packet = await hre.upgrades.deployProxy(packetFactory,
                [
                    env.contract.clientManagerAddress,
                    env.contract.routingAddress
                ]);
            await packet.deployed();
            console.log("Packet deployed to:", packet.address);
            env.contract.packetAddress = packet.address
        },true)
    });

module.exports = {};
