import { ethers } from "hardhat";
import { Signer } from "ethers";
import chai from "chai";

import { ClientManager, Tendermint } from '../typechain';

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


    it("add client", async function () {
        let address = await accounts[0].getAddress()
        await clientManager.createClient("irishub", tmClient.address, Buffer.from("0x0"), Buffer.from("0x0"))

        let irishubClient = await clientManager.clients("irishub")
        expect(irishubClient).to.eq(tmClient.address)
    })
})