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
import "./tasks/deployMTTransfer"
import "./tasks/deployAccessManager"
import "./tasks/deployUptickGateway"
import "./tasks/deployMtTransfer"

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
    // rinkeby: {
    //   url: 'https://rinkeby.infura.io/v3/',
    //   gasPrice: 1500000000,
    //   chainId: 4,
    //   gas: 4100000,
    //   accounts: [''],
    // },
    bsctestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      gasPrice: 20000000000,
      chainId: 97,
      accounts: ['f7e4030d552267038a858676c2a376f8379b6fc1f2dba914cb10ca705a622b03'],
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org',
      gasPrice: 20000000000,
      chainId: 56,
      //accounts: [''],
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
    spacing: 2
  }
}