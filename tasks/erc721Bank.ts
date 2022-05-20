import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config";
import { BigNumber } from "ethers";
const config = require('./config');

// transferRole
const mintRole = "9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const burnRole = "3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848"


task("deployERC721Bank", "Deploy ERC721Bank")
    .addParam("owner", "Contract owner")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const erc721BankFactory = await hre.ethers.getContractFactory('ERC721Bank')
            const bank = await hre.upgrades.deployProxy(erc721BankFactory, [taskArgs.owner]);
            await bank.deployed();
            console.log("ERC721Bank deployed to:", bank.address);
            env.contract.erc721BankAddress = bank.address
        }, true)
    });

task("grantRoleFromERC721", "grant Role For transfer MT ")
    .addParam("account", "account to grant role")
    .addParam("role", "role : [mint, burn]")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {

            const erc721BankFactory = await hre.ethers.getContractFactory('ERC721Bank');
            const erc721BankMnager = await erc721BankFactory.attach(env.contract.erc721BankAddress);

            let role = Buffer.from(mintRole, "hex");
            if (taskArgs.role == "burn") {
                role = Buffer.from(burnRole, "hex");
            } else if (taskArgs.role != "burn" && taskArgs.role != "mint") {
                console.log("role does not exist")
                return
            }

            const account = taskArgs.account;

            const result = await erc721BankMnager.grantRole(role, account)
            console.log(result);

        }, true)
    });

task("getRoleFromERC721Bank", "grant Role For transfer MT ")
    .addParam("role", "role name ")
    .addParam("account", "account address")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const erc721BankFactory = await hre.ethers.getContractFactory('ERC721Bank');
            const erc721BankMnager = await erc721BankFactory.attach(env.contract.erc721BankAddress);

            let role = Buffer.from(mintRole, "hex");
            if (taskArgs.role == "burn") {
                role = Buffer.from(burnRole, "hex");
            } else if (taskArgs.role != "burn" && taskArgs.role != "mint") {
                console.log("role does not exist")
                return
            }

            const result = await erc721BankMnager.roles(role, taskArgs.account);
            console.log(result);
        }, true)
    });


task("mintNFT", "mint NFT")
    .addParam("account", "NFT Account ")
    .addParam("id", "NFT ID ")
    .addParam("data", " NFT URI ")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const erc721BankFactory = await hre.ethers.getContractFactory('ERC721Bank');
            const erc721BankMnager = await erc721BankFactory.attach(env.contract.erc721BankAddress);
            const result = await erc721BankMnager.mint(
                taskArgs.account,
                taskArgs.id,
                Buffer.from(taskArgs.data)
            );
            console.log(result);
        }, true)
    });


task("getNFTURIFromERC721", "mint NFT")
    .addParam("id", "NFT ID ")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const erc721BankFactory = await hre.ethers.getContractFactory('ERC721Bank');
            const erc721BankMnager = await erc721BankFactory.attach(env.contract.erc721BankAddress);
            const tokenID = BigNumber.from(taskArgs.id)
            const result = await erc721BankMnager.tokenURI(tokenID);
            console.log(result);
        }, true)
    });

task("setApprovedFromERC721", "set Approved")
    .addParam("operator", "NFT operator ")
    .addParam("id", "NFT ID ")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const erc721BankFactory = await hre.ethers.getContractFactory('ERC721Bank');
            const erc721BankMnager = await erc721BankFactory.attach(env.contract.erc721BankAddress);
            const result = await erc721BankMnager.approve(taskArgs.operator, taskArgs.id);
            console.log(result);
        }, true)
    });

task("getApprovedFromERC721", "get Approved")
    .addParam("id", "NFT ID ")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const erc721BankFactory = await hre.ethers.getContractFactory('ERC721Bank');
            const erc721BankMnager = await erc721BankFactory.attach(env.contract.erc721BankAddress);
            const result = await erc721BankMnager.getApproved(taskArgs.id);
            console.log(result);
        }, true)
    });


module.exports = {};