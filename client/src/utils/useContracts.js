import { ethers } from 'ethers';
import StoryGameManager from "../artifacts/contracts/StoryGameFactory.sol/StoryGameFactory.json";

const STORYGAMEFACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const useContracts = () => {
  const getStoryGameContract = async (signer) => {
    return new ethers.Contract(STORYGAMEFACTORY_ADDRESS, StoryGameManager.abi, signer);
  };

  const getAllStoryGames = async (signer) => {
    const contract = await getStoryGameContract(signer);
    let stories = await contract.getAllStoryGames();
    stories = Array.from(stories);
    console.log(stories);
    return stories;
  }

  const getAllContentByStoryId = async (signer, id) => {
    const contract = await getStoryGameContract(signer);
    let stories = await contract.getAllContentByStoryId(id);
    stories = Array.from(stories);
    console.log(stories);
    return stories;
  }

  const createStoryGame = async (signer, title) => {
    const contract = await getStoryGameContract(signer);
    const createTX = await contract.createStoryGame(title);
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
    createStoryGame,
    makeChoice
  };
}