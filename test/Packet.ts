import { ethers, upgrades } from "hardhat";
import { BigNumberish, Signer } from "ethers";
import chai from "chai";

import { Packet, Routing, ClientManager, MockTendermint, MockTransfer, AccessManager } from '../typechain';
import { sha256 } from "ethers/lib/utils";
let client = require("./proto/compiled.js");

const { expect } = chai;

describe('Packet', () => {
    let routing: Routing
    let clientManager: ClientManager
    let tendermint: MockTendermint
    let transfer: MockTransfer
    let accessManager: AccessManager
    let accounts: Signer[]
    let packet: Packet
    const chainName = "source"
    const destChainName = "dest"
    const relayChainName = "relay"

    before('deploy Packet', async () => {
        accounts = await ethers.getSigners();
        await deployAccessManager();
        await deployClientManager();
        await deployTendermint();
        await deployRouting();
        await deployPacket();
        await deployTransfer();
    })

    it("send packet and receive ack", async function () {
        let dataByte = Buffer.from("wd", "utf-8")
        let transferData = {
            tokenId: 1,
            receiver: "",
            class: "",
            destChain: destChainName,
            relayChain: relayChainName,
            destContract: "",
        }
        let path = "commitments/" + chainName + "/" + destChainName + "/sequences/" + 1
        await transfer.sendTransfer(transferData);
        let commit = await packet.commitments(Buffer.from(path, "utf-8"));
        let seq = await packet.getNextSequenceSend(chainName, destChainName);
        expect(seq).to.equal(2);
        expect(commit).to.equal(sha256(dataByte));
        let pkt = {
            sequence: 1,
            port: "nft",
            sourceChain: chainName,
            destChain: destChainName,
            relayChain: relayChainName,
            data: dataByte,
        }
        let ackByte = await transfer.NewAcknowledgement(true, "")
        let proof = Buffer.from("proof", "utf-8")
        let height = {
            revision_number: 1,
            revision_height: 1,
        }
        await packet.acknowledgePacket(pkt, ackByte, proof, height)
        commit = await packet.commitments(Buffer.from(path, "utf-8"));
        expect(commit).to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
    });

    it("receive packet and write ack", async function () {
        let dataByte = Buffer.from("data", "utf-8")
        let ackByte = await transfer.NewAcknowledgement(true, "")
        let proof = Buffer.from("proof", "utf-8")
        let height = {
            revision_number: 1,
            revision_height: 1,
        }
        let pkt = {
            sequence: 1,
            port: "nft",
            sourceChain: destChainName,
            destChain: chainName,
            relayChain: relayChainName,
            data: dataByte,
        }
        await packet.recvPacket(pkt, proof, height);
        let ackPath = "acks/" + destChainName + "/" + chainName + "/sequences/" + 1
        let receiptPath = "receipts/" + destChainName + "/" + chainName + "/sequences/" + 1
        let macAckSeqPath = "maxAckSeq/" + destChainName + "/" + chainName
        let ackCommit = await packet.commitments(Buffer.from(ackPath, "utf-8"));
        expect(ackCommit).to.equal(sha256(ackByte));
        expect(await packet.receipts(Buffer.from(receiptPath, "utf-8"))).to.equal(true);
        expect(await packet.sequences(Buffer.from(macAckSeqPath, "utf-8"))).to.equal(1);
    });

    it("send clean packet", async function () {
        let cleanPkt = {
            sequence: 1,
            sourceChain: chainName,
            destChain: destChainName,
            relayChain: relayChainName,
        }
        await packet.cleanPacket(cleanPkt)
        let cleanSeqPath = "clean/" + chainName + "/" + destChainName
        expect(await packet.sequences(Buffer.from(cleanSeqPath, "utf-8"))).to.equal(1);
    });

    it("receive clean packet", async function () {
        let ackPath = "acks/" + destChainName + "/" + chainName + "/sequences/" + 1
        let ackCommit = await packet.commitments(Buffer.from(ackPath, "utf-8"));
        expect(ackCommit).not.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
        let cleanPkt = {
            sequence: 1,
            sourceChain: destChainName,
            destChain: chainName,
            relayChain: relayChainName,
        }
        let proof = Buffer.from("proof", "utf-8")
        let height = {
            revision_number: 1,
            revision_height: 1,
        }
        await packet.recvCleanPacket(cleanPkt, proof, height)
        let cleanSeqPath = "clean/" + chainName + "/" + destChainName
        expect(1).to.equal(await packet.sequences(Buffer.from(cleanSeqPath, "utf-8")));
        ackCommit = await packet.commitments(Buffer.from(ackPath, "utf-8"))
        expect(ackCommit).to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
    });

    it("upgrade packet", async function () {
        const mockPacketUpgradeFactory = await ethers.getContractFactory("MockPacketUpgrade");
        const upgradedPacket = await upgrades.upgradeProxy(packet.address, mockPacketUpgradeFactory);
        expect(upgradedPacket.address).to.eq(packet.address);

        await upgradedPacket.setVersion(2)
        const version = await upgradedPacket.version();
        expect(2).to.eq(version.toNumber())
    })

    const deployAccessManager = async function () {
        const accessFactory = await ethers.getContractFactory('AccessManager');
        accessManager = (await upgrades.deployProxy(accessFactory, [await accounts[0].getAddress()])) as AccessManager
    }

    const deployClientManager = async function () {
        const msrFactory = await ethers.getContractFactory('ClientManager', accounts[0])
        clientManager = (await upgrades.deployProxy(msrFactory, [chainName, accessManager.address])) as ClientManager;
    }

    const deployTendermint = async function () {
        const ClientStateCodec = await ethers.getContractFactory('ClientStateCodec');
        const clientStateCodec = await ClientStateCodec.deploy();
        await clientStateCodec.deployed();

        const ConsensusStateCodec = await ethers.getContractFactory('ConsensusStateCodec');
        const consensusStateCodec = await ConsensusStateCodec.deploy();
        await consensusStateCodec.deployed();

        const tmFactory = await ethers.getContractFactory('MockTendermint', {
            signer: accounts[0],
            libraries: {
                ClientStateCodec: clientStateCodec.address,
                ConsensusStateCodec: consensusStateCodec.address
            },
        })
        tendermint = (await upgrades.deployProxy(tmFactory, [clientManager.address],
            { "unsafeAllowLinkedLibraries": true }
        )) as MockTendermint;

        // create light client
        let clientState = {
            chainId: destChainName,
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

        accounts = await ethers.getSigners();

        const ProofCodec = await ethers.getContractFactory('ProofCodec');
        const proofCodec = await ProofCodec.deploy();
        await proofCodec.deployed();

        let clientStateBuf = client.ClientState.encode(clientState).finish();
        let consensusStateBuf = client.ConsensusState.encode(consensusState).finish();
        await clientManager.createClient(relayChainName, tendermint.address, clientStateBuf, consensusStateBuf);
    }

    const deployRouting = async function () {
        const rtFactory = await ethers.getContractFactory('Routing', accounts[0])
        routing = (await upgrades.deployProxy(rtFactory, [accessManager.address])) as Routing;
    }

    const deployPacket = async function () {
        const pkFactory = await ethers.getContractFactory('Packet', {
            signer: accounts[0],
        })
        packet = (await upgrades.deployProxy(pkFactory, [
            clientManager.address,
            routing.address
        ])) as Packet;
    }

    const deployTransfer = async function () {
        const nftFactory = await ethers.getContractFactory('MockTransfer', accounts[0])
        transfer = (await upgrades.deployProxy(nftFactory, [
            packet.address,
            clientManager.address
        ])) as MockTransfer;
        await routing.addRouting("nft", transfer.address);
    }
})