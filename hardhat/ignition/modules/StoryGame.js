const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StoryGameModule", (m) => {
  const storyGameFactory = m.contract("StoryGameFactory", []);

  return { storyGameFactory };
});