import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ETHContext } from '../ETHContext';
import { useContracts } from '../utils/useContracts';
import { formatAddress } from '../utils/format';

const StoriesList = () => {
  const navigate = useNavigate();
  const { signer } = useContext(ETHContext);
  const { getAllStoryGames } = useContracts();

  const [stories, setStories] = useState([]);

  useEffect(() => {
    if (signer) fetchStories();
  }, [signer])

  const fetchStories = async () => {
    const newStories = await getAllStoryGames(signer);
    setStories(newStories);
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Explore Stories
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {formatAddress(story)}
              </h2>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Updated: 2025-03-08</span>
              </div>
              <button
                onClick={() => navigate(`/story/${index}`)}
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
