import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon,
  description 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-full bg-gray-50">{icon}</div>
      </div>
      <div className="flex items-center mt-4">
        {trend === 'up' ? (
          <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${trend === 'up' && change.includes('-') ? 'text-red-500' : 'text-green-500'}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-2">{description}</span>
      </div>
    </div>
  );
};

export default StatCard;