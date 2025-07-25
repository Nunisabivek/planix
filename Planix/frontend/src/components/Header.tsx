import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center">
              <div className="bg-indigo-600 rounded-lg p-2">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Planix</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/generate" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  Generate Plan
                </Link>
                <Link to="/history" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  My Plans
                </Link>
                <Link to="/subscription" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  Subscription
                </Link>
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm mr-2">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {user.name}
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/subscription" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Subscription
                    </Link>
                    <Link to="/referrals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Referrals
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  Sign In
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 text-sm font-medium rounded-md">
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 p-2"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-900">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {user.name}
                  </div>
                  <Link to="/dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600">
                    Dashboard
                  </Link>
                  <Link to="/generate" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600">
                    Generate Plan
                  </Link>
                  <Link to="/history" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600">
                    My Plans
                  </Link>
                  <Link to="/subscription" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600">
                    Subscription
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-indigo-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600">
                    Sign In
                  </Link>
                  <Link to="/register" className="block px-3 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md mx-3">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;