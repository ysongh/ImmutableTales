import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { ETHContext } from '../ETHContext';
import { formatAddress } from '../utils/format';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { walletAddress, connectWallet, disconnectWallet } = useContext(ETHContext);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsDropdownOpen(false);
    if (isMobileMenuOpen) toggleMobileMenu();
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
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `hover:text-gray-300 transition-colors duration-200 ${
                  isActive ? 'text-blue-400' : ''
                }`
              }
            >
              Profile
            </NavLink>
            {walletAddress ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors duration-200"
                >
                  {formatAddress(walletAddress)}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-10">
                    <button
                      onClick={handleDisconnect}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors duration-200"
              >
                Connect Wallet
              </button>
            )}
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
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `block py-2 px-4 hover:bg-gray-700 transition-colors duration-200 ${
                  isActive ? 'bg-gray-700 text-blue-400' : ''
                }`
              }
              onClick={toggleMobileMenu}
            >
              Profile
            </NavLink>
            {walletAddress ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="w-full text-left py-2 px-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  {formatAddress(walletAddress)}
                </button>
                {isDropdownOpen && (
                  <div className="mt-2 w-full bg-white text-gray-800 rounded-md shadow-lg">
                    <button
                      onClick={handleDisconnect}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  connectWallet();
                  toggleMobileMenu();
                }}
                className="w-full text-left py-2 px-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Connect Wallet
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;