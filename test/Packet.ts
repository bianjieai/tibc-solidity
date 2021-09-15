import { ethers } from "hardhat";
import {BigNumberish, Signer} from "ethers";
import chai from "chai";

import { Packet, Routing, ClientManager, Strings, Tendermint } from '../typechain';
import {BytesLike} from "@ethersproject/bytes";
import {sha256} from "ethers/lib/utils";
let client = require("./proto/compiled.js");

const { expect } = chai;

describe('Packet', () => {
    let routing: Routing
    let clientManager: ClientManager
    let tendermint: Tendermint
    let accounts: Signer[]
    let packet: Packet
    let strings: Strings
    const chainName = "source"
    const destChainName = "dest"
    const relayChainName = "relay"

    before('deploy Packet', async () => {
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
        const msrFactory = await ethers.getContractFactory('ClientManager', accounts[0])
        clientManager = (await msrFactory.deploy(chainName)) as ClientManager;
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
        const strFactory = await ethers.getContractFactory('Strings', accounts[0])
        strings = (await strFactory.deploy()) as Strings;
        const rtFactory = await ethers.getContractFactory('Routing', accounts[0])
        routing = (await rtFactory.deploy()) as Routing
        const pkFactory = await ethers.getContractFactory('Packet', {
            signer: accounts[0],
            libraries: {
                Strings: strings.address,
            },
        })
        let clientStateBuf = client.ClientState.encode(clientState).finish();
        let consensusStateBuf = client.ConsensusState.encode(consensusState).finish();
        clientManager.createClient(relayChainName, tendermint.address, clientStateBuf, consensusStateBuf)
        packet = (await pkFactory.deploy(clientManager.address, routing.address)) as Packet
    })

    it("send packet", async function () {
        let dataByte = Buffer.from("wd", "utf-8")
        let pkt = {
            sequence: 1,
            port: "nft",
            sourceChain: chainName,
            destChain: destChainName,
            relayChain: relayChainName,
            data: dataByte,
        }
        let path = "commitments/" + chainName + "/" + destChainName + "/sequences/" + 1
        await packet.sendPacket(pkt);
        let commit = await packet.commitments(Buffer.from(path, "utf-8"));
        let seq = await packet.getNextSequenceSend(chainName, destChainName);
        expect(2).to.equal(seq);
        expect(sha256(dataByte)).to.equal(commit);
    });

    it("receive packet", async function () {
        let dataByte = Buffer.from("wd", "utf-8")
        let pkt = {
            sequence: 1,
            port: "nft",
            sourceChain: chainName,
            destChain: destChainName,
            relayChain: relayChainName,
            data: dataByte,
        }
        let path = "commitments/" + chainName + "/" + destChainName + "/sequences/" + 1
        await packet.recvPacket(pkt);
        let commit = await packet.commitments(Buffer.from(path, "utf-8"));
        let seq = await packet.getNextSequenceSend(chainName, destChainName);
        expect(2).to.equal(seq);
        expect(sha256(dataByte)).to.equal(commit);
    });
})