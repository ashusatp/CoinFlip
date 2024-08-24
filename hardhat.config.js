// require("@nomicfoundation/hardhat-toolbox");

// module.exports = {
//   solidity: "0.8.18",
//   network: {
//     hardhar: {
//       chainId: 1337,
//       url: "http://127.0.0.1:8545",
//     },
//   },
//   paths: {
//     artifacts: "./client/src/artifacts",
//   },
// };

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
  paths: {
    artifacts: "./client/src/artifacts",
  },
};
