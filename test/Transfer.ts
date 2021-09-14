import { Signer } from "ethers";
import chai from "chai";


import {Transfer, ERC1155Bank, Packet, ClientManager, Routing, Tendermint} from '../typechain';
import { randomBytes } from "crypto";

const { expect } = chai;
const { ethers } = require("hardhat");

let nft = require("./proto/nftTransfer.js");
let client = require("./proto/compiled.js");

describe('Transfer', () => {
    let mRules: string[] = ["bsn-hub,iris-hub,nft", "iris-hub,bsn-hub,*"]
    let accounts: Signer[]
    let transfer: Transfer
    let erc1155bank : ERC1155Bank
    let pac : Packet
    let clientManager : ClientManager
    let routing : Routing
    let tendermint: Tendermint

    before('deploy Transfer', async () => {
        accounts = await ethers.getSigners();
        const chainName = "irishub"

        const stringsFac = await ethers.getContractFactory("Strings");
        const strs = await stringsFac.deploy();
        await strs.deployed();

        const hostFac = await ethers.getContractFactory("Host");

        const host = await hostFac.deploy();
        await host.deployed();

        // deploy clientManager
        await deployContract();

        // create light client
        let clientState = {
            chainId: "chain-f6C1TF",
            trustLevel: {
                numerator: 1,
                denominator: 3
            },
            trustingPeriod: 10 * 24 * 60 * 60,
            unbondingPeriod: 1814400,
            maxClockDrift: 10,
            latestHeight: {
                revisionNumber: 0,
                revisionHeight: 3893
            },
            merklePrefix: {
                key_prefix: Buffer.from("74696263", "hex"),
            },
            timeDelay: 10,
        };

        let consensusState = {
            timestamp: {
                secs: 1631155726,
                nanos: 5829,
            },
            root: Buffer.from("gd17k2js3LzwChS4khcRYMwVFWMPQX4TfJ9wG3MP4gs=", "base64"),
            nextValidatorsHash: Buffer.from("B1fwvGc/jfJtYdPnS7YYGsnfiMCaEQDG+t4mRgS0xHg=", "base64")
        }
        await createClient(chainName, tendermint.address, clientState, consensusState)


        const routingFac = await ethers.getContractFactory("Routing");
        routing = (await routingFac.deploy()) as Routing;

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
         
    const deployContract = async function () {
        accounts = await ethers.getSigners();
        const msrFactory = await ethers.getContractFactory('ClientManager', {
            signer: accounts[0],
            libraries: {},
        })
        clientManager = (await msrFactory.deploy("ethereum")) as ClientManager

        let originChainName = await clientManager.getChainName();
        expect(originChainName).to.eq("ethereum")

        const ClientStateCodec = await ethers.getContractFactory('ClientStateCodec')
        const clientStateCodec = await ClientStateCodec.deploy();
        await clientStateCodec.deployed();

        const ConsensusStateCodec = await ethers.getContractFactory('ConsensusStateCodec')
        const consensusStateCodec = await ConsensusStateCodec.deploy();
        await consensusStateCodec.deployed();

        const HeaderCodec = await ethers.getContractFactory('HeaderCodec')
        const headerCodec = await HeaderCodec.deploy();
        await headerCodec.deployed();

        const ProofCodec = await ethers.getContractFactory('ProofCodec')
        const proofCodec = await ProofCodec.deploy();
        await proofCodec.deployed();

        const Verifier = await ethers.getContractFactory('Verifier', {
            signer: accounts[0],
            libraries: {
                ProofCodec: proofCodec.address,
            },
        })
        const verifierLib = await Verifier.deploy();
        await verifierLib.deployed();

        const tmFactory = await ethers.getContractFactory('Tendermint', {
            signer: accounts[0],
            libraries: {
                ClientStateCodec: clientStateCodec.address,
                ConsensusStateCodec: consensusStateCodec.address,
                HeaderCodec: headerCodec.address,
                Verifier: verifierLib.address
            },
        })
        tendermint = (await tmFactory.deploy(clientManager.address)) as Tendermint
    }

    const createClient = async function (chainName: string, lightClientAddress: any, clientState: any, consensusState: any) {
        let clientStateBuf = client.ClientState.encode(clientState).finish();
        let consensusStateBuf = client.ConsensusState.encode(consensusState).finish();
        await clientManager.createClient(chainName, lightClientAddress, clientStateBuf, consensusStateBuf)
    }
    
})