import "@nomiclabs/hardhat-web3";
import { ethers } from "hardhat";
import { task, types } from "hardhat/config"



task("deployClientManager", "Deploy Client Manager")
    .addParam("chain", "Chain Name")
    .setAction(async (taskArgs, hre) => {
        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await clientManagerFactory.deploy(taskArgs.chain);
        await clientManager.deployed();
        console.log("Client Manager deployed to:", clientManager.address);
        console.log("export CLIENT_MANAGER_ADDRES=%s", clientManager.address);
    });


task("createClient", "Deploy Client Manager")
    .setAction(async (taskArgs, hre) => {

        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await clientManagerFactory.attach("0x37f10a5Ac9B517E529fa5A503Fb3ED9178E389BF");
        let client = require("../test/proto/compiled.js");
        let clientState: any = {
            chainId: "irishub-testnet",
            trustLevel: {
                numerator: 1,
                denominator: 3
            },
            trustingPeriod: 10 * 24 * 60 * 60,
            unbondingPeriod: 1814400,
            maxClockDrift: 10,
            latestHeight: {
                revisionNumber: 0,
                revisionHeight: 4
            },
            merklePrefix: {
                keyPrefix: Buffer.from("74696263", "hex"),
            },
            timeDelay: 0,
        };

        let consensusState: any = {
            timestamp: {
                secs: 1631517854,
                nanos: 5829,
            },
            root: Buffer.from("YXBwX2hhc2g=", "base64"),
            nextValidatorsHash: Buffer.from("C3B5A8C6730DCE1E855BB03498D0E68FB5AFA4C5FB667649644CA235BC0D796E", "hex")
        }

        let clientStateBuf = client.ClientState.encode(clientState).finish();
        let consensusStateBuf = client.ConsensusState.encode(consensusState).finish();
        const result = await clientManager.createClient("irishub-testnet09",
            "0x31e77aA1dca33EF0c63f2d5Dd5EF520A8Dd7D8bb",
            clientStateBuf,
            consensusStateBuf)
        console.log(result);
        // const result2 = await clientManager.getLatestHeight("irishub-testnet07")
        // console.log(result2);
    });

task("reisterRelayer", "Deploy Client Manager")
    .setAction(async (taskArgs, hre) => {

        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await clientManagerFactory.attach("0x37f10a5Ac9B517E529fa5A503Fb3ED9178E389BF");

        const result2 = await clientManager.registerRelayer("irishub-testnet09", "0xF99320100d3B02840971940a2f749b3E3A9B3f11")
        console.log(result2);
    });

task("getRelayers", "Deploy Client Manager")
    .setAction(async (taskArgs, hre) => {

        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await clientManagerFactory.attach("0x37f10a5Ac9B517E529fa5A503Fb3ED9178E389BF");

        const result = await clientManager.relayers("irishub-testnet09", "0xF99320100d3B02840971940a2f749b3E3A9B3f11")
        console.log(result);
    });

task("updateClient", "Deploy Client Manager")
    .setAction(async (taskArgs, hre) => {

        const clientManagerFactory = await hre.ethers.getContractFactory('ClientManager')

        const clientManager = await clientManagerFactory.attach("0x37f10a5Ac9B517E529fa5A503Fb3ED9178E389BF");

        const result = await clientManager.updateClient("irishub-testnet09", Buffer.from("0ad3040a96030a02080b120f697269736875622d746573746e657418fa0a220c0881f7818a0610c0e591f0012a480a20afd2e923f24a447bec8e4a217b637f96b5f6a27f6bd4b8f8017cb6a4332b5e8f122408011220c75197a51e0daec8f4bac3f75318ef3e3a02359d5c2f23b55b61f8d5ee96d29632205b349fe4ce5223b42a24df9105a1df936d55c107fb198d93408fdf980f5fab863a20e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8554220c3b5a8c6730dce1e855bb03498d0e68fb5afa4c5fb667649644ca235bc0d796e4a20c3b5a8c6730dce1e855bb03498d0e68fb5afa4c5fb667649644ca235bc0d796e5220048091bc7ddc283f77bfbf91d73c44da58c3df8a9cbc867405d8b7f3daada22f5a205ae0080e93eb2ef6646907c4abaed901e3038d2805d2f1da3dbe58df284a9e4f6220e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8556a20e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8557214bc09b3b8be332cc4eb2a6e7f32a7f28bbdda1ce612b70108fa0a1a480a204a700422a2c7a8e15f124874f61345a449b5fe80f75fc3c633cbfc0753d766eb1224080112201197928e980e19ba96f7413fddfb436eb2a41b6569489513cda086b4f0bffed8226808021214bc09b3b8be332cc4eb2a6e7f32a7f28bbdda1ce61a0c0886f7818a0610b891bcba022240bc550f7bea14db742a420c3d77e5067d317d38fced8e480757ced598fd00ae9235e2ac2c54f1a1dd826285a1b21d3d5571c83784da4cddd3b8323fab2204370a127e0a3c0a14bc09b3b8be332cc4eb2a6e7f32a7f28bbdda1ce612220a205017c94ece02c8a108621b2504b4047573d42fddc4285e1db9f363b9be4a358f1864123c0a14bc09b3b8be332cc4eb2a6e7f32a7f28bbdda1ce612220a205017c94ece02c8a108621b2504b4047573d42fddc4285e1db9f363b9be4a358f186418641a021004227e0a3c0a14bc09b3b8be332cc4eb2a6e7f32a7f28bbdda1ce612220a205017c94ece02c8a108621b2504b4047573d42fddc4285e1db9f363b9be4a358f1864123c0a14bc09b3b8be332cc4eb2a6e7f32a7f28bbdda1ce612220a205017c94ece02c8a108621b2504b4047573d42fddc4285e1db9f363b9be4a358f18641864", "hex"))

        console.log(await result.wait());
    });

module.exports = {};
