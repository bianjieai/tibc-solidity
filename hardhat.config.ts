import "@nomiclabs/hardhat-waffle"
import "@openzeppelin/hardhat-upgrades"
import "@openzeppelin/hardhat-defender"
import "@nomiclabs/hardhat-ethers"
import "@typechain/hardhat"
import "hardhat-gas-reporter"
import "hardhat-contract-sizer"
import "hardhat-abi-exporter"
import "./tasks/deployLibraries"
import "./tasks/deployTendermintClient"
import "./tasks/deployClientManager"
import "./tasks/deployPacket"
import "./tasks/deployRouting"
import "./tasks/deployERC1155Bank"
import "./tasks/deployNFTTransfer"
import "./tasks/deployAccessManager"

module.exports = {
  defaultNetwork: 'hardhat',
  defender: {
    apiKey: "",
    apiSecret: "",
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/023f2af0f670457d9c4ea9cb524f0810',
      gasPrice: 1500000000,
      chainId: 4,
      gas: 4100000,
      accounts: ['d0ce43e074a9a057b4ba6b018e7a1f4072246f288be3a6e72d1805de4c9ad4dd'],
    },
  },
  solidity: {
    version: '0.6.8',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    }
  },
  gasReporter: {
    enabled: true,
    showMethodSig: true,
    maxMethodDiff: 10,
    currency: 'USD',
    gasPrice: 127,
    coinmarketcap: '5a0938c9-7912-438b-9baa-fcd71007b3d0'
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  abiExporter: {
    path: './abi',
    clear: true,
    spacing: 2,
  }
}