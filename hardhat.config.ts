import "@nomiclabs/hardhat-waffle"
import "@openzeppelin/hardhat-upgrades"
import "@openzeppelin/hardhat-defender"
import "@nomiclabs/hardhat-ethers"
import "@typechain/hardhat"
import "hardhat-gas-reporter"
import "hardhat-contract-sizer"
import "hardhat-abi-exporter"
import "./tasks/tendermintLibraries"
import "./tasks/tendermintClient"
import "./tasks/clientManager"
import "./tasks/packet"
import "./tasks/routing"
import "./tasks/erc1155Bank"
import "./tasks/nftTransfer"
import "./tasks/mtTransfer"
import "./tasks/accessManager"
import "./tasks/uptickGateway"

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
    // bsctestnet: {
    //   url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    //   gasPrice: 20000000000,
    //   chainId: 97,
    //   accounts: [''],
    // },
    // bsc: {
    //   url: 'https://bsc-dataseed.binance.org',
    //   gasPrice: 5500000000,
    //   chainId: 56,
    //   accounts: [''],
    // },
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
    runOnCompile: true,
    clear: true,
    spacing: 2
  }
}