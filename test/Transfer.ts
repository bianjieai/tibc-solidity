import { Signer } from "ethers";
import chai from "chai";


import {Transfer, ERC1155Bank, Packet, ClientManager, Routing} from '../typechain';
import { randomBytes } from "crypto";

const { expect } = chai;
const { ethers } = require("hardhat");

let nft = require("./proto/nftTransfer.js");

describe('Transfer', () => {
    let mRules: string[] = ["bsn-hub,iris-hub,nft", "iris-hub,bsn-hub,*"]
    let accounts: Signer[]
    let transfer: Transfer
    let erc1155bank : ERC1155Bank
    let pac : Packet
    let clientManager : ClientManager
    let routing : Routing

    before('deploy Transfer', async () => {
        accounts = await ethers.getSigners();

        const stringsFac = await ethers.getContractFactory("Strings");
        const strs = await stringsFac.deploy();
        await strs.deployed();

        const hostFac = await ethers.getContractFactory("Host");

        const host = await hostFac.deploy();
        await host.deployed();

        const clientFac = await ethers.getContractFactory("ClientManager");
        clientManager = (await clientFac.deploy()) as ClientManager;

        const routingFac = await ethers.getContractFactory("Routing");
        routing = (await routingFac.deploy(mRules)) as Routing;

        const pacFac = await ethers.getContractFactory("Packet",{signer: accounts[0],
            libraries: {
                Strings : strs.address
            }
        });
        pac = (await pacFac.deploy(clientManager.address, routing.address)) as Packet;

        const erc1155Fac = await ethers.getContractFactory("ERC1155Bank");
        erc1155bank = (await erc1155Fac.deploy()) as ERC1155Bank;

    

        const tsFac = await ethers.getContractFactory("Transfer");
        transfer = (await tsFac.deploy(erc1155bank.address, pac.address, clientManager.address)) as Transfer;
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
        let sender = (await accounts[0].getAddress()).toString();
        await erc1155bank.mint(sender, 1, 1, "0x123456");
        let transferdata = {
            tokenId : 1,
            receiver : (await accounts[1].getAddress()).toString(),
            class : "tibc/nft/wenchang/irishub/kitty",
            destChain : "irishub",
            relayChain: ""
        }

        let res = await transfer.sendTransfer(transferdata);

        let balance = await erc1155bank.balanceOf(sender, 1);
        expect(balance).to.eq(0);
    })


     
    // The test need fix the tokenID in the refundToken
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