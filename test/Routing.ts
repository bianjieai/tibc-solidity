import { ethers, upgrades } from "hardhat";
import { Signer } from "ethers";
import chai from "chai";

import { Routing, AccessManager } from '../typechain';

const { expect } = chai;

describe('Routing', () => {
    let accounts: Signer[]
    let routing: Routing

    before('deploy Routing', async () => {
        accounts = await ethers.getSigners();

        const accessFactory = await ethers.getContractFactory('AccessManager');
        const accessManager = (await upgrades.deployProxy(accessFactory, [await accounts[0].getAddress()])) as AccessManager


        const msrFactory = await ethers.getContractFactory('Routing')
        routing = (await upgrades.deployProxy(msrFactory, [accessManager.address])) as Routing
    })

    it("Should success if rule in rules", async function () {
        let rules: string[] = ["wenchangchain,iris-hub,nft", "wenchangchain,bsn-hub,*"]
        await routing.setRoutingRules(rules)
        let source = "wenchangchain";
        let dest = "iris-hub";
        let port = "nft";
        const result = await routing.authenticate(source, dest, port);
        expect(result).to.equal(true);
    });

    it("Should fail if rule not in rules", async function () {
        let rules: string[] = ["wenchangchain,iris-hub,nft", "wenchangchain,bsn-hub,*"]
        routing.setRoutingRules(rules)
        let source = "iris-hub";
        let dest = "wenchangchain";
        let port = "nft";
        const result = await routing.authenticate(source, dest, port);
        expect(result).to.equal(false);
    });

    it("Set rules ", async function () {
        let mRules: string[] = ["bsn-hub,iris-hub,nft", "iris-hub,bsn-hub,*"]
        routing.setRoutingRules(mRules)
        let ruleIndex01 = await routing.router("bsn-hub,iris-hub,nft")
        expect(ruleIndex01.isValue).to.equal(true);
        let ruleIndex02 = await routing.router("iris-hub,bsn-hub,*")
        expect(ruleIndex02.isValue).to.equal(true);
        let source = "iris-hub";
        let dest = "wenchangchain";
        let port = "nft";
        const result = await routing.authenticate(source, dest, port);
        expect(result).to.equal(false);
    });

    it("upgrade routing", async function () {
        const mockRoutingUpgradeFactory = await ethers.getContractFactory("MockRoutingUpgrade");
        const upgradedRouting = await upgrades.upgradeProxy(routing.address, mockRoutingUpgradeFactory);
        expect(upgradedRouting.address).to.eq(routing.address);

        await upgradedRouting.setVersion(2)
        const version = await upgradedRouting.version();
        expect(2).to.eq(version.toNumber())
    })
})