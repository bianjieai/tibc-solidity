import { ethers } from "hardhat";
import { Signer } from "ethers";
import chai from "chai";
import { ClientManager, Tendermint } from '../typechain';
import { deployContract } from "ethereum-waffle";


let client = require("./proto/client.js");
const { expect } = chai;

describe('Client', () => {
    let accounts: Signer[]
    let tmClient: Tendermint
    let clientManager: ClientManager
    const chainName = "irishub"

    before('deploy Tendermint', async () => {
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
                revisionHeight: 17
            },
            timeDelay: 0,
        };

        let consensusState = {
            timestamp: {
                secs: 1630550622,
                nanos: 5829,
            },
            root: Buffer.from("dQYUo8mkDFPewgOOHlutKvuVRYil6W2wAljHOYzJiY4=", "base64"),
            nextValidatorsHash: Buffer.from("B1fwvGc/jfJtYdPnS7YYGsnfiMCaEQDG+t4mRgS0xHg=", "base64")
        }
        await createClient(chainName, tmClient.address, clientState, consensusState)

        let irishubClient = await clientManager.clients(chainName)
        expect(irishubClient).to.eq(tmClient.address)

        let expClientState = (await tmClient.clientState())
        expect(expClientState.chain_id).to.eq(clientState.chainId)

        let expConsensusState = (await tmClient.consensusStates(clientState.latestHeight.revisionHeight))
        expect(expConsensusState.root.slice(2)).to.eq(consensusState.root.toString("hex"))
        expect(expConsensusState.next_validators_hash.slice(2)).to.eq(consensusState.nextValidatorsHash.toString("hex"))

        let signer = await accounts[0].getAddress();
        let ret1 = await clientManager.registerRelayer(chainName, signer)
        expect(ret1.blockNumber).to.greaterThan(0);
    })

    it("test updateClient", async function () {
        let headerBz = Buffer.from("0ad0040a93030a02080b120c636861696e2d66364331544618bd1b220c08eac0e7890610f082f0a2012a480a209c0750c1434478b715d9ed05ca115f8c15ebdc648cf5eabb63c0d96a94cfec3512240801122004a27d926da98fa0d13b15211145d57088f961be809ad7945dba3653fa3b70173220f5332823abb6f37e9fdec89cb013fb9f8922cc4446a51325a3eb94946f5a07543a20e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85542200757f0bc673f8df26d61d3e74bb6181ac9df88c09a1100c6fade264604b4c4784a200757f0bc673f8df26d61d3e74bb6181ac9df88c09a1100c6fade264604b4c4785220048091bc7ddc283f77bfbf91d73c44da58c3df8a9cbc867405d8b7f3daada22f5a2081dd7b9368ecdcbcf00a14b892171160cc1515630f417e137c9f701b730fe20b6220e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8556a20e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8557214c42d7c8a0a7a831c19fbda4b050910629bf2b16b12b70108bd1b1a480a2020344322b1e79770e8c5ff1b04e4a482b599cfefb82a99d94fd9fc018588b156122408011220cfdd8644787a99c414d7e0106fd86474bb2944399c240add6415ae05dc50fbac226808021214c42d7c8a0a7a831c19fbda4b050910629bf2b16b1a0c088ecde7890610a898e299012240cfffce6808ebec0cbed83a0196a73499ab1a66fbac5a6e20af7e69cdd378a2dfc225f7a76e5d920c5b1e7c3c5e69f634ba3d2d105c5d3d18da2611645cd7d502127c0a3c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc721864123c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc7218641a0310bc1b227c0a3c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc721864123c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc721864", "hex")
        let result = await clientManager.updateClient("irishub", headerBz)
        let txResult = await result.wait();
        console.log(txResult)
    })

    const deployContract = async function () {
        accounts = await ethers.getSigners();
        const msrFactory = await ethers.getContractFactory('ClientManager', {
            signer: accounts[0],
            libraries: {},
        })
        clientManager = (await msrFactory.deploy()) as ClientManager

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
        tmClient = (await tmFactory.deploy(clientManager.address)) as Tendermint
    }

    const createClient = async function (chainName: string, lightClientAddress: any, clientState: any, consensusState: any) {
        let clientStateBuf = client.ClientState.encode(clientState).finish();
        let consensusStateBuf = client.ConsensusState.encode(consensusState).finish();
        await clientManager.createClient(chainName, lightClientAddress, clientStateBuf, consensusStateBuf)
    }
})