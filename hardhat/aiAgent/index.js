const { ethers } = require('ethers');

function createStoryGameAgent(contractAddress, providerUrl) {
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  
  const abi = [
    "event PlayerChoice(address player, uint choice, uint nodeIndex)",
    "function getCurrentNode() external view returns (string memory)",
    "function playerStoryState(address) external view returns (uint)"
  ];
  
  const contract = new ethers.Contract(contractAddress, abi, provider);
  
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
      toNode: currentNode.toNumber()
    });
    
    playerData.currentNode = currentNode.toNumber();
    
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
      const playerChoiceFilter = contract.filters.PlayerChoice();
      
      const listener = (player, choice, nodeIndex) => {
        console.log(`Player ${player} made choice ${choice} at node ${nodeIndex}`);
        
        trackPlayerChoice(player, choice, nodeIndex);
        
        respondToPlayerChoice(player, choice, nodeIndex);
      };
      
      contract.on(playerChoiceFilter, listener);
      listeners.push({ filter: playerChoiceFilter, listener });
      
      console.log("Started listening to PlayerChoice events");
      return this;
    },

    stopListening: () => {
      for (const { filter, listener } of listeners) {
        contract.off(filter, listener);
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

async function main() {
  const contractAddress = "0x123...";
  const providerUrl = "https://eth-mainnet.alchemyapi.io/v2/your-api-key";
  
  const agent = createStoryGameAgent(contractAddress, providerUrl);
  
  agent.startListening();

  setTimeout(() => {
    console.log("Player stats:", agent.getStats());
  }, 60000); // Check after 1 minute
}

module.exports = createStoryGameAgent;
