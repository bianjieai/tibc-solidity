import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config"
const fs = require('./utils')

task("deployLibraries", "Deploy All Libraries")
    .setAction(async (taskArgs, hre) => {
        const ClientStateCodec = await hre.ethers.getContractFactory('ClientStateCodec')
        const clientStateCodec = await ClientStateCodec.deploy();
        await clientStateCodec.deployed();

        const ConsensusStateCodec = await hre.ethers.getContractFactory('ConsensusStateCodec')
        const consensusStateCodec = await ConsensusStateCodec.deploy();
        await consensusStateCodec.deployed();

        const ProofCodec = await hre.ethers.getContractFactory('ProofCodec')
        const proofCodec = await ProofCodec.deploy();
        await proofCodec.deployed();

        const Verifier = await hre.ethers.getContractFactory('Verifier', {
            libraries: {
                ProofCodec: proofCodec.address,
            },
        })
        const verifierLib = await Verifier.deploy();
        await verifierLib.deployed();

        console.log("ClientStateCodec deployed to:", clientStateCodec.address);
        console.log("ConsensusStateCodec deployed to:", consensusStateCodec.address);
        console.log("ProofCodec deployed to:", proofCodec.address);
        console.log("Verifier deployed to:", verifierLib.address);

        await fs.readAndWriteEnv(function (env: any) {
            env.CLIENT_STATE_CODEC_ADDRES = clientStateCodec.address
            env.CONSENSUS_STATE_CODEC_ADDRES = consensusStateCodec.address
            env.PROOF_CODEC_ADDRES = proofCodec.address
            env.VERIFIER_ADDRES = verifierLib.address
        })
    });

module.exports = {};
