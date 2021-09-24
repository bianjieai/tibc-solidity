import { Signer } from "ethers";
import chai from "chai";
import { ERC1155Bank } from '../typechain';

const { expect } = chai;
const { ethers } = require("hardhat");

describe('ERC1155Bank', function () {

    let accounts: Signer[]
    let erc1155Bank: ERC1155Bank
    let addr1
    let addr2


    before('deploy ERC1155Bank', async () => {
        accounts = await ethers.getSigners();
        const factory = await ethers.getContractFactory("ERC1155Bank", accounts[0]);
        erc1155Bank = (await factory.deploy()) as ERC1155Bank
    })


    const data = '0x12345678';

    it("mint", async function () {
        addr1 = await accounts[0].getAddress();
        await erc1155Bank.mint(addr1, 1, 1, data);
    })

    it("burn", async function () {
        addr1 = await accounts[0].getAddress();
        await erc1155Bank.mint(addr1, 2, 1, data);

        await erc1155Bank.burn(addr1, 2, 1)
    })


    it("transferFrom", async function () {
        addr1 = await accounts[0].getAddress();
        await erc1155Bank.mint(addr1, 33, 1, data);

        addr2 = await accounts[1].getAddress();

        await erc1155Bank.transferFrom(addr1, addr2, 33, 1, data);
    })
})

