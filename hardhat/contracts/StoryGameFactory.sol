// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './StoryGame.sol';

contract StoryGameFactory {
    StoryGame[] public deployedStoryGames;
    Story[] public stories;

    struct Story{
        address contractAddress;
        string title;
        string theme;
        address owner;
    }
    
    mapping(address => StoryGame[]) public authorStoryGames;
    
    event StoryGameCreated(address indexed owner, address storyGameAddress, string storyTitle, string theme, uint storyGameId);
    event PlayerChoice(address player, string choice, uint storyGameId);
    
    function createStoryGame(string memory _storyTitle, string memory _theme) external returns (address) {
        uint storyGameId = deployedStoryGames.length;
        StoryGame newStoryGame = new StoryGame(msg.sender, _storyTitle, _theme);
        
        deployedStoryGames.push(newStoryGame);
        authorStoryGames[msg.sender].push(newStoryGame);

        Story memory newStory = Story({
            contractAddress: address(newStoryGame),
            title: _storyTitle,
            theme: _theme,
            owner: msg.sender
        });

        stories.push(newStory);
        
        emit StoryGameCreated(msg.sender, address(newStoryGame), _storyTitle, _theme, storyGameId);
        
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

    function getAllContentByStoryId(uint id) external view returns (string[] memory) {
        StoryGame storyGame = deployedStoryGames[id];
        return storyGame.getAllContent();
    }

    function getStoryContentByStoryAddress(address storyAddress) external view returns (string memory _storyTitle, string memory _theme) {
        StoryGame storyGame = StoryGame(storyAddress);
        return (
            storyGame.storyTitle(),
            storyGame.theme()
        );
    }

    function getAllStories() external view returns (Story[] memory) {
        return stories;
    }
}