import { ethers } from "hardhat";
import { Signer } from "ethers";
import chai from "chai";

import { ClientManager, Tendermint, ProtobufTest } from '../typechain';

const { expect } = chai;

describe('Client', () => {
    let accounts: Signer[]
    let clientManager: ClientManager
    let tmClient: Tendermint
    let protobuf: ProtobufTest

    before('deploy ClientManager', async () => {
        accounts = await ethers.getSigners();

        const msrFactory = await ethers.getContractFactory('ClientManager', accounts[0])
        clientManager = (await msrFactory.deploy()) as ClientManager

        const tmFactory = await ethers.getContractFactory('Tendermint', accounts[0])
        tmClient = (await tmFactory.deploy(clientManager.address)) as Tendermint

        const protobufFactory = await ethers.getContractFactory('ProtobufTest', accounts[0])
        protobuf = (await protobufFactory.deploy()) as ProtobufTest
    })


    // it("add client", async function () {
    //     await clientManager.createClient("irishub", tmClient.address, Buffer.from("0x0"), Buffer.from("0x0"))

    //     let irishubClient = await clientManager.clients("irishub")
    //     expect(irishubClient).to.eq(tmClient.address)
    // })

    it("encode and decode", async function () {
        let voteBz = Buffer.from("0802113930000000000000190200000000000000224a0a208b01023386c371778ecb6368573e539afc3cc860ec3a2f614e54fe5652f4fc80122608c0843d122072db3d959635dff1bb567bedaa70573392c5159666a3f8caf11e413aac52207a2a0b08b1d381d20510809dca6f320d746573745f636861696e5f6964", "hex")

        //test decode
        await protobuf.decode(voteBz);

        let vote = await protobuf.data()
        expect(vote.height).to.eq(12345)
        expect(vote.block_id.hash).to.eq("0x8b01023386c371778ecb6368573e539afc3cc860ec3a2f614e54fe5652f4fc80")
        expect(vote.typ).to.eq(2)

        //test encode
        let expVote = await protobuf.encode()
        expect(expVote.slice(2)).to.eq(voteBz.toString("hex"))
    })

})