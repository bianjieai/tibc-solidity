import { Signer } from "ethers";
import chai from "chai";


import {Transfer, ERC1155Bank, Packet} from '../typechain';
import { randomBytes } from "crypto";

const { expect } = chai;
const { ethers } = require("hardhat");

let nft = require("./proto/nftTransfer.js");

describe('Transfer', () => {

    let accounts: Signer[]
    let transfer: Transfer
    let erc1155bank : ERC1155Bank
    let pac : Packet

    before('deploy Transfer', async () => {
        accounts = await ethers.getSigners();
        const erc1155Fac = await ethers.getContractFactory("ERC1155Bank", accounts[0]);
        erc1155bank = (await erc1155Fac.deploy()) as ERC1155Bank;

        const pacFac = await ethers.getContractFactory("Packet", accounts[0]);
        pac = (await pacFac.deploy()) as Packet;


        const tsFac = await ethers.getContractFactory("Transfer", accounts[0]);
        transfer = (await tsFac.deploy(erc1155bank.address, pac.address)) as Transfer
        
        console.log("aaaa:",(await accounts[0].getAddress()).toString());
       
    });
   


    // receive packet from irishub 
    it("onRecvPacket: from irishub to ethereum", async function () {
       let sender = (await accounts[0].getAddress()).toString();
       let receiver = (await accounts[1].getAddress()).toString();

       let data = {
           class : "tibc/nft/wenchang/kitty",
           id    : "tokenid",
           uri   : "www.test.com",
           sender: sender,
           receiver : receiver,
           awayFromOrigin : true
       }

       let databytes = nft.NftTransfer.encode(data).finish();

       let packet = {
           sequence : 1,
           port : "nft",
           sourceChain : "irishub",
           destChain : "ethereum",
           relayChain : "",
           data : databytes,
        };

        let res = await transfer.onRecvPacket(packet);
        console.log("res:", res);
    })


    // send nft back to irishub from ethereum 
    it("onRecvPacket: from irishub to ethereum", async function () {
        let tokenId = "0x746f6b656e696400000000000000000000000000000000000000000000000000";
        let receiver = (await accounts[1].getAddress()).toString()
        let cls = "tibc/nft/wenchang/irishub/kitty";
        let destChain = "irishub";
        let relayChain = "";

        let res = await transfer.sendTransfer(tokenId, receiver, cls, destChain, relayChain);
        console.log("res:", res);
    })

    
})