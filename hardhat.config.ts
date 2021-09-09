import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import "hardhat-gas-reporter"
import "hardhat-contract-sizer"

import { HardhatUserConfig } from 'hardhat/types'

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [{ version: '0.6.8', settings: {} }],
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      //blockGasLimit: 80000000,
    },
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
  }
}

export default config