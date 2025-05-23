const { ethers } = require('hardhat');

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const signer = await ethers.getSigner(process.env.WALLET_ADDRESS);

    const IdentityRegistry = await ethers.getContractAt(
        'Identity',
        contractAddress,
        signer
    );

    // Replace these values with what you want to write
    const newUsername = 'Alice Lee';
    const newProfilePicture =
        'https://eos.paradoxwikis.com/images/0/04/Profile_boss_Al_Capone.png';

    console.log(
        `Updating identity for address ${process.env.WALLET_ADDRESS}...`
    );

    const tx = await IdentityRegistry.registerIdentity(
        newUsername,
        newProfilePicture
    );
    console.log('Transaction sent. Waiting for confirmation...');

    await tx.wait();

    console.log('Identity updated successfully!');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
