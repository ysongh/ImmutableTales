require('dotenv').config();

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

function safeStringify(obj) {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  }, 2);
}

function createStoryGameAgent(contractAddress, providerUrl) {
  console.log(`Initializing agent with:
    - Contract Address: ${contractAddress}
    - Provider URL: ${providerUrl}`);

  function debugLog(message) {
    console.log(`[StoryGameAgent] ${message}`);
  }

  function debugError(message, error) {
    console.error(`[StoryGameAgent] ERROR: ${message}`, error);
  }

  let provider;
  let wallet;
  let contract;
  let StoryGameABI;

  try {
    if (!contractAddress) {
      throw new Error('Contract address is required');
    }
    if (!providerUrl) {
      throw new Error('Provider URL is required');
    }

    provider = new ethers.WebSocketProvider(providerUrl);
    
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    debugLog(`Agent wallet address: ${wallet.address}`);

    const artifactPath = path.resolve(__dirname, '../artifacts/contracts/StoryGameFactory.sol/StoryGameFactory.json');
    debugLog(`Looking for artifact at: ${artifactPath}`);

    if (!fs.existsSync(artifactPath)) {
      throw new Error(`Artifact file not found at ${artifactPath}`);
    }

    const StoryGameArtifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    StoryGameABI = StoryGameArtifact.abi;

    if (!StoryGameABI || StoryGameABI.length === 0) {
      throw new Error('Invalid or empty ABI');
    }

    contract = new ethers.Contract(contractAddress, StoryGameABI, wallet);

    debugLog('Contract and provider initialized successfully with transaction signing capability');
  } catch (setupError) {
    debugError('Failed to set up agent', setupError);
    throw setupError;
  }

  let listeners = [];
  const players = new Map();
  const storyGames = new Map();

  async function addStoryNode(storyGameId, content, choices) {
    debugLog(`Adding story node to game ${storyGameId} with content: ${content.substring(0, 50)}...`);
    
    try {
      const choiceIndices = choices.map(choice => Number(choice));
      
      debugLog(`Adding story node with choices: ${JSON.stringify(choiceIndices)}`);
      
      const tx = await contract.addStoryNode(storyGameId, content, choiceIndices);
      debugLog(`Transaction sent: ${tx.hash}`);
      
      const receipt = await tx.wait();
      debugLog(`Transaction confirmed in block ${receipt.blockNumber}`);
      
      return receipt;
    } catch (error) {
      debugError("Error adding story node", error);
      throw error;
    }
  }

  return {
    startListening: () => {
      try {
        const playerChoiceListener = async (player, choice, nodeIndex, storyGameId, event) => {
          try {
            debugLog(`Raw Event Received:
              - Player: ${player}
              - Choice: ${choice}
              - Node Index: ${nodeIndex}
              - Story Game ID: ${storyGameId}
              - Full Event: ${safeStringify(event)}`);

            if (!player) {
              debugError('Received event with no player address');
              return;
            }

            const currentNode = Number(await contract.getPlayerStoryState(storyGameId, player));
            
            debugLog(`Current player state:
              - Player: ${player}
              - Current Node: ${currentNode}
              - Choice: ${Number(choice)}
              - Story Game ID: ${storyGameId}
              - Node Index: ${Number(nodeIndex)}`);

            if (!players.has(player)) {
              players.set(player, {
                currentNode: null,
                history: []
              });
            }

            const playerData = players.get(player);
            playerData.history.push({
              timestamp: Date.now(),
              fromNode: Number(nodeIndex),
              choice: Number(choice),
              storyGameId: Number(storyGameId),
              toNode: currentNode
            });

            playerData.currentNode = currentNode;

          } catch (listenerError) {
            debugError('Error in player choice listener', listenerError);
            
            if (listenerError instanceof TypeError) {
              debugError('Serialization Error Details:', {
                errorName: listenerError.name,
                errorMessage: listenerError.message,
                stack: listenerError.stack
              });
            }
          }
        };

        const storyGameCreatedListener = async (owner, storyGameAddress, storyTitle, event) => {
          try {
            debugLog(`StoryGame Created:
              - Owner: ${owner}
              - Story Game Address: ${storyGameAddress}
              - Story Title: ${storyTitle}
              - Full Event: ${safeStringify(event)}`);

            const storyGameId = storyGames.size;
            storyGames.set(storyGameAddress, {
              id: storyGameId,
              owner: owner,
              title: storyTitle,
              address: storyGameAddress,
              createdAt: Date.now(),
              nodeCount: 0
            });

            debugLog(`Stored new story game with ID: ${storyGameId}`);
          } catch (listenerError) {
            debugError('Error in story game created listener', listenerError);
          }
        };

        contract.on("PlayerChoice", playerChoiceListener);
        debugLog('Registered PlayerChoice event listener');

        contract.on("StoryGameCreated", storyGameCreatedListener);
        debugLog('Registered StoryGameCreated event listener');

        provider.on('error', (error) => {
          debugError('Provider connection error', error);
        });

        debugLog('Event listening setup complete');

        return {
          stopListening: () => {
            try {
              contract.off("PlayerChoice", playerChoiceListener);
              contract.off("StoryGameCreated", storyGameCreatedListener);
              provider.removeAllListeners();
              provider.close();
              debugLog('Stopped all listeners and closed provider connection');
            } catch (stopError) {
              debugError('Error stopping listeners', stopError);
            }
          },
          getPlayerHistory: (playerAddress) => {
            if (players.has(playerAddress)) {
              return players.get(playerAddress).history;
            }
            return [];
          },
          getStoryGames: () => {
            return Array.from(storyGames.values());
          },
          getStoryGame: (storyGameAddress) => {
            return storyGames.get(storyGameAddress);
          },
          getWalletAddress: () => {
            return wallet.address;
          },
          addStoryNode: async (storyGameId, content, choices) => {
            return await addStoryNode(storyGameId, content, choices);
          }
        };

      } catch (setupListenerError) {
        debugError('Comprehensive setup of event listeners failed', setupListenerError);
        throw setupListenerError;
      }
    }
  };
}

module.exports = createStoryGameAgent;