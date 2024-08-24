const hre = require("hardhat");

async function main() {
    try {
        // Get the contract factory
        const CoinFlip = await hre.ethers.getContractFactory("CoinFlip");

        // Deploy the contract
        const coinFlip = await CoinFlip.deploy();

        // Wait for the deployment transaction to be mined
        await coinFlip.waitForDeployment();

        // Log the deployed contract's address
        const address = await coinFlip.getAddress();
        console.log("Contract deployed to:", address);
        
    } catch (error) {
        console.error("Error during deployment:", error);
        process.exitCode = 1;
    }
}

main();
