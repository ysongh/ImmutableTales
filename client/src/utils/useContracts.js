import { ethers } from 'ethers';
import StoryGameManager from "../artifacts/contracts/StoryGameFactory.sol/StoryGameFactory.json";

const STORYGAMEFACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const STORYGAMEFACTORY_ADDRESS = "0xBdf3a2c90cEAB5A307e78956Bc1BeF33c19C1F78";

export const useContracts = () => {
  const getStoryGameContract = async (signer) => {
    return new ethers.Contract(STORYGAMEFACTORY_ADDRESS, StoryGameManager.abi, signer);
  };

  const getAllStoryGames = async (signer) => {
    const contract = await getStoryGameContract(signer);
    let stories = await contract.getAllStories();
    const formatStories = stories.map(item => ({
      address: item[0],
      title: item[1],
      owner: item[2]
    }));

    console.log(formatStories);
    
    return formatStories;
  }

  const getAllContentByStoryId = async (signer, id) => {
    const contract = await getStoryGameContract(signer);
    let stories = await contract.getAllContentByStoryId(id);
    stories = Array.from(stories);
    console.log(stories);
    return stories;
  }

  const getStoryDataByStoryId = async (signer, id) => {
    const contract = await getStoryGameContract(signer);
    let storyData = await contract.stories(id);
    storyData = Array.from(storyData);
    console.log(storyData);
    return storyData;
  }

  const createStoryGame = async (signer, title, theme) => {
    const contract = await getStoryGameContract(signer);
    const createTX = await contract.createStoryGame(title, theme);
    await createTX.wait();
    return createTX;
  }

  const makeChoice = async (signer, id, choice) => {
    const contract = await getStoryGameContract(signer);
    const createTX = await contract.makeChoice(id, choice);
    await createTX.wait();
    return createTX;
  }

  return {
    getAllStoryGames,
    getAllContentByStoryId,
    getStoryDataByStoryId,
    createStoryGame,
    makeChoice
  };
}