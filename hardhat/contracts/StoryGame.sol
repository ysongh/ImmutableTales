// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StoryGame {
    address public owner;
    string public storyTitle;
    string public theme;

    struct StoryNode {
        string content;
        string choice;
    }

    StoryNode[] public storyNodes;
    uint256 public currentStoryNum;

    constructor(address _owner, string memory _storyTitle, string memory _theme ) {
        owner = _owner;
        storyTitle = _storyTitle;
        theme = _theme;
    }

    function addStoryNode(string memory content) external {
        StoryNode memory newNode = StoryNode({
            content: content,
            choice: ""
        });

        storyNodes.push(newNode);
    }

    function makeChoice(string memory choice) external {
        StoryNode storage currentNode = storyNodes[currentStoryNum];
        currentNode.choice = choice;
        currentStoryNum++;
    }

    function getCurrentStory() external view returns (string memory) {
        return storyNodes[currentStoryNum].content;
    }

    function getAllContent() external view returns (string[] memory) {
        string[] memory contents = new string[](storyNodes.length);
        
        for (uint i = 0; i < storyNodes.length; i++) {
            contents[i] = storyNodes[i].content;
        }
        
        return contents;
    }
}
