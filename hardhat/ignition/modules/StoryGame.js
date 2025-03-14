const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StoryGameModule", (m) => {
  const storyGameFactory = m.contract("StoryGameFactory", []);

  const createStoryGameCall = m.call(
    storyGameFactory,
    "createStoryGame",
    ["The Adventure Begins", "Action"]
  );

  return { storyGameFactory, createStoryGameCall };
  // return { storyGameFactory };
});