import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building, History, CreditCard, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Building className="h-8 w-8 text-teal-600 group-hover:text-teal-700 transition-colors duration-200" />
            <h1 className="text-2xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors duration-200">
              Planix
            </h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'text-teal-600 bg-teal-50' 
                  : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              <Building className="h-4 w-4" />
              <span>Generate</span>
            </Link>
            
            <Link 
              to="/history" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/history') 
                  ? 'text-teal-600 bg-teal-50' 
                  : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </Link>
            
            <Link 
              to="/subscription" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/subscription') 
                  ? 'text-teal-600 bg-teal-50' 
                  : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              <span>Subscription</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-teal-600 transition-colors duration-200">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;