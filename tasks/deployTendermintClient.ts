import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config"
const config = require('./config')

task("deployTendermint", "Deploy Tendermint Client")
    .setAction(async (taskArgs, hre) => {
        await config.load(async function (env: any) {
            const tendermintFactory = await hre.ethers.getContractFactory('Tendermint', {
                libraries: {
                    ClientStateCodec: env.CLIENT_STATE_CODEC_ADDRES,
                    ConsensusStateCodec: env.CONSENSUS_STATE_CODEC_ADDRES,
                    Verifier: env.VERIFIER_ADDRES,
                }
            })

            const tendermint = await hre.upgrades.deployProxy(tendermintFactory, [env.CLIENT_MANAGER_ADDRES],
                { "unsafeAllowLinkedLibraries": true });
            await tendermint.deployed();
            env.TENDERMINT_ADDRES = tendermint.address
            console.log("Tendermint deployed to:", tendermint.address);
        },true)
    });
module.exports = {};
