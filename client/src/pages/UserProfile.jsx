import React, { useState, useEffect, useContext } from 'react';

import { ETHContext } from '../ETHContext';
import { useContracts } from '../utils/useContracts';
import StoryCard from '../components/StoryCard';

const UserProfile = () => {
  const { signer, walletAddress } = useContext(ETHContext);
  const { getAuthorStoryGameCount, getAuthorStoryGames } = useContracts();

  const [userData, setUserData] = useState(null);
  const [storyCount, setStoryCount] = useState(0);
  const [storyAddresses, setStoryAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStoryCount = async () => {
      try {
        const newCount = await getAuthorStoryGameCount(signer, walletAddress);
        setStoryCount(newCount);
      } catch (error) {
        console.error('Error Author Story Game Count:', error);
      }
    };

    if (walletAddress) fetchStoryCount();
  }, [walletAddress]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const newAddresses = await getAuthorStoryGames(signer, walletAddress);
        setStoryAddresses(newAddresses);
      } catch (error) {
        console.error('Error Author Story Games:', error);
      }
    };

    if (walletAddress) fetchAddresses();
  }, [walletAddress]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const mockData = {
        username: 'CryptoBard',
        bio: 'A wandering storyteller weaving tales across the blockchain.',
        joined: '2025-01-15',
        ownedNFTs: 3, // Could represent minted story NFTs
      };
      setUserData(mockData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {userData.username[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {userData.username}
              </h1>
              <p className="text-gray-600">{userData.bio}</p>
              <p className="text-sm text-gray-500">
                Joined: {new Date(userData.joined).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="mt-4 flex space-x-4">
            <span className="text-gray-700">
              Stories: <span className="font-semibold">{storyCount}</span>
            </span>
            <span className="text-gray-700">
              Owned NFTs: <span className="font-semibold">{userData.ownedNFTs}</span>
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {userData.username}'s Stories
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {storyAddresses.map((address, index) => (
             <StoryCard key={index} address={address} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;