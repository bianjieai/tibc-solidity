import { ethers } from "hardhat";
import { Signer } from "ethers";
import chai from "chai";
import { ClientManager, Tendermint } from '../typechain';


let client = require("./proto/compiled.js");
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
                revisionHeight: 3893
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
        await createClient(chainName, tmClient.address, clientState, consensusState)

        let irishubClient = await clientManager.clients(chainName)
        expect(irishubClient).to.eq(tmClient.address)

        let expClientState = (await tmClient.clientState())
        expect(expClientState.chain_id).to.eq(clientState.chainId)

        let originChainName = await tmClient.getChainName();
        expect(originChainName).to.eq("etherum")

        let expConsensusState = (await tmClient.consensusStates(clientState.latestHeight.revisionHeight))
        expect(expConsensusState.root.slice(2)).to.eq(consensusState.root.toString("hex"))
        expect(expConsensusState.next_validators_hash.slice(2)).to.eq(consensusState.nextValidatorsHash.toString("hex"))

        let signer = await accounts[0].getAddress();
        let ret1 = await clientManager.registerRelayer(chainName, signer)
        expect(ret1.blockNumber).to.greaterThan(0);
    })

    it("test updateClient", async function () {
        let headerBz = Buffer.from("0ad0040a93030a02080b120c636861696e2d66364331544618b61e220c0882dce78906109888ccce022a480a2082e51c8fad6dd4af34fe87d92848598976f3db70c4f0d3610009a25102b34a22122408011220fd14e94e3d4c7fbf8e619f9764d05050fb130eb508ac40723b78872b9e701b5b322055b3d1a7b6b84b2af6003e9b257aa3bbf01b426f2bc2f4002b11d11585f3dad13a20e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85542200757f0bc673f8df26d61d3e74bb6181ac9df88c09a1100c6fade264604b4c4784a200757f0bc673f8df26d61d3e74bb6181ac9df88c09a1100c6fade264604b4c4785220048091bc7ddc283f77bfbf91d73c44da58c3df8a9cbc867405d8b7f3daada22f5a204ef609e99d2bdf4b7ce88a0784db6e72b2ab470c6a9f6418239f6479612767cc6220e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8556a20e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8557214c42d7c8a0a7a831c19fbda4b050910629bf2b16b12b70108b61e1a480a20ef66beba005fbbdb1e74d586e5a0e90a18ee33bf800885d821d582f2f591f67c12240801122071ce2477ab4664f732b418721075c56055048f0a7df95c6a45cecc737b8be551226808021214c42d7c8a0a7a831c19fbda4b050910629bf2b16b1a0c0887dce78906108897bef202224026bd36af19efe9949fdd5dc2b0b17f7f84ffa6caf92143d99585be7bea203b91cca53598ac787638dd978aa5c7de26aa2763a8edf12f427f7e9ec26aa8656808127c0a3c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc721864123c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc7218641a0310b51e227c0a3c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc721864123c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc721864", "hex")
        let result = await clientManager.updateClient(chainName, headerBz)
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