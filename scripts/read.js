const { ethers } = require('hardhat');

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const IdentityRegistry = await ethers.getContractAt(
    'Identity',
    contractAddress
  );

  const myaddress = process.env.WALLET_ADDRESS;
  const [username, profilePicture] =
    await IdentityRegistry.getIdentity(myaddress);
  console.log(`Your username: ${username}\nYour profile: ${profilePicture}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
