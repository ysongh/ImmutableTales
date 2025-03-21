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

async function makeChoice(id, choice) {
  try {
    const tx = await StoryGameManager.makeChoice(id, choice);
    const receipt = await tx.wait();
    
    console.log(`Transaction successful with hash: ${receipt.hash}`);
  } catch (error) {
    console.error('Error make choice transaction:', error);
  }
}

async function getAllContentByStoryId(id) {
  try {
    const nodes = await StoryGameManager.getAllContentByStoryId(id);
    console.log(nodes);
  } catch (error) {
    console.error('Error reading current node:', error);
  }
}

async function getAllContent() {
  try {
    const StoryGameArtifact = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../artifacts/contracts/StoryGame.sol/StoryGame.json'), 'utf8'));
    const StoryGameABI = StoryGameArtifact.abi;
    const StoryGameAddress = "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be";
    const StoryGameManager = new ethers.Contract(StoryGameAddress, StoryGameABI, wallet);

    const nodes = await StoryGameManager.getAllContent();
    console.log(nodes);
  } catch (error) {
    console.error('Error reading current node:', error);
  }
}

async function getDeployedStoryGameById(id) {
  try {
    const contractAddress = await StoryGameManager.deployedStoryGames(id);
    console.log(contractAddress);
  } catch (error) {
    console.error('Error reading current node:', error);
  }
}


async function runPlan() {
  // await startStory();
  await addStoryNode();
}

// createStoryGame("Found a treasure");
// getAllContent();
// getAllContentByStoryId(0);
// getDeployedStoryGameById(0);
// runPlan();
// addStoryNode();
makeChoice(0, "Treasure is empty");