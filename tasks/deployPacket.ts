import "@nomiclabs/hardhat-web3";
import { ethers } from "hardhat";
import { task, types } from "hardhat/config"

task("deployPacket", "Deploy Packet")
.setAction(async (taskArgs, hre) => {
    const packetFactory = await hre.ethers.getContractFactory('Packet')

    const packet = await packetFactory.deploy();
    await packet.deployed();
    console.log("Packet deployed to:", packet.address);
});

module.exports = {};
