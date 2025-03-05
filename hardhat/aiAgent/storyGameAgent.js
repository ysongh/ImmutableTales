require('dotenv').config();

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

function createStoryGameAgent(contractAddress, providerUrl) {
  const provider = new ethers.JsonRpcProvider(providerUrl);

  const StoryGameArtifact = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../artifacts/contracts/StoryGame.sol/StoryGame.json'), 'utf8'));
  const StoryGameABI = StoryGameArtifact.abi;
  
  const contract = new ethers.Contract(contractAddress, StoryGameABI, provider);
  
  let listeners = [];
  
  const players = new Map();

  async function trackPlayerChoice(player, choice, nodeIndex) {
    if (!players.has(player)) {
      players.set(player, {
        currentNode: null,
        history: []
      });
    }
    
    const currentNode = await contract.playerStoryState(player);
    
    const playerData = players.get(player);
    playerData.history.push({
      timestamp: Date.now(),
      fromNode: nodeIndex,
      choice,
      toNode: Number(currentNode)
    });
    
    playerData.currentNode = Number(currentNode);
    
    console.log(`Updated player ${player} state: now at node ${currentNode}`);
  }

  async function respondToPlayerChoice(player, choice, nodeIndex) {
    try {
      if (choice === 0) {
        console.log("Player chose the first option, could trigger additional logic here");
      } else if (choice === 1) {
        console.log("Player chose the second option, could trigger different logic");
      }
      
    } catch (error) {
      console.error("Error responding to player choice:", error);
    }
  }

  return {
    startListening: () => {
      const listener = (player, choice, nodeIndex) => {
        console.log(`Player ${player} made choice ${choice} at node ${nodeIndex}`);
        
        trackPlayerChoice(player, choice, nodeIndex);
        
        respondToPlayerChoice(player, choice, nodeIndex);
      };
      
      contract.on("PlayerChoice", listener);
      listeners.push({ eventName: "PlayerChoice", listener });
      
      console.log("Started listening to PlayerChoice events");
      return this;
    },

    stopListening: () => {
      for (const { eventName, listener } of listeners) {
        contract.off(eventName, listener);
      }
      listeners = [];
      console.log("Stopped listening to events");
    },

    getPlayerHistory: (playerAddress) => {
      if (players.has(playerAddress)) {
        return players.get(playerAddress).history;
      }
      return [];
    },

    getStats: () => {
      const stats = {
        totalPlayers: players.size,
        playerDetails: {}
      };
      
      for (const [address, data] of players.entries()) {
        stats.playerDetails[address] = {
          currentNode: data.currentNode,
          choicesMade: data.history.length
        };
      }
      
      return stats;
    }
  };
}

module.exports = createStoryGameAgent;
