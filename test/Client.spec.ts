import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import chai from "chai";
import { ClientManager, Tendermint, TestMerkleTree, TestLightClient } from '../typechain';


let client = require("./proto/client.js");
const { expect } = chai;

describe('Client', () => {
    let accounts: Signer[]
    let clientManager: ClientManager
    let tmClient: Tendermint

    before('deploy ClientManager', async () => {
        accounts = await ethers.getSigners();
        const msrFactory = await ethers.getContractFactory('ClientManager', {
            signer: accounts[0],
            libraries: {
                //SimpleMerkleTree: merkleLib.address
            },
        })
        clientManager = (await msrFactory.deploy()) as ClientManager

        const tmFactory = await ethers.getContractFactory('Tendermint', accounts[0])
        tmClient = (await tmFactory.deploy(clientManager.address)) as Tendermint
    })

    it("generate merkle root", async function () {
        const mkFactory = await ethers.getContractFactory('TestMerkleTree', accounts[0])
        const mk = (await mkFactory.deploy()) as TestMerkleTree
        //let data: any = []
        let data: any = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]
        let root = await mk.hashFromByteSlices(data);
        expect(root).to.eq("0xf326493eceab4f2d9ffbc78c59432a0a005d6ea98392045c74df5d14a113be18")
    })

    // TODO
    it("add client", async function () {
        let clientState = {
            chainId: "testA",
            trustLevel: {
                numerator: 1,
                denominator: 3
            },
            trustingPeriod: 1209600,
            unbondingPeriod: 1814400,
            maxClockDrift: 10,
            latestHeight: {
                revisionNumber: 0,
                revisionHeight: 4
            },
            timeDelay: 0,
        };
        let clientStateBuf = client.ClientState.encode(clientState).finish();

        let consensusState = {
            timestamp: {
                secs: 1630014534,
                nanos: 0,
            },
            root: Buffer.from("YXBwX2hhc2g=", "base64"),
            nextValidatorsHash: Buffer.from("8C532894EF659A1BBD8F9C6D340D55C768431DB79BFD8F85ABE5BEA59ADC55EA", "hex")
        }
        let consensusStateBuf = client.ConsensusState.encode(consensusState).finish();

        await clientManager.createClient("irishub", tmClient.address, clientStateBuf, consensusStateBuf)

        let irishubClient = await clientManager.clients("irishub")
        expect(irishubClient).to.eq(tmClient.address)

        let expClientState = (await tmClient.clientState())
        expect(expClientState.chain_id).to.eq("testA")

        let expConsensusState = (await tmClient.consensusStates(clientState.latestHeight.revisionHeight))
        expect(expConsensusState.root.slice(2)).to.eq(consensusState.root.toString("hex"))
    })

    // it("verifyNonAdjacent", async function () {
    //     const lightFactory = await ethers.getContractFactory('TestLightClient', accounts[0])
    //     const light = (await lightFactory.deploy()) as TestLightClient

    //     const trustedHeader: any = {
    //         "header": {
    //             "version": {
    //                 "block": 11,
    //                 "app": 0
    //             },
    //             "chain_id": "chain-JXnmKy",
    //             "height": 8,
    //             "time": "2021-09-02T03:35:24.178071Z",
    //             "last_block_id": {
    //                 "hash": "zj1LYMeEjqql0mURNnZvVIeDiFAvVGPdLwxvKUUaKyo=",
    //                 "part_set_header": {
    //                     "total": 1,
    //                     "hash": "rj+xQp7M9Ve6ViZ+CcBF72H8/geY8uI7a31dorsnLxI="
    //                 }
    //             },
    //             "last_commit_hash": "1P4U8HKBJ2o0fLwWEeOIFKaPs74YMQx2e8MnE1vpK50=",
    //             "data_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
    //             "validators_hash": "eCbeLK2wUY2SbndGyKwfyJTWsvslhGkJgQZrV9e3p9k=",
    //             "next_validators_hash": "eCbeLK2wUY2SbndGyKwfyJTWsvslhGkJgQZrV9e3p9k=",
    //             "consensus_hash": "BICRvH3cKD93v7+R1zxE2ljD34qcvIZ0Bdi389qtoi8=",
    //             "app_hash": "7X68jO3Vbcb5XqvX26gmpEe/g4t5fXsVVtmyH/7TyuU=",
    //             "last_results_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
    //             "evidence_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
    //             "proposer_address": "djMOg4IWIaKRgnmnBCcjDVXqiBU="
    //         },
    //         "commit": {
    //             "height": 8,
    //             "round": 0,
    //             "block_id": {
    //                 "hash": "dOr8HpJPYWbFUH1B1LeV1m8f06z3LZQSVhjB+wW0HZ4=",
    //                 "part_set_header": {
    //                     "total": 1,
    //                     "hash": "CDzP3jpd5oRZ4+3b6r+Bp18QbnNlmhL5hoKV70j8zQ4="
    //                 }
    //             },
    //             "signatures": [
    //                 {
    //                     "block_id_flag": "2",
    //                     "validator_address": "djMOg4IWIaKRgnmnBCcjDVXqiBU=",
    //                     "timestamp": "2021-09-02T03:35:29.255085Z",
    //                     "signature": "bUtkqfrWUsJXUPdR9FSNMsl4x2yn5cqsjVCf/8qo2b+CdZTv/9zj93a9e/tdwXiCjpzndq+plWZDM2so1N52Ag=="
    //                 }
    //             ]
    //         }
    //     };
    //     const trustedVals: any = {
    //         "validators": [
    //             {
    //                 "address": "djMOg4IWIaKRgnmnBCcjDVXqiBU=",
    //                 "pub_key": {
    //                     "ed25519": "S859myFP7iFtzceM8ZoOEzoeTBIy84ERe0vcHen8ZWM="
    //                 },
    //                 "voting_power": 100,
    //                 "proposer_priority": 0
    //             }
    //         ],
    //         "proposer": {
    //             "address": "djMOg4IWIaKRgnmnBCcjDVXqiBU=",
    //             "pub_key": {
    //                 "ed25519": "S859myFP7iFtzceM8ZoOEzoeTBIy84ERe0vcHen8ZWM="
    //             },
    //             "voting_power": 100,
    //             "proposer_priority": 0
    //         },
    //         "total_voting_power": 0
    //     };
    //     const untrustedHeader: any = {
    //         "header": {
    //             "version": {
    //                 "block": 11,
    //                 "app": 0
    //             },
    //             "chain_id": "chain-JXnmKy",
    //             "height": 20,
    //             "time": "2021-09-02T03:36:25.096064Z",
    //             "last_block_id": {
    //                 "hash": "ZgJK8TTIE/C1019SZYSB3H+53PQsblAQCAARCiF1mo8=",
    //                 "part_set_header": {
    //                     "total": 1,
    //                     "hash": "D1uDB3EkogSIPgK6+yUHcBMCg3qyuaTasI6nEZf/Xmk="
    //                 }
    //             },
    //             "last_commit_hash": "PUfO+RHD9de0ZGPzmygZ1t/xlLusr0ZEC/FJB276Cnk=",
    //             "data_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
    //             "validators_hash": "eCbeLK2wUY2SbndGyKwfyJTWsvslhGkJgQZrV9e3p9k=",
    //             "next_validators_hash": "eCbeLK2wUY2SbndGyKwfyJTWsvslhGkJgQZrV9e3p9k=",
    //             "consensus_hash": "BICRvH3cKD93v7+R1zxE2ljD34qcvIZ0Bdi389qtoi8=",
    //             "app_hash": "YhFQUF8wq+4CS7+i+B6T2pfN27BUwa2tsdtYZSzBLpc=",
    //             "last_results_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
    //             "evidence_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
    //             "proposer_address": "djMOg4IWIaKRgnmnBCcjDVXqiBU="
    //         },
    //         "commit": {
    //             "height": 20,
    //             "round": 0,
    //             "block_id": {
    //                 "hash": "UbH145tGdgi5n2UY2rigtAZmw4/VPrF/2sR2lbbYJN4=",
    //                 "part_set_header": {
    //                     "total": 1,
    //                     "hash": "VU+Cf1FhJdYNpCYwyg+X3BNlj+1oEqlS8NIoK5KZlAA="
    //                 }
    //             },
    //             "signatures": [
    //                 {
    //                     "block_id_flag": "2",
    //                     "validator_address": "djMOg4IWIaKRgnmnBCcjDVXqiBU=",
    //                     "timestamp": "2021-09-02T03:36:30.166392Z",
    //                     "signature": "S2ZlY1Mz97fnrxalf/xN0bULeKF6EfLqjiNhNbVC1Y0bnodcbsbB7HltHx69l90F/nI7kCrfSmxzgSAiYaMiAA=="
    //                 }
    //             ]
    //         }
    //     };
    //     const untrustedVals: any = {
    //         "validators": [
    //             {
    //                 "address": "djMOg4IWIaKRgnmnBCcjDVXqiBU=",
    //                 "pub_key": {
    //                     "ed25519": "S859myFP7iFtzceM8ZoOEzoeTBIy84ERe0vcHen8ZWM="
    //                 },
    //                 "voting_power": 100,
    //                 "proposer_priority": 0
    //             }
    //         ],
    //         "proposer": {
    //             "address": "djMOg4IWIaKRgnmnBCcjDVXqiBU=",
    //             "pub_key": {
    //                 "ed25519": "S859myFP7iFtzceM8ZoOEzoeTBIy84ERe0vcHen8ZWM="
    //             },
    //             "voting_power": 100,
    //             "proposer_priority": 0
    //         },
    //         "total_voting_power": 0
    //     };
    //     const trustingPeriod = 36000;
    //     const nowTime = { secs: 1630554350, nanos: 0 };
    //     const maxClockDrift = 600;
    //     const trustLevel: any = { numerator: 2, denominator: 1 };

    //     let trustedHeader1 = client.SignedHeader.encode(trustedHeader).finish();
    //     let untrustedHeader1 = client.SignedHeader.encode(untrustedHeader).finish();

    //     let trustedVals1 = client.ValidatorSet.encode(trustedVals).finish();
    //     let untrustedVals1 = client.ValidatorSet.encode(untrustedVals).finish();

    //     console.log(2)
    //     light.verifyNonAdjacent(trustedHeader1, trustedVals1, untrustedHeader1, untrustedVals1, trustingPeriod, nowTime, maxClockDrift, trustLevel);
    // })
})