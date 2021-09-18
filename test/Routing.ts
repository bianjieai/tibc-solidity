// import { ethers } from "hardhat";
// import { Signer } from "ethers";
// import chai from "chai";

// import { Routing } from '../typechain';

// const { expect } = chai;

// describe('Routing', () => {
//     let accounts: Signer[]
//     let routing: Routing


//     before('deploy Routing', async () => {
//         accounts = await ethers.getSigners();
//         const msrFactory = await ethers.getContractFactory('Routing', accounts[0])
//         routing = (await msrFactory.deploy()) as Routing
//     })

//     it("Should success if rule in rules", async function () {
//         let rules: string[] = ["wenchangchain,iris-hub,nft", "wenchangchain,bsn-hub,*"]
//         routing.setRoutingRules(rules)
//         let source = "wenchangchain";
//         let dest = "iris-hub";
//         let port = "nft";
//         const result = await routing.authenticate(source, dest, port);
//         expect(result).to.equal(true);
//     });

//     it("Should fail if rule not in rules", async function () {
//         let rules: string[] = ["wenchangchain,iris-hub,nft", "wenchangchain,bsn-hub,*"]
//         routing.setRoutingRules(rules)
//         let source = "iris-hub";
//         let dest = "wenchangchain";
//         let port = "nft";
//         const result = await routing.authenticate(source, dest, port);
//         expect(result).to.equal(false);
//     });

//     it("Set rules ", async function () {
//         let mRules: string[] = ["bsn-hub,iris-hub,nft", "iris-hub,bsn-hub,*"]
//         routing.setRoutingRules(mRules)
//         let ruleIndex01 = await routing.rules(0)
//         expect(ruleIndex01).to.equal("bsn-hub,iris-hub,nft");
//         let ruleIndex02 = await routing.rules(1)
//         expect(ruleIndex02).to.equal("iris-hub,bsn-hub,*");
//         let source = "iris-hub";
//         let dest = "wenchangchain";
//         let port = "nft";
//         const result = await routing.authenticate(source, dest, port);
//         expect(result).to.equal(false);
//     });

// })