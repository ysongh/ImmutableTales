// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StoryGame {
    address public owner;
    string public storyTitle;

    mapping(address => uint) public playerStoryState;
    
    struct StoryNode {
        string content;
        uint[] choices;
    }

    StoryNode[] public storyNodes;

    constructor(address _owner, string memory _storyTitle) {
        owner = _owner;
        storyTitle = _storyTitle;

        uint initialNode = 0;
        playerStoryState[_owner] = initialNode;
    }

    function makeChoice(uint choiceId) external returns(uint) {
        uint currentNode = playerStoryState[msg.sender];
        StoryNode storage node = storyNodes[currentNode];
        require(choiceId < node.choices.length, "Invalid choice");

        playerStoryState[msg.sender] = node.choices[choiceId];

        return currentNode;
    }

    function getCurrentNode() external view returns (string memory) {
        uint currentNode = playerStoryState[msg.sender];
        return storyNodes[currentNode].content;
    }

    function addStoryNode(string memory content, uint[] memory choices) external {
        StoryNode memory newNode = StoryNode({
            content: content,
            choices: choices
        });

        storyNodes.push(newNode);
    }
}
