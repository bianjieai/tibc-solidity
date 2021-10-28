import { Signer, BigNumber } from "ethers";
import chai from "chai";
import { Transfer, ERC1155Bank, MockPacket, ClientManager, Routing, Tendermint, AccessManager,MockTransferUpgrade } from '../typechain';
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
    let accessManager: AccessManager
    let chainName = "irishub"

    before('deploy Transfer', async () => {
        accounts = await ethers.getSigners();
        await deployAccessManager();
        await deployClientManager();
        await deployTendermint();
        await deployHost();
        await deployRouting();
        await deployPacket();
        await deployERC1155Bank();
        await deployTransfer();
        await initialize();
    });

    // receive packet from irishub 
    it("onRecvPacket && sendTransfer", async function () {
        let sender = (await accounts[1].getAddress()).toString();
        let receiver = (await accounts[0].getAddress()).toString();
        // send nft from irishub to ethereum
        let data = {
            class: "nft/wenchang/irishub/kitty",
            id: "tokenid",
            uri: "www.test.com",
            sender: sender,
            receiver: receiver,
            awayFromOrigin: true,
            destContract: erc1155bank.address.toString()
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

        let scNFT = await transfer.getBinding(expTokenId)
        console.log(scNFT)
        expect(scNFT.id).to.eq(data.id);
        expect(scNFT.uri).to.eq(data.uri);
        expect(scNFT.class).to.eq("nft/wenchang/irishub/ethereum/kitty");

        let receiveUri = await erc1155bank.uri(expTokenId);
        expect(receiveUri).to.eq(data.uri);


        // send nft back to irishub from ethereum
        let receiverOnOtherChain = (await accounts[2].getAddress()).toString();
        let transferData = {
            tokenId: expTokenId,
            receiver: receiverOnOtherChain,
            class: "nft/wenchang/irishub/ethereum/kitty",
            destChain: "irishub",
            relayChain: "",
            destContract: erc1155bank.address
        }
        await transfer.sendTransfer(transferData);
        let balance = await erc1155bank.balanceOf(sender, expTokenId);
        expect(balance).to.eq(0);

        let originNFT = await transfer.getBinding(expTokenId)
        expect(originNFT.class).to.eq("");
        expect(originNFT.id).to.eq("");
        expect(originNFT.uri).to.eq("");

        let backUri = await erc1155bank.uri(expTokenId);
        expect(backUri).to.eq("");
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
            destContract: erc1155bank.address
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

        let scNFT = await transfer.getBinding(expTokenId)
        expect(scNFT.id).to.eq(data.id);
        expect(scNFT.uri).to.eq(data.uri);
        expect(scNFT.class).to.eq("nft/wenchang/irishub/ethereum/kitty");

        let acknowledgement = {
            result: Buffer.from("01", "hex"),
        }

        let dd = ack.Acknowledgement.encode(acknowledgement).finish();

        await mockPacket.acknowledgePacket(packet, dd, Buffer.from(""), height);

        let balance1 = await erc1155bank.balanceOf(sender, expTokenId);
        expect(balance1).to.eq(0);
    })

    it("upgrade transfer", async function () {
        // test if the addresses are the same
        const mockTransferFactory = await ethers.getContractFactory("MockTransferUpgrade");
        const upgradedTransfer = await upgrades.upgradeProxy(transfer.address, mockTransferFactory);
        expect(upgradedTransfer.address).to.eq(transfer.address);


        // test that the old contract data can be read by the new contract
        let sender = (await accounts[1].getAddress()).toString();
        let receiver = (await accounts[0].getAddress()).toString();
        
        let data = {
            class: "nft/wenchang/irishub/kitty",
            id: "tokenid",
            uri: "www.test.com",
            sender: sender,
            receiver: receiver,
            awayFromOrigin: true,
            destContract: erc1155bank.address.toString()
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

        let scNFT = await transfer.getBinding(expTokenId)
        expect(scNFT.id).to.eq(data.id);
        expect(scNFT.uri).to.eq(data.uri);
        expect(scNFT.class).to.eq("nft/wenchang/irishub/ethereum/kitty");

        let receiveUri = await erc1155bank.uri(expTokenId);
        expect(receiveUri).to.eq(data.uri);

        // test the new contract to change the method of the old contract
        let packet1 = {
            sequence: 1,
            port: "nft",
            sourceChain: "irishub",
            destChain: "ethereum",
            relayChain: "",
            data: nft.NftTransfer.encode(data).finish(),
        };
        let res = await upgradedTransfer.onRecvPacket(packet1);
        await res.wait();

        let scNFT1 = await upgradedTransfer.getBinding("1")
        expect(scNFT1.id).to.eq("taidy");
        expect(scNFT1.uri).to.eq("www.test.com");
        expect(scNFT1.class).to.eq("nft/irishub/dog");

        // test the new contract and add new status fields and methods
        await upgradedTransfer.setVersion(2)
        const version = await upgradedTransfer.version();
        expect(2).to.eq(version.toNumber())
    })

    const createClient = async function (chainName: string, lightClientAddress: any, clientState: any, consensusState: any) {
        let clientStateBuf = client.ClientState.encode(clientState).finish();
        let consensusStateBuf = client.ConsensusState.encode(consensusState).finish();
        await clientManager.createClient(chainName, lightClientAddress, clientStateBuf, consensusStateBuf);
    }

    const deployAccessManager = async function () {
        const accessFactory = await ethers.getContractFactory('AccessManager');
        accessManager = (await upgrades.deployProxy(accessFactory, [await accounts[0].getAddress()])) as AccessManager
    }

    const deployClientManager = async function () {
        const msrFactory = await ethers.getContractFactory('ClientManager', accounts[0])
        clientManager = (await upgrades.deployProxy(msrFactory, ["etherum", accessManager.address])) as ClientManager;
    }

    const deployTendermint = async function () {
        let originChainName = await clientManager.getChainName();
        expect(originChainName).to.eq("etherum");

        const ClientStateCodec = await ethers.getContractFactory('ClientStateCodec');
        const clientStateCodec = await ClientStateCodec.deploy();
        await clientStateCodec.deployed();

        const ConsensusStateCodec = await ethers.getContractFactory('ConsensusStateCodec');
        const consensusStateCodec = await ConsensusStateCodec.deploy();
        await consensusStateCodec.deployed();

        const ProofCodec = await ethers.getContractFactory('ProofCodec');
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
            libraries: {
                ClientStateCodec: clientStateCodec.address,
                ConsensusStateCodec: consensusStateCodec.address,
                Verifier: verifierLib.address,
            },
        })
        tendermint = (await upgrades.deployProxy(tmFactory, [clientManager.address],
            { "unsafeAllowLinkedLibraries": true }
        )) as Tendermint;
    }

    const deployHost = async function () {
        const hostFac = await ethers.getContractFactory("Host");
        const host = await hostFac.deploy();
        await host.deployed();
    }

    const deployRouting = async function () {
        const routingFac = await ethers.getContractFactory("Routing");
        routing = (await upgrades.deployProxy(routingFac, [accessManager.address])) as Routing;
    }

    const deployPacket = async function () {
        const mockPacketFactory = await ethers.getContractFactory("MockPacket");
        mockPacket = (await mockPacketFactory.deploy()) as MockPacket;
    }

    const deployERC1155Bank = async function () {
        const erc1155Factory = await ethers.getContractFactory("ERC1155Bank");
        erc1155bank = (await upgrades.deployProxy(erc1155Factory)) as ERC1155Bank;
    }

    const deployTransfer = async function () {
        const transFactory = await ethers.getContractFactory("Transfer");
        transfer = (await upgrades.deployProxy(transFactory, [
            erc1155bank.address,
            mockPacket.address,
            clientManager.address
        ])) as Transfer;
    }

    const initialize = async function () {
        // create light client
        let clientState = {
            chainId: "chain-f6C1TF",
            trustLevel: {
                numerator: 1,
                denominator: 3
            },

            trustingPeriod: 1000 * 24 * 60 * 60,
            unbondingPeriod: 1814400,
            maxClockDrift: 10,
            latestHeight: {
                revisionNumber: 1,
                revisionHeight: 3893
            },
            merklePrefix: {
                keyPrefix: Buffer.from("tibc"),
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

        let irishubClient = await clientManager.clients(chainName)
        expect(irishubClient).to.eq(tendermint.address)

        let latestHeight = await clientManager.getLatestHeight(chainName)
        expect(latestHeight[0].toNumber()).to.eq(clientState.latestHeight.revisionNumber)
        expect(latestHeight[1].toNumber()).to.eq(clientState.latestHeight.revisionHeight)

        let expClientState = (await tendermint.clientState())
        expect(expClientState.chain_id).to.eq(clientState.chainId)

        let key: any = {
            revision_number: clientState.latestHeight.revisionNumber,
            revision_height: clientState.latestHeight.revisionHeight,
        };

        let expConsensusState = (await tendermint.getConsensusState(key))
        expect(expConsensusState.root.slice(2)).to.eq(consensusState.root.toString("hex"))
        expect(expConsensusState.next_validators_hash.slice(2)).to.eq(consensusState.nextValidatorsHash.toString("hex"))

        let signer = await accounts[0].getAddress();
        let ret1 = await clientManager.registerRelayer(chainName, signer)
        expect(ret1.blockNumber).to.greaterThan(0);

        mockPacket.setModule(transfer.address);
        erc1155bank.grantRole(keccak256("MINTER_ROLE"), transfer.address);
        erc1155bank.grantRole(keccak256("BURNER_ROLE"), transfer.address);
    }
})