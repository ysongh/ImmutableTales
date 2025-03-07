const { ethers } = require('ethers');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const StoryGameArtifact = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../artifacts/contracts/StoryGameFactory.sol/StoryGameFactory.json'), 'utf8'));
const StoryGameABI = StoryGameArtifact.abi;
const StoryGameAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const StoryGameManager = new ethers.Contract(StoryGameAddress, StoryGameABI, wallet);

async function createStoryGame(title) {
  try {
    const tx = await StoryGameManager.createStoryGame(title);
    const receipt = await tx.wait();
    
    console.log(`Transaction successful with hash: ${receipt.hash}`);
  } catch (error) {
    console.error('Error create story game transaction:', error);
  }
}

async function startStory() {
  try {
    const tx = await StoryGameManager.startStory();
    const receipt = await tx.wait();
    
    console.log(`Transaction successful with hash: ${receipt.hash}`);
  } catch (error) {
    console.error('Error start story transaction:', error);
  }
}

async function addStoryNode() {
  try {
    const tx = await StoryGameManager.addStoryNode(0, "Test", [1, 2, 3, 4]);
    const receipt = await tx.wait();
    
    console.log(`Transaction successful with hash: ${receipt.hash}`);
  } catch (error) {
    console.error('Error add Story Node transaction:', error);
  }
}

async function startStory() {
  try {
    const tx = await StoryGameManager.startStory();
    const receipt = await tx.wait();
    
    console.log(`Transaction successful with hash: ${receipt.hash}`);
  } catch (error) {
    console.error('Error start story transaction:', error);
  }
}

async function getCurrentNode() {
  try {
    const nodes = await StoryGameManager.getCurrentNode();
    console.log(nodes);
  } catch (error) {
    console.error('Error reading current node:', error);
  }
}

async function makeChoice() {
  try {
    const tx = await StoryGameManager.makeChoice(0, 1);
    const receipt = await tx.wait();
    
    console.log(`Transaction successful with hash: ${receipt.hash}`);
  } catch (error) {
    console.error('Error make choice transaction:', error);
  }
}


async function runPlan() {
  // await startStory();
  await addStoryNode();
}

createStoryGame("Found a treasure");
// getCurrentNode();
// runPlan();
// makeChoice();