import { ethers } from "hardhat";
import { Signer } from "ethers";
import chai from "chai";

import { Packet, Routing, ClientManager, Host, Strings} from '../typechain';

const { expect } = chai;

describe('Packet', () => {
    let rules: string[] = ["*,*,*"]
    let routing: Routing
    let clientManager: ClientManager
    let accounts: Signer[]
    let packet: Packet

    before('deploy Routing', async () => {
        accounts = await ethers.getSigners();
        const msrFactory = await ethers.getContractFactory('Routing', accounts[0])
        routing = (await msrFactory.deploy(rules)) as Routing
    })
    before('deploy Packet', async () => {
        accounts = await ethers.getSigners();
        const msrFactory = await ethers.getContractFactory('ClientManager', accounts[0])
        clientManager = (await msrFactory.deploy()) as ClientManager
        const rtFactory = await ethers.getContractFactory('Routing', accounts[0])
        routing = (await rtFactory.deploy(rules)) as Routing
        const pkFactory = await ethers.getContractFactory('Packet', accounts[0])
        packet = (await pkFactory.deploy(clientManager.address, routing.address)) as Packet
    })

    it("Should success if rule in rules", async function () {
        let source = "wenchangchain";
        let dest = "iris-hub";
        let port = "nft";
        const result = await routing.authenticate(source, dest, port);
        expect(result).to.equal(true);
    });
})