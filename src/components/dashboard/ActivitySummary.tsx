import React from 'react';
import { CheckCircle2, Calendar } from 'lucide-react';

const ActivitySummary: React.FC = () => {
  const activities = [
    { id: 1, type: 'Meditation', duration: '15 min', date: 'Today, 09:30 AM', completed: true },
    { id: 2, type: 'Walking', duration: '30 min', date: 'Today, 02:15 PM', completed: true },
    { id: 3, type: 'Journaling', duration: '10 min', date: 'Yesterday, 08:45 PM', completed: true },
    { id: 4, type: 'Breathing Exercise', duration: '5 min', date: 'Yesterday, 03:30 PM', completed: true },
    { id: 5, type: 'Reading', duration: '20 min', date: '2 days ago', completed: true }
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
          <div className={`p-2 rounded-full ${activity.completed ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'} mr-3`}>
            {activity.completed ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Calendar className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-800">{activity.type}</h3>
            <p className="text-xs text-gray-500">{activity.duration} • {activity.date}</p>
          </div>
        </div>
      ))}
      <button className="w-full py-2 text-sm text-teal-600 hover:text-teal-700 font-medium">
        View All Activities
      </button>
    </div>
  );
};

export default ActivitySummary;