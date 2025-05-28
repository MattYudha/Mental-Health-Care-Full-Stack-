import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Lock, 
  ChevronRight, 
  LogOut, 
  Calendar,
  BarChart4,
  MessageSquare
} from 'lucide-react';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Sample user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 15, 2023',
    streak: 27,
    completedActivities: 42,
    riskScore: {
      current: 32,
      previous: 58,
      change: -26
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={userData.name}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={userData.email}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="Add a phone number"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button className="mt-6 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors">
                Save Changes
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Progress Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Current Streak</p>
                      <p className="text-2xl font-bold text-teal-700">{userData.streak} days</p>
                    </div>
                    <div className="p-2 bg-teal-100 rounded-full text-teal-600">
                      <Calendar size={18} />
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Activities Completed</p>
                      <p className="text-2xl font-bold text-purple-700">{userData.completedActivities}</p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                      <BarChart4 size={18} />
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Support Sessions</p>
                      <p className="text-2xl font-bold text-blue-700">12</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                      <MessageSquare size={18} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-base font-medium text-gray-800 mb-3">Risk Score Progress</h3>
                <div className="flex items-center mb-3">
                  <div className="w-full mr-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Previous: {userData.riskScore.previous}</span>
                      <span className="text-sm text-gray-600">Current: {userData.riskScore.current}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${userData.riskScore.current}%` }}></div>
                    </div>
                  </div>
                  <div className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {userData.riskScore.change}%
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Your risk score has improved by {Math.abs(userData.riskScore.change)}% since your last assessment.
                  Keep up the good work with your wellness activities!
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">Account Settings</h2>
              </div>
              
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-full text-gray-600 mr-3">
                    <Bell size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Notifications</p>
                    <p className="text-xs text-gray-500">Manage how and when you receive alerts</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-full text-gray-600 mr-3">
                    <Lock size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Privacy & Security</p>
                    <p className="text-xs text-gray-500">Update password and security settings</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-full text-gray-600 mr-3">
                    <Settings size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Preferences</p>
                    <p className="text-xs text-gray-500">Customize your experience</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
              
              <button className="w-full flex items-center p-4 hover:bg-gray-50 text-left text-red-500">
                <div className="p-2 bg-red-100 rounded-full text-red-500 mr-3">
                  <LogOut size={18} />
                </div>
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Settings</h2>
            <p className="text-gray-600">Settings content will be displayed here.</p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
        <p className="text-gray-600">Manage your account and review your progress</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col items-center pb-4 border-b border-gray-200">
              <div className="h-20 w-20 rounded-full bg-teal-500 flex items-center justify-center text-white mb-3">
                <User size={40} />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{userData.name}</h2>
              <p className="text-sm text-gray-500">{userData.email}</p>
              <p className="mt-1 text-xs text-gray-400">Member since {userData.joinDate}</p>
            </div>
            
            <div className="pt-4 space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center p-2 rounded-md text-sm ${
                  activeTab === 'profile'
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User size={16} className="mr-3" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center p-2 rounded-md text-sm ${
                  activeTab === 'settings'
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings size={16} className="mr-3" />
                Settings
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;