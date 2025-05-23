require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const config = {
  solidity: '0.8.28',
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};

module.exports = config;
