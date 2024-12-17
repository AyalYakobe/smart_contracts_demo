const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Generate example Ethereum addresses
    const wallet1 = ethers.Wallet.createRandom();
    const wallet2 = ethers.Wallet.createRandom();
    const wallet3 = ethers.Wallet.createRandom();

    const multisigOwners = [wallet1.address, wallet2.address, wallet3.address];
    console.log("Example Ethereum addresses:", multisigOwners);

    // Deploy Multisig contract
    const Multisig = await ethers.getContractFactory("Multisig");
    const multisig = await Multisig.deploy(multisigOwners, 2); // Require 2 approvals
    await multisig.deployed();
    console.log("Multisig contract deployed to:", multisig.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contracts:", error);
        process.exit(1);
    });
