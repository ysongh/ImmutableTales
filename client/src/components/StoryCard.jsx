import React from 'react';
import { useNavigate } from 'react-router-dom';

function StoryCard({ address }) {
  const navigate = useNavigate();

  const handleViewStory = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {address}
      </h3>
      <p className="text-blue-600 text-sm mb-4 font-medium">
        Theme:
      </p>
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span>Updated: </span>
      </div>
      <button
        onClick={() => handleViewStory(address)}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        View Story
      </button>
    </div>
  )
}

export default StoryCard;