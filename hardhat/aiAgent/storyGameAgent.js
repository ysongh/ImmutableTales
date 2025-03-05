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

    const artifactPath = path.resolve(__dirname, '../artifacts/contracts/StoryGame.sol/StoryGame.json');
    debugLog(`Looking for artifact at: ${artifactPath}`);

    if (!fs.existsSync(artifactPath)) {
      throw new Error(`Artifact file not found at ${artifactPath}`);
    }

    const StoryGameArtifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    StoryGameABI = StoryGameArtifact.abi;

    if (!StoryGameABI || StoryGameABI.length === 0) {
      throw new Error('Invalid or empty ABI');
    }

    contract = new ethers.Contract(contractAddress, StoryGameABI, provider);

    debugLog('Contract and provider initialized successfully');
  } catch (setupError) {
    debugError('Failed to set up agent', setupError);
    throw setupError;
  }

  let listeners = [];
  const players = new Map();

  return {
    startListening: () => {
      try {
        const playerChoiceListener = async (player, choice, nodeIndex, event) => {
          try {
            debugLog(`Raw Event Received:
              - Player: ${player}
              - Choice: ${choice}
              - Node Index: ${nodeIndex}
              - Full Event: ${safeStringify(event)}`);

            if (!player) {
              debugError('Received event with no player address');
              return;
            }

            const currentNode = Number(await contract.playerStoryState(player));
            
            debugLog(`Current player state:
              - Player: ${player}
              - Current Node: ${currentNode}
              - Choice: ${Number(choice)}
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

        contract.on("PlayerChoice", playerChoiceListener);
        debugLog('Registered PlayerChoice event listener');

        provider.on('error', (error) => {
          debugError('Provider connection error', error);
        });

        debugLog('Event listening setup complete');

        return {
          stopListening: () => {
            try {
              contract.off("PlayerChoice", playerChoiceListener);
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