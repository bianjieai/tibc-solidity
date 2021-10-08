import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import chai from "chai";
import { TestMerkleTree, TestLightClient } from '../typechain';

const { expect } = chai;

describe('TestMerkleTree', () => {
    let accounts: Signer[]
    let testMerkleTree: TestMerkleTree
    let light: TestLightClient

    before('deploy TestMerkleTree', async () => {
        accounts = await ethers.getSigners();
        const mkFactory = await ethers.getContractFactory('TestMerkleTree', accounts[0])
        testMerkleTree = (await mkFactory.deploy()) as TestMerkleTree

        const lcFactory = await ethers.getContractFactory('TestLightClient', accounts[0])
        light = (await lcFactory.deploy()) as TestLightClient

    })

    it("test hashFromByteSlices", async function () {
        //let data: any = []
        let data: any = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]
        let root = await testMerkleTree.hashFromByteSlices(data);
        expect(root).to.eq("0xf326493eceab4f2d9ffbc78c59432a0a005d6ea98392045c74df5d14a113be18")
    })

    it("test verifyMembership", async function () {
        let proofBz = Buffer.from("0a1f0a1d0a054d594b455912074d5956414c55451a0b0801180120012a030002020a3d0a3b0a0c6961766c53746f72654b65791220a758f4decb5c7b9d4a45601b60400c638c9c3eef5380fbc29f0c638613be75c71a090801180120012a0100", "hex")
        let specsBz: any = [
            Buffer.from("0a090801180120012a0100120c0a02000110211804200c3001", "hex"),
            Buffer.from("0a090801180120012a0100120c0a0200011020180120013001", "hex"),
        ]
        let rootBz = Buffer.from("0a20edc765d6a5287a238227cf19f101b201922cbaec0f915b2c7bc767aa6368c3b5", "hex")
        let pathBz = Buffer.from("0a0c6961766c53746f72654b65790a054d594b4559", "hex")
        let value = Buffer.from("4d5956414c5545", "hex")
        await testMerkleTree.verifyMembership(proofBz, specsBz, rootBz, pathBz, value);
    })

    it("test genValidatorSetHash", async function () {
        //let data: any = []
        let data: any = Buffer.from("0a3c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc721864123c0a14c42d7c8a0a7a831c19fbda4b050910629bf2b16b12220a208522460be5acf8faefedca5b72b8a546f9ce485f2155815a529ed132b0fdcc721864", "hex")
        let valSetHash = await light.genValidatorSetHash(data);
        expect(valSetHash).to.eq("0x0757f0bc673f8df26d61d3e74bb6181ac9df88c09a1100c6fade264604b4c478")
    })
})