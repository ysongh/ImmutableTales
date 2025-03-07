import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;