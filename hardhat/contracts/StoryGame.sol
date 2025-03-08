// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StoryGame {
    address public owner;
    string public storyTitle;

    struct StoryNode {
        string content;
        string choice;
    }

    StoryNode[] public storyNodes;
    uint256 public currentStoryNum;

    constructor(address _owner, string memory _storyTitle) {
        owner = _owner;
        storyTitle = _storyTitle;
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
}
