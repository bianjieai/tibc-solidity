import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config"

task("deployUptickGateway", "Deploy uptickGateway")
    .addParam("owner", "Contract owner")
    .addParam("erc1155", "The address of the ERC1155Bank contract")
    .setAction(async (taskArgs, hre) => {
        const uptickGatewayFactory = await hre.ethers.getContractFactory('UptickGateway')
        const gateway = await hre.upgrades.deployProxy(uptickGatewayFactory, [taskArgs.owner, taskArgs.erc1155]);
        await gateway.deployed();
        console.log("UptickGateway deployed to:", gateway.address);
        console.log("export UptickGateway_ADDRES=%s", gateway.address);
    });

module.exports = {};