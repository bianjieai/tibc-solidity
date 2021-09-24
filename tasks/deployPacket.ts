import "@nomiclabs/hardhat-web3";
import { ethers } from "hardhat";
import { task, types } from "hardhat/config"

const CLIENT_MANAGER_ADDRES = process.env.CLIENT_MANAGER_ADDRES;
const ROUTING_ADDRES = process.env.ROUTING_ADDRES;

task("deployPacket", "Deploy Packet")
    .setAction(async (taskArgs, hre) => {
        const packetFactory = await hre.ethers.getContractFactory('Packet')

        const packet = await hre.upgrades.deployProxy(packetFactory,[String(CLIENT_MANAGER_ADDRES), String(ROUTING_ADDRES)]);
        await packet.deployed();
        console.log("Packet deployed to:", packet.address);
        console.log("export PACKET_ADDRES=%s", packet.address);
    });

module.exports = {};
