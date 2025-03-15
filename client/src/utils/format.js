export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatStoryNode = (storyString) => {
  if (storyString.includes("Here are your choices")) {
    const [storyContent, choicesSection] = storyString.split("Here are your choices");
    const lines = choicesSection.trim().split("\n").filter(line => line.trim());
    const choices = lines.map(line => {
      const [label, ...textParts] = line.trim().split(/\)\s+/);
      return {
        label: label + ")",
        text: textParts.join(") ").trim()
      };
    });
    
    return {
      content: storyContent.trim(),
      choices: choices
    };
  } else {
    return {
      content: storyString,
      choices: []
    };
  }
};