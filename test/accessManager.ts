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

    it("batch add role should true", async function () {
        let addr0 =  (await accounts[0].getAddress()).toString();
        let addr1 =  (await accounts[1].getAddress()).toString();

        let jiaCangRole = keccak256("JIA_CANG_ROLE");
        let jianCangRole = keccak256("JIAN_CANG_ROLE");

        var roles = [jiaCangRole, jianCangRole];
        var addrs = [addr0, addr1];
        
        await accessManager.batchAddRole(roles, addrs);

        let result = await accessManager.hasRole(jiaCangRole, addr0);    
        expect(result).to.equal(true);

        let result1 = await accessManager.hasRole(jianCangRole, addr1);    
        expect(result1).to.equal(true);
    });

    it("batch grant role & revoke role should true", async function () {
        // batch add role 
        let addr0 =  (await accounts[0].getAddress()).toString();
        let addr1 =  (await accounts[1].getAddress()).toString();
        let addr2 =  (await accounts[2].getAddress()).toString();
        let addr3 =  (await accounts[3].getAddress()).toString();

        let jiaCangRole = keccak256("JIA_CANG_ROLE");
        let jianCangRole = keccak256("JIAN_CANG_ROLE");

        var roles = [jiaCangRole, jianCangRole];
        var addrsAdd = [addr0, addr1];

        await accessManager.batchAddRole(roles, addrsAdd);

        let result = await accessManager.hasRole(jiaCangRole, addr0);    
        expect(result).to.equal(true);

        let result1 = await accessManager.hasRole(jianCangRole, addr1);    
        expect(result1).to.equal(true);

        // batch grant role
        var addrsGrant = [addr2, addr3];
        await accessManager.batchGrantRole(roles, addrsGrant);
        
        let result2 = await accessManager.hasRole(jiaCangRole, addr2);    
        expect(result2).to.equal(true);

        let result3 = await accessManager.hasRole(jianCangRole, addr3);    
        expect(result3).to.equal(true);

        // batch revoke role 
        await accessManager.batchRevokeRole(roles, addrsGrant);
        
        let result4 = await accessManager.hasRole(jiaCangRole, addr2);    
        expect(result4).to.equal(false);

        let result5 = await accessManager.hasRole(jianCangRole, addr3);    
        expect(result5).to.equal(false);
    });
})