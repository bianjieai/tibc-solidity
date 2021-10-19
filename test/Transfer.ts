import { Signer, BigNumber } from "ethers";
import chai from "chai";
import { Transfer, ERC1155Bank, MockPacket, ClientManager, Routing, Tendermint } from '../typechain';
import { randomBytes } from "crypto";

const { expect } = chai;
const { ethers, upgrades } = require("hardhat");
const keccak256 = require('keccak256');

let nft = require("./proto/nftTransfer.js");
let client = require("./proto/compiled.js");
let ack = require("./proto/ack.js");

describe('Transfer', () => {
    let accounts: Signer[]
    let transfer: Transfer
    let erc1155bank: ERC1155Bank
    let mockPacket: MockPacket
    let clientManager: ClientManager
    let routing: Routing
    let tendermint: Tendermint

    before('deploy Transfer', async () => {
        accounts = await ethers.getSigners();
        const chainName = "irishub"

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
        routing = (await upgrades.deployProxy(routingFac)) as Routing;

        const mockPacketFactory = await ethers.getContractFactory("MockPacket");
        mockPacket = (await mockPacketFactory.deploy()) as MockPacket;

        const erc1155Factory = await ethers.getContractFactory("ERC1155Bank");
        erc1155bank = (await upgrades.deployProxy(erc1155Factory)) as ERC1155Bank;

        const transFactory = await ethers.getContractFactory("Transfer");
        transfer = (await upgrades.deployProxy(transFactory, [erc1155bank.address, mockPacket.address, clientManager.address])) as Transfer;

        mockPacket.setModule(transfer.address);
    });

    // receive packet from irishub 
    it("onRecvPacket && sendTransfer", async function () {
        let sender = (await accounts[1].getAddress()).toString();
        let receiver = (await accounts[0].getAddress()).toString();

        erc1155bank.grantRole(keccak256("MINTER_ROLE"), transfer.address);
        erc1155bank.grantRole(keccak256("BURNER_ROLE"), transfer.address);

        // send nft from irishub to ethereum
        let data = {
            class: "nft/wenchang/irishub/kitty",
            id: "tokenid",
            uri: "www.test.com",
            sender: sender,
            receiver: receiver,
            awayFromOrigin: true, 
            destContract:erc1155bank.address.toString()
        }
        let packet = {
            sequence: 1,
            port: "nft",
            sourceChain: "irishub",
            destChain: "ethereum",
            relayChain: "",
            data: nft.NftTransfer.encode(data).finish(),
        };
        let height = {
            revision_number: 1,
            revision_height: 100
        }
        await mockPacket.recvPacket(packet, Buffer.from(""), height);

        let expTokenId = "108887869359828871843163086512371705577572570612225203856540491342869629216064"
        let nftClass = await transfer.getClass(expTokenId);
        expect(nftClass).to.eq("nft/wenchang/irishub/ethereum/kitty");

        let nftId = await transfer.getId(expTokenId);
        expect(nftId).to.eq(data.id);

        let nftURI = await transfer.getUri(expTokenId);
        expect(nftURI).to.eq(data.uri);


        // send nft back to irishub from ethereum
        let receiverOnOtherChain = (await accounts[2].getAddress()).toString();
        let transferData = {
            tokenId: expTokenId,
            receiver: receiverOnOtherChain,
            class: nftClass,
            destChain: "irishub",
            relayChain: "",
            destContract:erc1155bank.address
        }
        await transfer.sendTransfer(transferData);
        let balance = await erc1155bank.balanceOf(sender, expTokenId);
        expect(balance).to.eq(0);

        let originNFT = await transfer.getBinding(expTokenId)
        expect(originNFT.class).to.eq("");
        expect(originNFT.id).to.eq("");
        expect(originNFT.uri).to.eq("");
    })

    // The test need fix the tokenID in the refundToken
    it("onAcknowledgementPacket when awayFromOrigin is false", async function () {
        let sender = (await accounts[0].getAddress()).toString();
        let receiver = (await accounts[1].getAddress()).toString();

        // send nft from irishub to ethereum
        let data = {
            class: "nft/wenchang/irishub/kitty",
            id: "tokenid",
            uri: "www.test.com",
            sender: sender,
            receiver: receiver,
            awayFromOrigin: true,
            destContract:erc1155bank.address
        }
        let packet = {
            sequence: 1,
            port: "nft",
            sourceChain: "irishub",
            destChain: "ethereum",
            relayChain: "",
            data: nft.NftTransfer.encode(data).finish(),
        };
        let height = {
            revision_number: 1,
            revision_height: 100
        }

        await mockPacket.recvPacket(packet, Buffer.from(""), height);

        let expTokenId = "108887869359828871843163086512371705577572570612225203856540491342869629216064"
        let nftClass = await transfer.getClass(expTokenId);
        expect(nftClass).to.eq("nft/wenchang/irishub/ethereum/kitty");

        let nftId = await transfer.getId(expTokenId);
        expect(nftId).to.eq(data.id);

        let nftURI = await transfer.getUri(expTokenId);
        expect(nftURI).to.eq(data.uri);


        let acknowledgement = {
            result: Buffer.from("01", "hex"),
        }

        let dd = ack.Acknowledgement.encode(acknowledgement).finish();

        await mockPacket.acknowledgePacket(packet, dd, Buffer.from(""), height);
        
        let balance1 = await erc1155bank.balanceOf(sender, expTokenId);
        expect(balance1).to.eq(0);
    })

   

    const deployContract = async function () {
        accounts = await ethers.getSigners();
        const msrFactory = await ethers.getContractFactory('ClientManager', {
            signer: accounts[0],
            libraries: {},
        })
        clientManager = (await upgrades.deployProxy(msrFactory, ["ethereum"])) as ClientManager

        let originChainName = await clientManager.getChainName();
        expect(originChainName).to.eq("ethereum")

        const ClientStateCodec = await ethers.getContractFactory('ClientStateCodec')
        const clientStateCodec = await ClientStateCodec.deploy();
        await clientStateCodec.deployed();

        const ConsensusStateCodec = await ethers.getContractFactory('ConsensusStateCodec')
        const consensusStateCodec = await ConsensusStateCodec.deploy();
        await consensusStateCodec.deployed();

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
                Verifier: verifierLib.address
            },
        })
        tendermint = (await upgrades.deployProxy(tmFactory, [clientManager.address],
            { "unsafeAllowLinkedLibraries": true }
        )) as Tendermint;
    }

    const createClient = async function (chainName: string, lightClientAddress: any, clientState: any, consensusState: any) {
        let clientStateBuf = client.ClientState.encode(clientState).finish();
        let consensusStateBuf = client.ConsensusState.encode(consensusState).finish();
        await clientManager.createClient(chainName, lightClientAddress, clientStateBuf, consensusStateBuf);
    }
})