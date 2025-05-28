import React from "react";
import { Menu, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import NotificationBell from "../NotificationBell";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-10 py-4 bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
              title="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationBell />
            <div className="relative">
              <button
                onClick={signOut}
                className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 focus:outline-none"
                title="Sign out"
              >
                <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <span className="hidden md:inline-block font-medium">
                  {user?.email}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
