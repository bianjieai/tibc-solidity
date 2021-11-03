import "@nomiclabs/hardhat-web3";
import { task, types } from "hardhat/config";
import { BigNumber } from "ethers";

const CLIENT_MANAGER_ADDRES = process.env.CLIENT_MANAGER_ADDRES;
const PACKET_ADDRES = process.env.PACKET_ADDRES;

task("deployNFTTransfer", "Deploy NFT Transfer")
    .setAction(async (taskArgs, hre) => {
        const transferFactory = await hre.ethers.getContractFactory('Transfer')
        const transfer = await hre.upgrades.deployProxy(transferFactory,
            [
                String(PACKET_ADDRES),
                String(CLIENT_MANAGER_ADDRES)
            ]);
        await transfer.deployed();
        console.log("Transfer deployed to:", transfer.address);
        console.log("export TRANSFER_ADDRES=%s", transfer.address);
    });

task("transferNFT", "Sender NFT")
    .addParam("transfer", "transferNft contract address ")
    .addParam("destContract", "erc1155 contract address ")
    .addParam("nftid", "nft token id")
    .addParam("destchain", "dest chain name")
    .addParam("receiver", "receiver address")
    .addParam("relaychain", "relay chain name", "", types.string, true)
    .setAction(async (taskArgs, hre) => {
        const transferFactory = await hre.ethers.getContractFactory('Transfer')
        const transfer = await transferFactory.attach(taskArgs.transfer);
        const tokenID = BigNumber.from(taskArgs.nftid)
        const erc1155BankFactory = await hre.ethers.getContractFactory('ERC1155Bank')
        const erc1155Bank = await erc1155BankFactory.attach(taskArgs.erc1155);
        const originToken = await transfer.getBinding(tokenID);

        let transferdata = {
            tokenId: tokenID,
            receiver: taskArgs.receiver,
            class: originToken.class,
            destChain: taskArgs.destchain,
            relayChain: taskArgs.relaychain,
            destContract: erc1155Bank.address,
        }
        let res = await transfer.sendTransfer(transferdata);
        console.log(await res.wait())
    });

module.exports = {};
