// scripts/propose-upgrade.js
const { defender } = require("hardhat");

async function main() {
  const proxyAddress = '0x5696b6aCe2ee93696D9866FaA5ca000d00696109';
  const upgradedContract = await ethers.getContractFactory("UptickGateway");
  console.log("Preparing proposal...");
  const proposal = await defender.proposeUpgrade(proxyAddress, upgradedContract);
  console.log("Upgrade proposal created at:", proposal.url);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })