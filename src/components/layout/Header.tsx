import React from 'react';
import { Bell, Menu, User } from 'lucide-react';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-10 py-4 bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <Bell size={20} />
            </button>
            <div className="relative">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <span className="hidden md:inline-block font-medium">John Doe</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;