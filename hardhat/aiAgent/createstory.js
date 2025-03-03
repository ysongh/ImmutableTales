const { ethers } = require('ethers');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

let chainId = 31337;

const StoryGameArtifact = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../artifacts/contracts/StoryGame.sol/StoryGame.json'), 'utf8'));
const StoryGameABI = StoryGameArtifact.abi;
const StoryGameAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const StoryGameManager = new ethers.Contract(StoryGameAddress, StoryGameABI, wallet);

async function startStory() {
  try {
    const tx = await StoryGameManager.startStory();
    const receipt = await tx.wait();
    
    console.log(`Transaction successful with hash: ${receipt.hash}`);
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

startStory();