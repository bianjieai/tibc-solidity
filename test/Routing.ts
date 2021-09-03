import { ethers } from "hardhat";
import { Signer } from "ethers";
import chai from "chai";

import { Routing } from '../typechain';

const { expect } = chai;

describe('Routing', () => {
    let rules: string[] = ["wenchangchain,iris-hub,nft", "wenchangchain,bsn-hub,*"]
    let accounts: Signer[]
    let routing: Routing


    before('deploy Routing', async () => {
        accounts = await ethers.getSigners();
        const msrFactory = await ethers.getContractFactory('Routing', accounts[0])
        routing = (await msrFactory.deploy(rules)) as Routing
    })

    it("Should success if rule in rules", async function () {
        let source = "wenchangchain";
        let dest = "iris-hub";
        let port = "nft";
        const result = await routing.authenticate(source, dest, port);
        expect(result).to.equal(true);
    });

    it("Should fail if rule not in rules", async function () {
        let source = "iris-hub";
        let dest = "wenchangchain";
        let port = "nft";
        const result = await routing.authenticate(source, dest, port);
        expect(result).to.equal(false);
    });

})