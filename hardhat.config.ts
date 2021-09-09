import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import "hardhat-gas-reporter"
import "hardhat-abi-exporter"

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
  abiExporter: {
    path: './abi',
    clear: true,
    spacing: 2,
    // pretty: true,
  }
}

export default config