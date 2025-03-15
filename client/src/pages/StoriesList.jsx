import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ETHContext } from '../ETHContext';
import { useContracts } from '../utils/useContracts';
import { formatAddress } from '../utils/format';

const StoriesList = () => {
  const navigate = useNavigate();
  const { connectWallet, signer, walletAddress } = useContext(ETHContext);
  const { getAllStoryGames } = useContracts();

  const [stories, setStories] = useState([]);

  useEffect(() => {
    if (signer) fetchStories();
  }, [signer])

  const fetchStories = async () => {
    const newStories = await getAllStoryGames(signer);
    setStories(newStories);
  }

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 mb-6">
            Please connect your Ethereum wallet to view and interact with stories on Immutable Tales.
          </p>
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors duration-200"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
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
                {story.title}
              </h2>
              <p className="text-blue-600 text-sm mb-4 font-medium">
                Theme: {story.theme}
              </p>
              <div className="text-sm text-gray-500">
                <p>By {formatAddress(story.owner)}</p>
                <p>Updated: 2025-03-08</p>
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
