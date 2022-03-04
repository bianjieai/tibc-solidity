import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config"
const fs = require('./utils')

const CLIENT_MANAGER_ADDRES = process.env.CLIENT_MANAGER_ADDRES;
const ROUTING_ADDRES = process.env.ROUTING_ADDRES;

task("deployPacket", "Deploy Packet")
    .setAction(async (taskArgs, hre) => {
        await fs.readAndWriteEnv(async function (env: any) {
            const packetFactory = await hre.ethers.getContractFactory('Packet')
            const packet = await hre.upgrades.deployProxy(packetFactory,
                [
                    String(CLIENT_MANAGER_ADDRES),
                    String(ROUTING_ADDRES)
                ]);
            await packet.deployed();
            console.log("Packet deployed to:", packet.address);
            env.PACKET_ADDRES = packet.address
        })
    });

module.exports = {};
