import React from 'react';
import { useNavigate } from 'react-router-dom';

const StoriesList = () => {
  const navigate = useNavigate();
  
  const stories = [
    {
      id: 1,
      title: "The Quantum Chronicles",
      description: "A mind-bending tale of parallel universes where players' choices ripple across dimensions, stored forever on the blockchain.",
      author: "CryptoBard",
      lastUpdated: "2025-03-05"
    },
    {
      id: 2,
      title: "Neon Requiem",
      description: "In a cyberpunk dystopia, rebels fight against AI overlords, with each twist etched immutably in the chain.",
      author: "ChainTeller",
      lastUpdated: "2025-03-04"
    },
    {
      id: 3,
      title: "Echoes of Atlantis",
      description: "Explorers uncover a lost civilization's secrets, their discoveries preserved as unique blockchain artifacts.",
      author: "StoryMinter",
      lastUpdated: "2025-03-06"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Explore Stories
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {story.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {story.description}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>By {story.author}</span>
                <span>Updated: {story.lastUpdated}</span>
              </div>
              <button
                onClick={() => navigate(`/story/${story.id}`)}
                className="cursor-pointer mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                View Story
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoriesList;
