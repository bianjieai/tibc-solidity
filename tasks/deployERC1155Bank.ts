import "@nomiclabs/hardhat-web3";
import { task, types } from "hardhat/config"

task("deployERC1155Bank", "Deploy ERC1155Bank")
.setAction(async (taskArgs, hre) => {
    const erc1155BankFactory = await hre.ethers.getContractFactory('ERC1155Bank')

    const bank = await hre.upgrades.deployProxy(erc1155BankFactory);
    await bank.deployed();
    console.log("ERC1155Bank deployed to:", bank.address);
    console.log("export ERC1155BANK_ADDRES=%s", bank.address);

    let accounts = await hre.ethers.getSigners()
    let res = await  bank.mint(accounts[0].address,4,1,Buffer.from("0x00","hex"))
    console.log(res)

    let res2 = await bank.setMapValue(4,"tibc/nft/irishub/kittye","irishub-tokenId", "http://114.55.124.92:8081/api/1")
});

module.exports = {};
