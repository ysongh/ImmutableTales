import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ETHContext } from '../ETHContext';
import { useContracts } from '../utils/useContracts';
import { formatAddress, formatStoryNode } from '../utils/format';

const StoryDetail = () => {
  const { storyId } = useParams();

  const { signer } = useContext(ETHContext);
  const { getAllContentByStoryId, getStoryDataByStoryId,  makeChoice } = useContracts();

  const [story, setStory] = useState([]);
  const [listOfContent, setListOfContent] = useState([]);
  const [contentInput, setContentInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setIsLoading(true);
        const newContent = await getAllContentByStoryId(signer, storyId);
        setListOfContent(newContent);
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [signer]);

  useEffect(() => {
    const fetchStoryData = async () => {
      const newStoryData = await getStoryDataByStoryId(signer, storyId);
      setStory(newStoryData);
    }
    fetchStoryData()
  }, [signer])
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contentInput.trim()) return;

    await makeChoice(signer, storyId, contentInput);

    setIsSubmitting(true);
    try {
      const newContent = {
        id: story.content.length + 1,
        text: contentInput,
        author: "CurrentUser",
        timestamp: new Date().toISOString()
      };
      
      setStory((prev) => ({
        ...prev,
        content: [...prev.content, newContent]
      }));
      setContentInput('');
      alert('Content added successfully!'); // Replace with your success handling
    } catch (error) {
      console.error('Error adding content:', error);
      alert('Failed to add content. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading story...</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Story not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{story[1]}</h1>
          <p className="text-gray-600">Theme: {story[1]}</p>
        </div>

        <div className="space-y-6 mb-6">
          {listOfContent.map((entry, index) => {
            const { content, choices} = formatStoryNode(entry)
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <p className="text-gray-800 mb-2">{content}</p>
                <h3>Your Choices:</h3>
                {choices.map((choice, index) => (
                  <p key={index}>{choice.label}{choice.text}</p>
                ))}
                <div className="flex justify-between text-sm text-gray-500">
                  <span>By Author</span>
                  <span>3/31/2025</span>
                </div>
              </div>
            )})}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add to the Story
          </h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              rows="4"
              placeholder="Continue the story..."
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !contentInput.trim()}
              className={`cursor-pointer mt-4 w-full py-2 px-4 rounded-md text-white font-medium ${
                isSubmitting || !contentInput.trim()
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors duration-200`}
            >
              {isSubmitting ? 'Submitting...' : 'Add Content'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
