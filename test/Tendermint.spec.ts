import { ethers, upgrades } from "hardhat";
import { Signer, BigNumber, utils } from "ethers";
import chai from "chai";
import { ClientManager, Tendermint, MockClientManager, AccessManager } from '../typechain';

let client = require("./proto/compiled.js");
const { expect } = chai;

describe('Client', () => {
    let accounts: Signer[]
    let tendermint: Tendermint
    let clientManager: ClientManager
    let accessManager: AccessManager
    const chainName = "irishub"

    before('deploy Tendermint', async () => {
        accounts = await ethers.getSigners();
        await deployAccessManager();
        await deployClientManager();
        await deployTendermint();
        await initialize();
    })

    it("test updateClient", async function () {
        let height = 3894;
        let timestamp = 1631186439;
        let root = Buffer.from("TvYJ6Z0r30t86IoHhNtucrKrRwxqn2QYI59keWEnZ8w=", "base64");
        let next_validators_hash = Buffer.from("B1fwvGc/jfJtYdPnS7YYGsnfiMCaEQDG+t4mRgS0xHg=", "base64");
        let headerBz = utils.defaultAbiCoder.encode(["uint64", "uint64", "uint64", "bytes32", "bytes32"], [1, height, timestamp, root, next_validators_hash])

        let result = await clientManager.updateClient(chainName, headerBz)
        await result.wait();

        let clientState = (await tendermint.clientState())
        let expConsensusState = (await tendermint.getConsensusState(clientState.latest_height))
        expect(expConsensusState.root.slice(2)).to.eq(root.toString("hex"))
        expect(expConsensusState.next_validators_hash.slice(2)).to.eq(next_validators_hash.toString("hex"))
    })

    it("test verifyPacketCommitment", async function () {
        // create light client
        let clientState = {
            chainId: "chain-f6C1TF",
            trustLevel: {
                numerator: 1,
                denominator: 3
            },
            trustingPeriod: 100 * 24 * 60 * 60,
            unbondingPeriod: 1814400,
            maxClockDrift: 10,
            latestHeight: {
                revisionNumber: 1,
                revisionHeight: 3893
            },
            merklePrefix: {
                keyPrefix: Buffer.from("74696263", "hex"),
            },
            timeDelay: 0,
        };

        let consensusState = {
            timestamp: {
                secs: 1631517854,
                nanos: 5829,
            },
            root: Buffer.from("99f2fe6e2cb20c8e9bfaa8e490a3967efe44a2a9f4b505d21fec0c08090370f1", "hex"),
            nextValidatorsHash: Buffer.from("B1fwvGc/jfJtYdPnS7YYGsnfiMCaEQDG+t4mRgS0xHg=", "base64")
        }

        let proofHeight: any = {
            revision_number: 1,
            revision_height: 3893
        };

        let proof: any = Buffer.from("0a410a3f0a27636f6d6d69746d656e74732f697269736875622f6574686572756d2f73657175656e6365732f3112074d5956414c55451a0b0801180120012a030002020a350a330a0474696263122075416887166fb369184fdac1bed43dc01c3e1da9693b71f2493e1ecd049b12ec1a090801180120012a0100", "hex");

        let value: any = Buffer.from("4d5956414c5545", "hex")

        await createClient("chainName", tendermint.address, clientState, consensusState)
        await tendermint.verifyPacketCommitment(
            proofHeight,
            proof,
            "irishub",
            "etherum",
            1,
            value
        )
    })

    it("upgrade clientManager", async function () {
        const mockClientManagerFactory = await ethers.getContractFactory("MockClientManager");
        const upgradedClientManager = await upgrades.upgradeProxy(clientManager.address, mockClientManagerFactory);
        expect(upgradedClientManager.address).to.eq(clientManager.address);

        const result = await upgradedClientManager.getLatestHeight(chainName)
        expect(3893).to.eq(result[1].toNumber())

        await upgradedClientManager.setVersion(2)
        const version = await upgradedClientManager.version();
        expect(2).to.eq(version.toNumber())
    })

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

    const createClient = async function (chainName: string, lightClientAddress: any, clientState: any, consensusState: any) {
        let clientStateBuf = client.ClientState.encode(clientState).finish();
        let consensusStateBuf = client.ConsensusState.encode(consensusState).finish();
        await clientManager.createClient(chainName, lightClientAddress, clientStateBuf, consensusStateBuf);
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
    }
})