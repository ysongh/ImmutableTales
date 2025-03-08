export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatStoryNode = (storyString) => {
  // Check if the text contains choices
  if (storyString.includes("Here are your choices")) {
    // Split the content and choices
    const [storyContent, choicesSection] = storyString.split("Here are your choices");
    
    // Parse the choices
    const choiceRegex = /([A-Z]\))\s(.*?)(?=\s[A-Z]\)|\s*$)/g;
    const choices = [];
    let match;
    
    while ((match = choiceRegex.exec(choicesSection + " "))) {
      choices.push({
        label: match[1],
        text: match[2].trim()
      });
    }
    
    return {
      content: storyContent.trim(),
      choices: choices
    };
  } else {
    // If there are no choices, return just the content
    return {
      content: storyString,
      choices: []
    };
  }
}