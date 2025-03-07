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
  
  // Story content generation helper
  async function generateStoryContent(storyGameId, player, currentNode, previousChoice) {
    // In a real implementation, this could use AI or predefined story paths
    // For this example, we'll use a simple approach
    
    debugLog(`Generating story content for game ${storyGameId}, player ${player}, node ${currentNode}`);
    
    let content, choices;
    
    // Example story progression - in a real app, this would be more sophisticated
    if (currentNode === 0) {
      content = "You stand at the entrance of a dark forest. The path ahead splits in two directions.";
      choices = [1, 2]; // These are indices of nodes we'll create
    } else if (previousChoice === 0) { // They took the first choice last time
      content = "You follow the left path deeper into the forest. You hear strange sounds in the distance.";
      choices = [3, 4];
    } else if (previousChoice === 1) { // They took the second choice last time
      content = "The right path leads you to a small clearing with an old well in the center.";
      choices = [5, 6];
    } else {
      // Generate more varied content based on current state
      const options = [
        "You come across a small cottage with smoke rising from the chimney.",
        "A stream blocks your path. There's a fallen log that could serve as a bridge.",
        "You find an ancient stone circle covered in mysterious symbols.",
        "The forest opens up to reveal a breathtaking view of mountains in the distance."
      ];
      
      // Use a deterministic but varied selection based on node and choice
      const index = (currentNode + previousChoice) % options.length;
      content = options[index];
      
      // Generate next node indices - these would be created on demand
      const nextNodeBase = currentNode + 10; // Just a simple way to generate new indices
      choices = [nextNodeBase, nextNodeBase + 1];
    }
    
    return { content, choices };
  }

  async function addStoryNode(storyGameId, content, choices) {
    debugLog(`Adding story node to game ${storyGameId} with content: ${content.substring(0, 50)}...`);
    
    try {
      // Convert choices to array of indices
      const choiceIndices = choices.map(choice => Number(choice));
      
      debugLog(`Adding story node with choices: ${JSON.stringify(choiceIndices)}`);
      
      const tx = await contract.addStoryNode(storyGameId, content, choiceIndices);
      debugLog(`Transaction sent: ${tx.hash}`);
      
      const receipt = await tx.wait();
      debugLog(`Transaction confirmed in block ${receipt.blockNumber}`);
      
      // Update the node count for this story game if we're tracking it
      if (storyGames.has(storyGameId.toString())) {
        const game = storyGames.get(storyGameId.toString());
        game.nodeCount++;
        storyGames.set(storyGameId.toString(), game);
      }
      
      return receipt;
    } catch (error) {
      debugError("Error adding story node", error);
      throw error;
    }
  }

  return {
    startListening: () => {
      try {
        // Listen for PlayerChoice events
        const playerChoiceListener = async (player, choice, nodeIndex, storyGameId, event) => {
          try {
            debugLog(`Raw Event Received:
              - Player: ${player}
              - Choice: ${choice}
              - Node Index: ${nodeIndex}
              - Story Game ID: ${storyGameId}`);
              // - Full Event: ${safeStringify(event)}`);

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
            
            // Automatically generate and add the next story node based on the player's choice
            try {
              debugLog(`Generating next story node in response to player choice`);
              
              // Get story content based on the current state
              const { content, choices } = await generateStoryContent(
                storyGameId, 
                player, 
                currentNode, 
                Number(choice)
              );
              
              // Add the new story node to the blockchain
              debugLog(`Automatically adding new story node to game ${storyGameId}`);
              await addStoryNode(storyGameId, content, choices);
              
              debugLog(`Successfully added new story node in response to player choice`);
            } catch (nodeError) {
              debugError('Failed to add new story node in response to player choice', nodeError);
            }

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

        // Add new listener for StoryGameCreated events
        const storyGameCreatedListener = async (owner, storyGameAddress, storyTitle, event) => {
          try {
            debugLog(`StoryGame Created:
              - Owner: ${owner}
              - Story Game Address: ${storyGameAddress}
              - Story Title: ${storyTitle}`);
              // - Full Event: ${safeStringify(event)}`);

            // Store information about the newly created story game
            // For lookup purposes, use the id explicitly from event data or a derived value
            const storyGameId = event.args && event.args.storyGameId ? 
                              Number(event.args.storyGameId) : 
                              storyGames.size; // Fallback to using size as approximate ID
            
            storyGames.set(storyGameAddress, {
              id: storyGameId,
              owner: owner,
              title: storyTitle,
              address: storyGameAddress,
              createdAt: Date.now(),
              nodeCount: 0 // Start with 0 nodes
            });

            debugLog(`Stored new story game with ID: ${storyGameId}`);
            
            // Initialize the story game with a starting node
            try {
              const initialContent = `Welcome to "${storyTitle}"! Your adventure begins here.`;
              const initialChoices = [1, 2]; // Point to future nodes that will be created
              
              await addStoryNode(storyGameId, initialContent, initialChoices);
              debugLog(`Initialized story game ${storyGameId} with starting node`);
            } catch (initError) {
              debugError(`Failed to initialize story game ${storyGameId}`, initError);
            }
            
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
          },
          generateStoryContent: async (storyGameId, player, currentNode, previousChoice) => {
            return await generateStoryContent(storyGameId, player, currentNode, previousChoice);
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