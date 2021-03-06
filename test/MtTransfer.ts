import { Signer, BigNumber } from "ethers";
import chai from "chai";
import { MultiTokenTransfer, ERC1155Bank, MockPacket, ClientManager, Routing, Tendermint, AccessManager,MockTransferUpgrade } from '../typechain';

const { expect } = chai;
const { ethers, upgrades } = require("hardhat");
const keccak256 = require('keccak256');

let mt = require("./proto/mtTransfer.js");
let client = require("./proto/compiled.js");
let ack = require("./proto/ack.js");

describe('MtTransfer', () => {
    let accounts: Signer[]
    let transfer: MultiTokenTransfer
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
            class: "mt/wenchang/irishub/kitty",
            id: "tokenid",
            data: Buffer.from("www.test.com"),
            sender: sender,
            receiver: receiver,
            awayFromOrigin: true,
            destContract: erc1155bank.address.toString(),
            amount: 1,
        }
        let packet = {
            sequence: 1,
            port: "MT",
            sourceChain: "irishub",
            destChain: "ethereum",
            relayChain: "",
            data: mt.MtTransfer.encode(data).finish(),
        };
        let height = {
            revision_number: 1,
            revision_height: 100
        }
        await mockPacket.recvPacket(packet, Buffer.from(""), height);

        let expTokenId = "6964473807575098713415768244349403652883002607893830340325881452459311473984"

        let scMT = await transfer.getBinding(expTokenId)
        expect(scMT.id).to.eq(data.id);
        expect(scMT.data).to.eq("0x"+Buffer.from(data.data).toString("hex"));
        expect(scMT.class).to.eq("mt/wenchang/irishub/ethereum/kitty");

        let receiveUri = await erc1155bank.uri(expTokenId);
        expect(receiveUri).to.eq(data.data.toString());


        // send mt back to irishub from ethereum
        let receiverOnOtherChain = (await accounts[2].getAddress()).toString();
        let transferData = {
            tokenId: expTokenId,
            receiver: receiverOnOtherChain,
            class: "mt/wenchang/irishub/ethereum/kitty",
            destChain: "irishub",
            relayChain: "",
            destContract: erc1155bank.address,
            amount: 1,
        }
        await transfer.sendTransfer(transferData);
        let balance = await erc1155bank.balanceOf(sender, expTokenId);
        expect(balance).to.eq(0);
    })

    // The test need fix the tokenID in the refundToken
    it("onAcknowledgementPacket when awayFromOrigin is false", async function () {
        let sender = (await accounts[0].getAddress()).toString();
        let receiver = (await accounts[1].getAddress()).toString();

        // send nft from irishub to ethereum
        let data = {
            class: "mt/wenchang/irishub/kitty",
            id: "tokenid",
            data: Buffer.from("www.test.com"),
            sender: sender,
            receiver: receiver,
            awayFromOrigin: true,
            destContract: erc1155bank.address,
            amount: 1,
        }
        let packet = {
            sequence: 1,
            port: "MT",
            sourceChain: "irishub",
            destChain: "ethereum",
            relayChain: "",
            data: mt.MtTransfer.encode(data).finish(),
        };
        let height = {
            revision_number: 1,
            revision_height: 100
        }

        await mockPacket.recvPacket(packet, Buffer.from(""), height);

        let expTokenId = "6964473807575098713415768244349403652883002607893830340325881452459311473984"

        let scMT = await transfer.getBinding(expTokenId)
        expect(scMT.id).to.eq(data.id);
        expect(scMT.data).to.eq("0x" + Buffer.from(data.data).toString("hex"));
        expect(scMT.class).to.eq("mt/wenchang/irishub/ethereum/kitty");

        let acknowledgement = {
            result: Buffer.from("01", "hex"),
        }

        let dd = ack.Acknowledgement.encode(acknowledgement).finish();
        await mockPacket.acknowledgePacket(packet, dd, Buffer.from(""), height);
        let balance1 = await erc1155bank.balanceOf(sender, expTokenId);
        expect(balance1).to.eq(0);
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
        erc1155bank = (await upgrades.deployProxy(erc1155Factory,
            [(await accounts[0].getAddress())
        ])) as ERC1155Bank;
    }

    const deployTransfer = async function () {
        const transFactory = await ethers.getContractFactory("MultiTokenTransfer");
        transfer = (await upgrades.deployProxy(transFactory, [
            mockPacket.address,
            clientManager.address
        ])) as MultiTokenTransfer;
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