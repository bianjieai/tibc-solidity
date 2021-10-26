// scripts/propose-upgrade.js
const { defender } = require("hardhat");

async function main() {
  const proxyAddress = '';
  const MockAccessManager = await ethers.getContractFactory("MockClientManager");
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