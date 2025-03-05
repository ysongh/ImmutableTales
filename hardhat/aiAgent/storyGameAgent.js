require('dotenv').config();

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

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

    try {
      provider = new ethers.WebSocketProvider(providerUrl);
    } catch (wsError) {
      debugError('WebSocket provider failed, falling back to JsonRpcProvider', wsError);
      provider = new ethers.JsonRpcProvider(providerUrl);
    }

    const artifactPath = path.resolve(__dirname, '../artifacts/contracts/StoryGame.sol/StoryGame.json');
    debugLog(`Looking for artifact at: ${artifactPath}`);

    if (!fs.existsSync(artifactPath)) {
      throw new Error(`Artifact file not found at ${artifactPath}`);
    }

    try {
      const StoryGameArtifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
      StoryGameABI = StoryGameArtifact.abi;

      if (!StoryGameABI || StoryGameABI.length === 0) {
        throw new Error('Invalid or empty ABI');
      }
    } catch (parseError) {
      debugError('Failed to parse ABI file', parseError);
      throw parseError;
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
              - Full Event: ${JSON.stringify(event)}`);

            if (!player) {
              debugError('Received event with no player address');
              return;
            }

            const currentNode = await contract.playerStoryState(player);
            debugLog(`Current player state:
              - Player: ${player}
              - Current Node: ${currentNode}`);

          } catch (listenerError) {
            debugError('Error in player choice listener', listenerError);
          }
        };

        try {
          contract.on("PlayerChoice", playerChoiceListener);
          debugLog('Registered PlayerChoice event listener via contract.on()');
        } catch (onError) {
          debugError('Failed to use contract.on()', onError);
          
          try {
            contract.addListener("PlayerChoice", playerChoiceListener);
            debugLog('Registered PlayerChoice event listener via contract.addListener()');
          } catch (addListenerError) {
            debugError('Failed to use contract.addListener()', addListenerError);
          }
        }

        provider.on('error', (error) => {
          debugError('Provider connection error', error);
        });

        const connectionCheckInterval = setInterval(() => {
          try {
            provider.getNetwork().then(network => {
              debugLog(`Connection health check - Connected to network: ${network.name}`);
            }).catch(networkError => {
              debugError('Network connectivity check failed', networkError);
            });
          } catch (intervalError) {
            debugError('Error in connection health check', intervalError);
            clearInterval(connectionCheckInterval);
          }
        }, 60000);

        debugLog('Event listening setup complete');

        return {
          stopListening: () => {
            try {
              contract.off("PlayerChoice", playerChoiceListener);
              provider.removeAllListeners();
              clearInterval(connectionCheckInterval);
              provider.close();
              debugLog('Stopped all listeners and closed provider connection');
            } catch (stopError) {
              debugError('Error stopping listeners', stopError);
            }
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