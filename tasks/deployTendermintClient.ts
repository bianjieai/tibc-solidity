import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config"
const fs = require('./utils')

task("deployTendermint", "Deploy Tendermint Client")
    .setAction(async (taskArgs, hre) => {
        await fs.readAndWriteEnv(async function (env: any) {
            const tendermintFactory = await hre.ethers.getContractFactory('Tendermint', {
                libraries: {
                    ClientStateCodec: String(env.CLIENT_STATE_CODEC_ADDRES),
                    ConsensusStateCodec: String(env.CONSENSUS_STATE_CODEC_ADDRES),
                    Verifier: String(env.VERIFIER_ADDRES),
                }
            })

            const tendermint = await hre.upgrades.deployProxy(tendermintFactory, [String(env.CLIENT_MANAGER_ADDRES)],
                { "unsafeAllowLinkedLibraries": true });
            await tendermint.deployed();
            env.TENDERMINT_ADDRES = tendermint.address
            console.log("Tendermint deployed to:", tendermint.address);
        })
    });
module.exports = {};
