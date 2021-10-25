// scripts/propose-upgrade.js
const { defender } = require("hardhat");

async function main() {
  const proxyAddress = '0xFC2dB9A9d30DFeE8818b62960e3610D8423Ef321';

  const MockAccessManager = await ethers.getContractFactory("MockAccessManager");
  console.log("Preparing proposal...");
  const proposal = await defender.proposeUpgrade(proxyAddress, MockAccessManager);
  console.log("Upgrade proposal created at:", proposal.url);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })