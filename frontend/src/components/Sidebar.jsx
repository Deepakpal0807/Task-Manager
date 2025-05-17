import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, X, Settings, HelpCircle } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  // Define navigation items
  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    // { to: '/completed', icon: <CheckSquare size={20} />, label: 'Completed Tasks' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    { to: '/help', icon: <HelpCircle size={20} />, label: 'Help & Support' },
  ];
  
  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-16 bottom-0 w-64 bg-white shadow-md z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Close Button */}
          <div className="md:hidden p-4 flex justify-end">
            <button 
              className="p-1 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              onClick={toggleSidebar}
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  flex items-center px-4 py-3 rounded-md transition-colors
                  ${isActive(item.to) 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t">
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700 font-medium">Need help?</p>
              <p className="text-xs text-blue-600 mt-1">Check our documentation or contact support</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;