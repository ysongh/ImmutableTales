// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './StoryGame.sol';

contract StoryGameFactory {
    StoryGame[] public deployedStoryGames;
    
    mapping(address => StoryGame[]) public authorStoryGames;
    
    event StoryGameCreated(address indexed owner, address storyGameAddress, string storyTitle);
    event PlayerChoice(address player, string choice, uint storyGameId);
    
    function createStoryGame(string memory _storyTitle) external returns (address) {
        StoryGame newStoryGame = new StoryGame(msg.sender, _storyTitle);
        
        deployedStoryGames.push(newStoryGame);
        authorStoryGames[msg.sender].push(newStoryGame);
        
        emit StoryGameCreated(msg.sender, address(newStoryGame), _storyTitle);
        
        return address(newStoryGame);
    }

    function makeChoice(uint id, string memory choice) external {
        StoryGame storyGame = deployedStoryGames[id];
        storyGame.makeChoice(choice);

        emit PlayerChoice(msg.sender, choice, id);
    }

    function addStoryNode(uint id, string memory content) external {
        StoryGame storyGame = deployedStoryGames[id];
        storyGame.addStoryNode(content);
    }

    function getAllStoryGames() external view returns (StoryGame[] memory) {
        return deployedStoryGames;
    }
    
    function getAuthorStoryGames(address author) external view returns (StoryGame[] memory) {
        return authorStoryGames[author];
    }

    function getStoryGameCount() external view returns (uint) {
        return deployedStoryGames.length;
    }

    function getAuthorStoryGameCount(address author) external view returns (uint) {
        return authorStoryGames[author].length;
    }

    function getPlayerStoryState(uint id) external view returns (uint currentStoryNum) {
        StoryGame storyGame = deployedStoryGames[id];
        storyGame.currentStoryNum();

        return currentStoryNum;
    }
}