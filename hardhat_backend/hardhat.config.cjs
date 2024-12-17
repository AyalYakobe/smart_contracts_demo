require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");


const PRIVATE_KEY = process.env.TESTNET_PRIVATE_KEY; // Private key
const RPC_URL = process.env.ALCHEMY_TESTNET_RPC_URL; // RPC URL

module.exports = {
  solidity: {
    version: "0.8.20", // Ensure version matches contracts and OpenZeppelin
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: RPC_URL, // Load RPC URL from .env
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [], // Validate PRIVATE_KEY is defined
    },
  },
};
