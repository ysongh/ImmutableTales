// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './StoryGame.sol';

contract StoryGameFactory {
    StoryGame[] public deployedStoryGames;
    
    mapping(address => StoryGame[]) public authorStoryGames;
    
    event StoryGameCreated(address indexed owner, address storyGameAddress, string storyTitle);
    event PlayerChoice(address player, uint choice, uint nodeIndex, uint storyGameId);
    
    function createStoryGame(string memory _storyTitle) external returns (address) {
        StoryGame newStoryGame = new StoryGame(msg.sender, _storyTitle);
        
        deployedStoryGames.push(newStoryGame);
        authorStoryGames[msg.sender].push(newStoryGame);
        
        emit StoryGameCreated(msg.sender, address(newStoryGame), _storyTitle);
        
        return address(newStoryGame);
    }

    function makeChoice(uint id, uint choiceId) external {
        StoryGame storyGame = deployedStoryGames[id];
        uint currentNode = storyGame.makeChoice(choiceId);

        emit PlayerChoice(msg.sender, choiceId, currentNode, id);
    }

    function addStoryNode(uint id, string memory content, uint[] memory choices) external {
        StoryGame storyGame = deployedStoryGames[id];
        storyGame.addStoryNode(content, choices);
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

    function getPlayerStoryState(uint id, address player) external view returns (uint playerState) {
        StoryGame storyGame = deployedStoryGames[id];
        storyGame.playerStoryState(player);

        return playerState;
    }
}