import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config";
import { BigNumber } from "ethers";
const config = require('./config');

// transferRole
const mintRole = "9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const burnRole = "3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848"


task("deployERC1155Bank", "Deploy ERC1155Bank")
    .addParam("owner", "Contract owner")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const erc1155BankFactory = await hre.ethers.getContractFactory('ERC1155Bank')
            const bank = await hre.upgrades.deployProxy(erc1155BankFactory, [taskArgs.owner]);
            await bank.deployed();
            console.log("ERC1155Bank deployed to:", bank.address);
            env.contract.erc1155BankAddress = bank.address
        }, true)
    });

task("grantRoleFromERC1155", "grant Role For transfer MT ")
    .addParam("account", "account to grant role")
    .addParam("role", "role : [mint, burn]")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {

            const erc1155BankFactory = await hre.ethers.getContractFactory('ERC1155Bank');
            const erc1155BankMnager = await erc1155BankFactory.attach(env.contract.erc1155BankAddress);

            let role = Buffer.from(mintRole, "hex");
            if (taskArgs.role == "burn") {
                role = Buffer.from(burnRole, "hex");
            } else if (taskArgs.role != "burn" && taskArgs.role != "mint") {
                console.log("role does not exist")
                return
            }

            const account = taskArgs.account;

            const result = await erc1155BankMnager.grantRole(role, account)
            console.log(result);

        }, true)
    });

task("getRoleFromERC1155Bank", "grant Role For transfer MT ")
    .addParam("role", "role name ")
    .addParam("account", "account address")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const erc1155BankFactory = await hre.ethers.getContractFactory('ERC1155Bank');
            const erc1155BankMnager = await erc1155BankFactory.attach(env.contract.erc1155BankAddress);

            let role = Buffer.from(mintRole, "hex");
            if (taskArgs.role == "burn") {
                role = Buffer.from(burnRole, "hex");
            } else if (taskArgs.role != "burn" && taskArgs.role != "mint") {
                console.log("role does not exist")
                return
            }

            const result = await erc1155BankMnager.roles(role, taskArgs.account);
            console.log(result);
        }, true)
    });


task("mintNFT", "mint NFT")
    .addParam("account", "NFT Account ")
    .addParam("id", "NFT ID ")
    .addParam("amount", "NFT amount ")
    .addParam("data", " NFT URI ")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const erc1155BankFactory = await hre.ethers.getContractFactory('ERC1155Bank');
            const erc1155BankMnager = await erc1155BankFactory.attach(env.contract.erc1155BankAddress);
            const result = await erc1155BankMnager.mint(
                taskArgs.account,
                taskArgs.id,
                taskArgs.amount,
                Buffer.from(taskArgs.data)
            );
            console.log(result);
        }, true)
    });


task("getNFTURI", "mint NFT")
    .addParam("id", "NFT ID ")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const erc1155BankFactory = await hre.ethers.getContractFactory('ERC1155Bank');
            const erc1155BankMnager = await erc1155BankFactory.attach(env.contract.erc1155BankAddress);
            const tokenID = BigNumber.from(taskArgs.id)
            console.log(tokenID)
            const result = await erc1155BankMnager.uri(tokenID);
            console.log(result);
        }, true)
    });

module.exports = {};