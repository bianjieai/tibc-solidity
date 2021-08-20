import { ethers } from "hardhat";
import { Signer } from "ethers";
import chai from "chai";

import { ClientManager } from '../typechain';

const { expect } = chai;

describe('Client', () => {
    let accounts: Signer[]
    let clientManager: ClientManager

    before('deploy ClientManager', async () => {
        accounts = await ethers.getSigners();

        const factory = await ethers.getContractFactory('ClientManager', accounts[0])
        clientManager = (await factory.deploy()) as ClientManager
    })


    it("add client", async function () {
        let address = await accounts[0].getAddress()
        await clientManager.createClient("irishub", address)

        let irishubResult = await clientManager.getClient("irishub")
        expect(irishubResult).to.eq(address)
    })
})