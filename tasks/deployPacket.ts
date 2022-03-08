import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config"
const fs = require('./utils')


task("deployPacket", "Deploy Packet")
    .setAction(async (taskArgs, hre) => {
        await fs.readAndWriteEnv(async function (env: any) {
            const packetFactory = await hre.ethers.getContractFactory('Packet')
            const packet = await hre.upgrades.deployProxy(packetFactory,
                [
                    String(env.CLIENT_MANAGER_ADDRES),
                    String(env.ROUTING_ADDRES)
                ]);
            await packet.deployed();
            console.log("Packet deployed to:", packet.address);
            env.PACKET_ADDRES = packet.address
        })
    });

module.exports = {};
