import React from 'react';
import { 
  AlertTriangle, 
  BookOpen, 
  MessagesSquare, 
  Search
} from 'lucide-react';

const SentimentAnalysis: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const riskFactors = [
    { factor: 'Frequency', score: 65, color: 'bg-yellow-500' },
    { factor: 'Duration', score: 45, color: 'bg-green-500' },
    { factor: 'Amount Spent', score: 78, color: 'bg-red-500' },
    { factor: 'Emotional Impact', score: 62, color: 'bg-yellow-500' },
    { factor: 'Social Isolation', score: 35, color: 'bg-green-500' },
  ];

  const conversationExcerpts = [
    {
      id: 1,
      text: "I've been spending more time gambling online lately. It helps me forget about my problems.",
      date: '2 days ago',
      sentiment: 'negative',
      keywords: ['gambling', 'escape', 'problems']
    },
    {
      id: 2,
      text: "I'm trying to cut back on online betting. I set a limit for myself this week.",
      date: '5 days ago',
      sentiment: 'positive',
      keywords: ['cut back', 'limit', 'self-control']
    },
    {
      id: 3,
      text: "Lost $200 last night. Feeling really anxious about it but want to win it back.",
      date: '1 week ago',
      sentiment: 'negative',
      keywords: ['loss', 'anxious', 'chasing losses']
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Sentiment Analysis</h1>
        <p className="text-gray-600">Monitor conversations for signs of gambling behaviors</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Current Risk Assessment</h2>
          <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Moderate Risk
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Risk Score</span>
                <span className="text-sm font-medium text-yellow-600">57/100</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '57%' }}></div>
              </div>
            </div>

            <div className="space-y-3">
              {riskFactors.map((factor) => (
                <div key={factor.factor} className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{factor.factor}</span>
                    <span className="text-sm text-gray-600">{factor.score}/100</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${factor.color} rounded-full`} style={{ width: `${factor.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium text-gray-800 mb-3">Risk Factor Insights</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                Your risk assessment indicates moderate concerns related to gambling behaviors.
                Key issues identified:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 mb-3">
                <li className="flex items-start">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                  <span>Increased spending on gambling activities</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500 mt-1.5 mr-2"></span>
                  <span>Gambling as an emotional coping mechanism</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500 mt-1.5 mr-2"></span>
                  <span>Moderate increase in gambling frequency</span>
                </li>
              </ul>
              <button className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                View detailed report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Conversation Analysis</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          {conversationExcerpts.map((excerpt) => (
            <div 
              key={excerpt.id} 
              className={`p-4 rounded-lg border ${
                excerpt.sentiment === 'negative' 
                  ? 'border-red-200 bg-red-50' 
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <div className="flex items-start mb-2">
                <MessagesSquare className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                <p className="text-sm text-gray-700">{excerpt.text}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center text-gray-500">
                  <span>From conversation on {excerpt.date}</span>
                </div>
                <div className="flex flex-wrap mt-2 space-x-1">
                  {excerpt.keywords.map((keyword, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-white rounded-full text-xs text-gray-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="px-4 py-2 bg-teal-50 text-teal-600 hover:bg-teal-100 rounded-md text-sm font-medium transition-colors">
            Analyze New Conversations
          </button>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;