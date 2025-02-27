const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StoryGameModule", (m) => {
  const storyGame = m.contract("StoryGame", []);

  return { storyGame };
});