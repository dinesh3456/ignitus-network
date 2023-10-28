const { ethers } = require("hardhat");
//const { ethers } = require("ethers");
const fs = require("fs");
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Get the ContractFactory for NFTMarketplace
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");

  // Deploy the NFTMarketplace contract
  const nftMarketplace = await NFTMarketplace.deploy(
    "MYNFTMarketplace",
    "MNFT",
    deployer.address // Pass the initial owner's address here
  );

  // Wait for the contract to be mined
  await nftMarketplace.deployed();

  console.log("NFTMarketplace deployed to:", nftMarketplace.address);

  // Save the contract address to a JSON file
  const contractsDir = __dirname + "/../../frontend/contractsData";
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/NFTMarketplace-address.json",
    JSON.stringify({ address: nftMarketplace.address }, undefined, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
