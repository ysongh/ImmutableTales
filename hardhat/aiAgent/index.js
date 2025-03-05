const createStoryGameAgent = require('./storyGameAgent');

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const providerUrl = "http://127.0.0.1:8545/";

const agent = createStoryGameAgent(contractAddress, providerUrl);

agent.startListening();

console.log("Agent is running and listening for events...");

process.on('SIGINT', () => {
  console.log('Stopping agent...');
  agent.stopListening();
  process.exit();
});