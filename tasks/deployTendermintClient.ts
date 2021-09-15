import "@nomiclabs/hardhat-web3";
import { ethers } from "hardhat";
import { task, types } from "hardhat/config"

const CLIENT_STATE_CODEC_ADDRES = process.env.CLIENT_STATE_CODEC_ADDRES;
const CONSENSUS_STATE_CODEC_ADDRES = process.env.CONSENSUS_STATE_CODEC_ADDRES;
const PROOF_CODEC_ADDRES = process.env.PROOF_CODEC_ADDRES;
const HEADER_CODEC_ADDRES = process.env.HEADER_CODEC_ADDRES;
const VERIFIER_ADDRES = process.env.VERIFIER_ADDRES;
const CLIENT_MANAGER_ADDRES = process.env.CLIENT_MANAGER_ADDRES;

task("deployTendermint", "Deploy Tendermint Client")
    .setAction(async (taskArgs, hre) => {
        const tendermintFactory = await hre.ethers.getContractFactory('Tendermint', {
            libraries: {
                ClientStateCodec: String(CLIENT_STATE_CODEC_ADDRES),
                ConsensusStateCodec: String(CONSENSUS_STATE_CODEC_ADDRES),
                HeaderCodec: String(HEADER_CODEC_ADDRES),
                Verifier: String(VERIFIER_ADDRES),
            }
        })

        const tendermint = await hre.upgrades.deployProxy(tendermintFactory, [String(CLIENT_MANAGER_ADDRES)],
            { "unsafeAllowLinkedLibraries": true });
        await tendermint.deployed();
        console.log("Tendermint deployed to:", tendermint.address);
    });

module.exports = {};
