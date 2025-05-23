const { ethers } = require('hardhat');

async function main() {
    const factory = await ethers.getContractFactory('Identity');
    const identity = await factory.deploy();
    await identity.waitForDeployment();

    const address = await identity.getAddress();
    console.log(`Identity deployed to: ${address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
