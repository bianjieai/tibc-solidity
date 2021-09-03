import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import chai from "chai";
import { ClientManager, Tendermint, TestMerkleTree, TestLightClient } from '../typechain';


let client = require("./proto/client.js");
const { expect } = chai;

describe('Client', () => {
    let accounts: Signer[]
    let clientManager: ClientManager
    let tmClient: Tendermint

    before('deploy ClientManager', async () => {
        accounts = await ethers.getSigners();
        const msrFactory = await ethers.getContractFactory('ClientManager', {
            signer: accounts[0],
            libraries: {
                //SimpleMerkleTree: merkleLib.address
            },
        })
        clientManager = (await msrFactory.deploy()) as ClientManager

        const tmFactory = await ethers.getContractFactory('Tendermint', accounts[0])
        tmClient = (await tmFactory.deploy(clientManager.address)) as Tendermint
    })

    // it("generate merkle root", async function () {
    //     const mkFactory = await ethers.getContractFactory('TestMerkleTree', accounts[0])
    //     const mk = (await mkFactory.deploy()) as TestMerkleTree
    //     //let data: any = []
    //     let data: any = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]
    //     let root = await mk.hashFromByteSlices(data);
    //     expect(root).to.eq("0xf326493eceab4f2d9ffbc78c59432a0a005d6ea98392045c74df5d14a113be18")
    // })

    // it("generate validatorSet Hash", async function () {
    //     const lcFactory = await ethers.getContractFactory('TestLightClient', accounts[0])
    //     const lc = (await lcFactory.deploy()) as TestLightClient
    //     //let data: any = []
    //     let data: any = Buffer.from("0a3c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc721864123c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc721864", "hex")
    //     let valSetHash = await lc.genValidatorSetHash(data);
    //     expect(valSetHash).to.eq("0x0757f0bc673f8df26d61d3e74bb6181ac9df88c09a1100c6fade264604b4c478")
    // })

    // TODO
    it("test tendermint", async function () {
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
        let clientStateBuf = client.ClientState.encode(clientState).finish();

        let consensusState = {
            timestamp: {
                secs: 1630550622,
                nanos: 5829,
            },
            root: Buffer.from("dQYUo8mkDFPewgOOHlutKvuVRYil6W2wAljHOYzJiY4=", "base64"),
            nextValidatorsHash: Buffer.from("B1fwvGc/jfJtYdPnS7YYGsnfiMCaEQDG+t4mRgS0xHg=", "base64")
        }
        let consensusStateBuf = client.ConsensusState.encode(consensusState).finish();

        await clientManager.createClient("irishub", tmClient.address, clientStateBuf, consensusStateBuf)

        let irishubClient = await clientManager.clients("irishub")
        expect(irishubClient).to.eq(tmClient.address)

        let expClientState = (await tmClient.clientState())
        expect(expClientState.chain_id).to.eq("chain-f6C1TF")

        let expConsensusState = (await tmClient.consensusStates(clientState.latestHeight.revisionHeight))
        expect(expConsensusState.root.slice(2)).to.eq(consensusState.root.toString("hex"))
        expect(expConsensusState.next_validators_hash.slice(2)).to.eq(consensusState.nextValidatorsHash.toString("hex"))
        console.log(expConsensusState.next_validators_hash)


        let signer = await accounts[0].getAddress();
        let ret1 = await clientManager.registerRelayer("irishub", signer)
        expect(ret1.blockNumber).to.greaterThan(0);

        let headerBz = Buffer.from("0ace040a92030a02080b120c636861696e2d6636433154461812220c08ab97c7890610e88bfe95022a480a201424d4e37cb40efb81a4fff5e4f5fbdf14575ce3a5f68be1845c2f52d109867112240801122044f92552fb37c4c04decbbbf7a85d4277e815632bbec2a3f5851f04cc4cefd8a322037695f3d65b890ea8f95993415f17efb5e62eeddf0d9686bd7fb975d2317a8103a20e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85542200757f0bc673f8df26d61d3e74bb6181ac9df88c09a1100c6fade264604b4c4784a200757f0bc673f8df26d61d3e74bb6181ac9df88c09a1100c6fade264604b4c4785220048091bc7ddc283f77bfbf91d73c44da58c3df8a9cbc867405d8b7f3daada22f5a20750614a3c9a40c53dec2038e1e5bad2afb954588a5e96db00258c7398cc9898e6220e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8556a20e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8557214c42d7c8a0a7a831c19fbda4b050910629bf2b16b12b60108121a480a2079db67f6df78416b103b5afc0806d0eb13ee7ee26c912e023b0fa3cf34d85825122408011220fa6693091cccf00e34e04290186ce9af4b0a948fff6dc3622566d48ca7ed2fe9226808021214c42d7c8a0a7a831c19fbda4b050910629bf2b16b1a0c08b097c7890610f0a2beba022240b4af302c46c6cde7419c880de8babf438b0cf4da20085b16ad5e7905cf5cfce3e0709dc506e5c6d161ec1fc361e06ba6af63fc5ecf63d44e5ed1eaeda1ec210f127c0a3c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc721864123c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc7218641a021011227c0a3c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc721864123c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc721864", "hex")
        let result = await clientManager.updateClient("irishub", headerBz, {
            //gasLimit: 70000000,
        })
        let txResult = await result.wait();
        console.log(txResult)
    })
})