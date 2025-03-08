import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { ETHContext } from '../ETHContext';
import { formatAddress } from '../utils/format';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { walletAddress, connectWallet } = useContext(ETHContext);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <NavLink to="/" className="text-xl font-bold">
            Immutable Tales
          </NavLink>

          <div className="hidden md:flex space-x-6 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-gray-300 transition-colors duration-200 ${
                  isActive ? 'text-blue-400' : ''
                }`
              }
            >
              Stories
            </NavLink>
            <NavLink
              to="/create-story"
              className={({ isActive }) =>
                `hover:text-gray-300 transition-colors duration-200 ${
                  isActive ? 'text-blue-400' : ''
                }`
              }
            >
              Create Story
            </NavLink>
            <button
              onClick={connectWallet}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors duration-200"
            >
              {walletAddress ? formatAddress(walletAddress) : 'Connect Wallet'}
            </button>
          </div>

          <button
            className="md:hidden focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 px-4 hover:bg-gray-700 transition-colors duration-200 ${
                  isActive ? 'bg-gray-700 text-blue-400' : ''
                }`
              }
              onClick={toggleMobileMenu}
            >
              Stories
            </NavLink>
            <NavLink
              to="/create-story"
              className={({ isActive }) =>
                `block py-2 px-4 hover:bg-gray-700 transition-colors duration-200 ${
                  isActive ? 'bg-gray-700 text-blue-400' : ''
                }`
              }
              onClick={toggleMobileMenu}
            >
              Create Story
            </NavLink>
            <button
              onClick={() => {
                connectWallet();
                toggleMobileMenu();
              }}
              className="w-full text-left py-2 px-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              {walletAddress ? formatAddress(walletAddress) : 'Connect Wallet'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;