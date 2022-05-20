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
import "./tasks/erc721Bank"

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
    testnet: {
      url: 'http://127.0.0.1:8545',
      gasPrice: 1,
      chainId: 1223,
      gas: 4000000,
      // 部署账户
      // accounts: ['820BFE6664E4D529453410AA1A17C56851B68412A954772655267CCC092FAF73'],
      // nft 用户
      // accounts: ['224629AAF75CB93999D054C23ABB07DFEE31CD28FD57A87F106F09BF2B504835'],
      // ddc 账户
      accounts: ['DFD55CDE653ECD9EC0EFCB9443610550CA966970B44AA553C042903010211025'],
    },
    dev: {
      url: 'http://192.168.150.42:8545',
      gasPrice: 1,
      chainId: 1223,
      gas: 4000000,
      accounts: ['2E71B23A00385B5B9A6BE8F3D5600A34A09F31E8AFC5AFE2193B14EB8AD0120F'],
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