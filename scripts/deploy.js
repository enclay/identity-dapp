const hre = require("hardhat");

async function main() {
  const Identity = await hre.ethers.getContractFactory("Identity");
  const identity = await Identity.deploy();

  await identity.waitForDeployment();

  const address = await identity.getAddress();
  console.log(`Identity deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
