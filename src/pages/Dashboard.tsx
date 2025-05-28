import React from 'react';
import { 
  BarChart3, 
  HeartPulse, 
  MessageSquareText, 
  TrendingDown,
  Activity,
  Smile,
  BookOpen
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RiskScoreChart from '../components/dashboard/RiskScoreChart';
import ActivitySummary from '../components/dashboard/ActivitySummary';
import RecommendedResources from '../components/dashboard/RecommendedResources';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, John</h1>
        <p className="text-gray-600">Here's an overview of your wellness journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Current Risk Score" 
          value="32%" 
          change="-5%" 
          trend="down"
          icon={<TrendingDown className="h-5 w-5 text-green-500" />}
          description="Lower than last week"
        />
        <StatCard 
          title="Wellness Activities" 
          value="14" 
          change="+3" 
          trend="up"
          icon={<Activity className="h-5 w-5 text-purple-500" />}
          description="Completed this week"
        />
        <StatCard 
          title="Mood Score" 
          value="78%" 
          change="+12%" 
          trend="up"
          icon={<Smile className="h-5 w-5 text-yellow-500" />}
          description="Better than last week"
        />
        <StatCard 
          title="Chat Sessions" 
          value="5" 
          change="+2" 
          trend="up"
          icon={<MessageSquareText className="h-5 w-5 text-blue-500" />}
          description="Support conversations"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Risk Score Trend</h2>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Weekly
              </button>
              <button className="text-sm font-medium text-teal-600">
                Monthly
              </button>
            </div>
          </div>
          <RiskScoreChart />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center p-3 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors">
              <BarChart3 className="mr-3 h-5 w-5" />
              <span>Check Sentiment Analysis</span>
            </button>
            <button className="w-full flex items-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <HeartPulse className="mr-3 h-5 w-5" />
              <span>Track Wellness Activity</span>
            </button>
            <button className="w-full flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <MessageSquareText className="mr-3 h-5 w-5" />
              <span>Chat with Support</span>
            </button>
            <button className="w-full flex items-center p-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors">
              <BookOpen className="mr-3 h-5 w-5" />
              <span>Access Resources</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <ActivitySummary />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recommended Resources</h2>
          <RecommendedResources />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;