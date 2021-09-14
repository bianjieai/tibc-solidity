import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import "hardhat-gas-reporter"
import "hardhat-contract-sizer"
import "hardhat-abi-exporter"
import "./tasks/deployLibraries"
import "./tasks/deployTendermintClient"
import "./tasks/deployClientManager"
import "./tasks/deployPacket"
import "./tasks/deployRouting"
import "./tasks/deployERC1155Bank"
import "./tasks/deployTransfer"


import { HardhatUserConfig } from 'hardhat/types'

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [{
      version: '0.6.8', settings: {
        optimizer: {
          enabled: true,
          runs: 1000,
        },
      }
    }],
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      //blockGasLimit: 80000000,
    },
    rinkeby : {
      url: 'https://rinkeby.infura.io/v3/023f2af0f670457d9c4ea9cb524f0810',
      gasPrice: 1500000000,
      chainId: 4,
      accounts: [],
    }
  },
  gasReporter: {
    enabled: true,
    showMethodSig: true,
    maxMethodDiff: 10,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  abiExporter: {
    path: './abi',
    clear: true,
    spacing: 2,
  }
}

export default config