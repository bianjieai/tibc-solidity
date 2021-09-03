import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
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
}

export default config