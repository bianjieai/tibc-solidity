import { ethers, upgrades } from "hardhat";
import { Signer } from "ethers";
import chai from "chai";

import { AccessManager } from '../typechain';

const { expect } = chai;
const keccak256 = require('keccak256');

describe('AccessManager', () => {
    let accounts: Signer[]
    let accessManager: AccessManager

    let jiaCangRole = keccak256("JIA_CANG_ROLE");
    
    
    before('deploy AccessManager', async () => {
        accounts = await ethers.getSigners();
        let multiAddr = await accounts[0].getAddress();

        const accessFactory = await ethers.getContractFactory('AccessManager');
        accessManager = (await upgrades.deployProxy(accessFactory, [multiAddr])) as AccessManager
    })

    it("add role should true", async function () {
        let operator = (await accounts[0].getAddress()).toString();
        await accessManager.addRole(jiaCangRole, operator);

        let result = await accessManager.hasRole(jiaCangRole, operator);    
        expect(result).to.equal(true);
    });

    it("grant role & revoke role should true", async function () {
        let operator = (await accounts[0].getAddress()).toString();
        let authorizedPerson = (await accounts[1].getAddress()).toString();
        await accessManager.addRole(jiaCangRole, operator);

        // grant role
        await accessManager.grantRole(jiaCangRole, authorizedPerson);
        let grantResult = await accessManager.hasRole(jiaCangRole, authorizedPerson);    
        expect(grantResult).to.equal(true);

        // revoke role
        await accessManager.revokeRole(jiaCangRole, authorizedPerson);
        let revokeResult = await accessManager.hasRole(jiaCangRole, authorizedPerson);    
        expect(revokeResult).to.equal(false);

    });

})