import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config"
const config = require('./config')

task("deployTendermint", "Deploy Tendermint Client")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const tendermintFactory = await hre.ethers.getContractFactory('Tendermint', {
                libraries: {
                    ClientStateCodec: env.contract.clientStateCodecAddress,
                    ConsensusStateCodec: env.contract.consensusStateCodecAddress,
                    Verifier: env.contract.proofVerifierAddress,
                }
            })

            const tendermint = await hre.upgrades.deployProxy(tendermintFactory, [env.contract.clientManagerAddress],
                { "unsafeAllowLinkedLibraries": true });
            await tendermint.deployed();
            env.contract.tmLightClientAddress = tendermint.address
            console.log("Tendermint deployed to:", tendermint.address);
        },true)
    });
module.exports = {};
