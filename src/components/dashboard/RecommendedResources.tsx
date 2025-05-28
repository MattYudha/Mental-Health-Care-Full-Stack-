import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

const RecommendedResources: React.FC = () => {
  const resources = [
    {
      id: 1,
      title: 'Understanding Gambling Addiction',
      type: 'Article',
      source: 'Mental Health Foundation'
    },
    {
      id: 2,
      title: 'Mindfulness Techniques for Addiction Recovery',
      type: 'Video',
      source: 'Wellness Center'
    },
    {
      id: 3,
      title: 'Breaking the Cycle: A Guide to Behavioral Change',
      type: 'Guide',
      source: 'Psychology Today'
    },
    {
      id: 4,
      title: 'Support Groups Near You',
      type: 'Directory',
      source: 'National Support Network'
    }
  ];

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <div key={resource.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium text-gray-800">{resource.title}</h3>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">{resource.type} • {resource.source}</p>
          </div>
        </div>
      ))}
      <button className="w-full py-2 text-sm text-teal-600 hover:text-teal-700 font-medium">
        Browse All Resources
      </button>
    </div>
  );
};

export default RecommendedResources;