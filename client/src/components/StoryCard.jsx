import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ETHContext } from '../ETHContext';
import { useContracts } from '../utils/useContracts';

function StoryCard({ address }) {
  const navigate = useNavigate();

  const { signer, walletAddress } = useContext(ETHContext);
  const { getStoryContentByStoryAddress } = useContracts();

  const [storyData, setStoryData] = useState(null);

  useEffect(() => {
    const fetchStoryContentByStoryAddress = async () => {
      try {
        const data = await getStoryContentByStoryAddress(signer, address);
        setStoryData(data);
      } catch (error) {
        console.error('Error Story Content:', error);
      }
    };

    if (walletAddress) fetchStoryContentByStoryAddress();
  }, [walletAddress]);

  const handleViewStory = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {storyData?.length && storyData[0]}
      </h3>
      <p className="text-blue-600 text-sm mb-4 font-medium">
        Theme: {storyData?.length && storyData[1]}
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