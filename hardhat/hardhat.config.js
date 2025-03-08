require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    mantleSepolia: {
      url: "https://rpc.sepolia.mantle.xyz", // Sepolia Testnet
      accounts: [process.env.PRIVATE_KEY ?? ""],
    },
  },
};
