import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, Bell, CheckCircle } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);
  
  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              className="mr-2 md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
            
            <Link to="/" className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">TaskFlow</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
              </button>
            </div>
            
            <div className="ml-4 relative">
              <button 
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.name}</span>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 fade-in">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  <button 
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                  >
                    <LogOut size={18} className="mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;