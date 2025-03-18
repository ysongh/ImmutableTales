// src/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const mockData = {
        username: 'CryptoBard',
        bio: 'A wandering storyteller weaving tales across the blockchain.',
        joined: '2025-01-15',
        stories: [
          {
            id: 1,
            title: 'The Quantum Chronicles',
            theme: 'Science Fiction / Quantum Reality',
            lastUpdated: '2025-03-05',
          },
          {
            id: 2,
            title: 'Echoes of the Void',
            theme: 'Mystery / Cosmic Horror',
            lastUpdated: '2025-03-10',
          },
        ],
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

  const handleViewStory = (storyId) => {
    navigate(`/story/${storyId}`);
  };

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
              Stories: <span className="font-semibold">{userData.stories.length}</span>
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
            {userData.stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {story.title}
                </h3>
                <p className="text-blue-600 text-sm mb-4 font-medium">
                  Theme: {story.theme}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Updated: {story.lastUpdated}</span>
                </div>
                <button
                  onClick={() => handleViewStory(story.id)}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  View Story
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;