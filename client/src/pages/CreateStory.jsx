import React, { useState, useContext } from 'react';

import { ETHContext } from '../ETHContext';
import { useContracts } from '../utils/useContracts';

const CreateStory = () => {
   const { signer } = useContext(ETHContext);
   const { createStoryGame } = useContracts();

  const [formData, setFormData] = useState({
    title: '',
    theme: '',
    initialPrompt: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Story data to submit:', formData);

      await createStoryGame(signer, formData.title, formData.theme);
      
      setFormData({
        title: '',
        theme: '',
        initialPrompt: ''
      });
      alert('Story created successfully!');
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create a New Story
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Story Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your story title"
            />
          </div>

          <div>
            <label
              htmlFor="theme"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Theme
            </label>
            <input
              type="text"
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Cyberpunk, Fantasy, Mystery"
            />
          </div>

          <div>
            <label
              htmlFor="initialPrompt"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Initial Prompt (Optional)
            </label>
            <textarea
              id="initialPrompt"
              name="initialPrompt"
              value={formData.initialPrompt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              rows="4"
              placeholder="Start your story here..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`cursor-pointer w-full py-2 px-4 rounded-md text-white font-medium ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors duration-200`}
          >
            {isSubmitting ? 'Creating...' : 'Create Story'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStory;