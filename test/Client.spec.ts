import { ethers } from "hardhat";
import { Signer } from "ethers";
import chai from "chai";
import { ClientManager, Tendermint } from '../typechain';


let client = require("./proto/client.js");
const { expect } = chai;

describe('Client', () => {
    let accounts: Signer[]
    let clientManager: ClientManager
    let tmClient: Tendermint

    before('deploy ClientManager', async () => {
        accounts = await ethers.getSigners();

        const msrFactory = await ethers.getContractFactory('ClientManager', accounts[0])
        clientManager = (await msrFactory.deploy()) as ClientManager

        const tmFactory = await ethers.getContractFactory('Tendermint', accounts[0])
        tmClient = (await tmFactory.deploy(clientManager.address)) as Tendermint
    })

    // TODO
    it("add client", async function () {
        let clientState = {
            chainId: "testA",
            trustLevel: {
                numerator: 1,
                denominator: 3
            },
            trustingPeriod: 1209600,
            unbondingPeriod: 1814400,
            maxClockDrift: 10,
            latestHeight: {
                revisionNumber: 0,
                revisionHeight: 4
            },
            timeDelay: 0,
        };
        let clientStateBuf = client.ClientState.encode(clientState).finish();

        let consensusState = {
            timestamp: {
                secs: 1630014534,
                nanos: 0,
            },
            root: Buffer.from("YXBwX2hhc2g=", "base64"),
            nextValidatorsHash: Buffer.from("8C532894EF659A1BBD8F9C6D340D55C768431DB79BFD8F85ABE5BEA59ADC55EA", "hex")
        }
        let consensusStateBuf = client.ConsensusState.encode(consensusState).finish();

        await clientManager.createClient("irishub", tmClient.address, clientStateBuf, consensusStateBuf)

        let irishubClient = await clientManager.clients("irishub")
        expect(irishubClient).to.eq(tmClient.address)

        let expClientState = (await tmClient.clientState())
        expect(expClientState.chain_id).to.eq("testA")

        let expConsensusState = (await tmClient.consensusStates(clientState.latestHeight.revisionHeight))
        expect(expConsensusState.root.slice(2)).to.eq(consensusState.root.toString("hex"))
    })
})