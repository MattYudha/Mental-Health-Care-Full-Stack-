import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, 
  BarChart3, 
  HeartPulse, 
  MessageSquareText, 
  User, 
  X, 
  BookOpen,
  Brain
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-20 bg-gray-900/50 transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto md:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-teal-600" />
            <span className="text-xl font-bold text-gray-800">MindGuard</span>
          </div>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Activity className="mr-3 h-5 w-5" />
            Dashboard
          </NavLink>

          <NavLink
            to="/sentiment"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <BarChart3 className="mr-3 h-5 w-5" />
            Sentiment Analysis
          </NavLink>

          <NavLink
            to="/wellness"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <HeartPulse className="mr-3 h-5 w-5" />
            Wellness Tracker
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <MessageSquareText className="mr-3 h-5 w-5" />
            Chat Support
          </NavLink>

          <NavLink
            to="/resources"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <BookOpen className="mr-3 h-5 w-5" />
            Resources
          </NavLink>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <User className="mr-3 h-5 w-5" />
              Profile
            </NavLink>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;