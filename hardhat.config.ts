import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import "hardhat-gas-reporter"

import { HardhatUserConfig } from 'hardhat/types'

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [{ version: '0.6.8', settings: {} }],
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
  },
}

export default config