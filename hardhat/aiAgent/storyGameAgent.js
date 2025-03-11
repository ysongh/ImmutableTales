require('dotenv').config();

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const client = new OpenAI({
  baseURL: 'https://nilai-a779.nillion.network/v1',
  apiKey: process.env.NILAI_API_KEY || 'YOUR_API_KEY_HERE'
});

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
  
  async function generateStoryContent(storyGameId, player, currentNode, choice, arrayOfContents) {    
    debugLog(`Generating story content for game ${storyGameId}, player ${player}, node ${currentNode}`);
    
    let content;
    const formattedData = JSON.stringify(arrayOfContents, null, 2);
    
    const response = await client.chat.completions.create({
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      messages: [
        {
          role: 'system',
          content: 'You are a story teller and writer.'
        },
        {
          role: 'user',
          content: `Write a short story based on this ${choice}, no more than 100 words. Give 4 choices that the user can choose to determine the next part. There the previous data. ${formattedData}`
        }
      ],
      stream: false
    });

    // Every SecretLLM response includes a cryptographic signature for verification
    console.log(`Signature: ${response.signature}`);
    console.log(`Response: ${response.choices[0].message.content}`);
    content = response.choices[0].message.content;

    return { content };
  }

  async function addStoryNode(storyGameId, content) {
    debugLog(`Adding story node to game ${storyGameId} with content: ${content.substring(0, 50)}...`);
    
    try {
      const tx = await contract.addStoryNode(storyGameId, content);
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
        const playerChoiceListener = async (player, choice, storyGameId, event) => {
          try {
            debugLog(`Raw Event Received:
              - Player: ${player}
              - Choice: ${choice}
              - Story Game ID: ${storyGameId}`);
              // - Full Event: ${safeStringify(event)}`);

            if (!player) {
              debugError('Received event with no player address');
              return;
            }

            const arrayOfContents = await contract.getAllContentByStoryId(storyGameId);
            
            // Automatically generate and add the next story node based on the player's choice
            try {
              debugLog(`Generating next story node in response to player choice`);
              
              // Get story content based on the current state
              const { content } = await generateStoryContent(
                storyGameId, 
                player,
                choice,
                arrayOfContents
              );
              
              // Add the new story node to the blockchain
              debugLog(`Automatically adding new story node to game ${storyGameId}`);
              await addStoryNode(storyGameId, content);
              
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
        const storyGameCreatedListener = async (owner, storyGameAddress, storyTitle, storyGameId, event) => {
          try {
            debugLog(`StoryGame Created:
              - Owner: ${owner}
              - Story Game Address: ${storyGameAddress}
              - Story Title: ${storyTitle}
              - Story ID: ${storyGameId}`);
              // - Full Event: ${safeStringify(event)}`);

            debugLog(`Stored new story game with ID: ${storyGameId}`);
            
            try {
              const response = await client.chat.completions.create({
                model: 'meta-llama/Llama-3.1-8B-Instruct',
                messages: [
                  {
                    role: 'system',
                    content: 'You are a story teller and writer.'
                  },
                  {
                    role: 'user',
                    content: `Write a short story about ${storyTitle} no more than 100 words. Give 4 choices that the user can choose to determine the next part.`
                  }
                ],
                stream: false
              });
          
              console.log(`Signature: ${response.signature}`);
              console.log(`Response: ${response.choices[0].message.content}`);
              const initialContent = response.choices[0].message.content;
              
              await addStoryNode(storyGameId, initialContent);
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
          getWalletAddress: () => {
            return wallet.address;
          },
          addStoryNode: async (storyGameId, content) => {
            return await addStoryNode(storyGameId, content);
          },
          generateStoryContent: async (storyGameId, player, previousChoice, arrayOfContents) => {
            return await generateStoryContent(storyGameId, player, previousChoice, arrayOfContents);
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