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
    it("sendTransfer: send nft back to irishub from ethereum", async function () {
        let sender = (await accounts[0].getAddress()).toString()
        await erc1155bank.mint(sender, 1, 1, "0x123456");
        let tokenId = 1;
        let receiver = (await accounts[1].getAddress()).toString()
        let cls = "tibc/nft/wenchang/irishub/kitty";
        let destChain = "irishub";
        let relayChain = "";

        let res = await transfer.sendTransfer(tokenId, receiver, cls, destChain, relayChain);
    })

     
    // The test can fix the tokenID in the refundToken
    it("onAcknowledgementPacket when awayFromOrigin is false", async function () {
       let sender = (await accounts[0].getAddress()).toString();
       let receiver = (await accounts[1].getAddress()).toString();

       let data = {
           class : "tibc/nft/wenchang/irishub/kitty",
           id    : "tokenid",
           uri   : "www.test.com",
           sender: sender,
           receiver : receiver,
           awayFromOrigin : false
       }

        let databytes = nft.NftTransfer.encode(data).finish();
        let packet = {
            sequence : 1,
            port : "nft",
            sourceChain : "ethereum",
            destChain : "irishub",
            relayChain : "",
            data : databytes,
         };
         let acknowledgement = "0x00";


         // mint 
        await erc1155bank.mint(sender, 2, 1, "0x123456");
        let balance = await erc1155bank.balanceOf(sender, 2);
        expect(balance).to.eq(1);
         // burn 
         await erc1155bank.burn(sender, 2, 1);
         let balance1 = await erc1155bank.balanceOf(sender, 2);
        expect(balance1).to.eq(0);

         await transfer.onAcknowledgementPacket(packet, acknowledgement);
         let balance3 = await erc1155bank.balanceOf(sender, 2);
         
        })
         

        it("onAcknowledgementPacket when awayFromOrigin is true", async function () {
            let sender = (await accounts[0].getAddress()).toString();
            let receiver = (await accounts[1].getAddress()).toString();
     
            let data = {
                class : "kitty",
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
                 sourceChain : "ethereum",
                 destChain : "irishub",
                 relayChain : "",
                 data : databytes,
              };
              let acknowledgement = "0x01";
     
     
              // mint 
             await erc1155bank.mint(sender, 88, 1, "0x123456");
             
              // lock 
              await erc1155bank.transferFrom(sender, transfer.address, 88, 1, "0x123456");

              let balance1 = await erc1155bank.balanceOf(transfer.address, 88);
              expect(balance1).to.eq(1);

              let balance2 = await erc1155bank.balanceOf(sender, 88);
              expect(balance2).to.eq(0);
     
              await transfer.onAcknowledgementPacket(packet, acknowledgement);
        
    })
         

    
})