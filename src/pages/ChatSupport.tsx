import React, { useState } from 'react';
import { Send, User, Bot, Clock, ChevronDown, Info } from 'lucide-react';

const ChatSupport: React.FC = () => {
  const [message, setMessage] = useState('');
  
  // Dummy conversation history
  const [conversation, setConversation] = useState([
    {
      id: 1,
      sender: 'bot',
      message: "Hello! I'm MindGuard, your supportive AI assistant. How are you feeling today?",
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      sender: 'user',
      message: "I've been feeling stressed about my gambling habits. I spent more than I should have last night.",
      timestamp: '10:31 AM'
    },
    {
      id: 3,
      sender: 'bot',
      message: "I'm sorry to hear you're feeling stressed. It takes courage to acknowledge concerns about gambling habits. Would you like to talk more about what happened last night, or would you prefer some techniques to manage the stress you're feeling right now?",
      timestamp: '10:31 AM'
    },
    {
      id: 4,
      sender: 'user',
      message: "I think I need help with the stress first. I feel really anxious about the money I lost.",
      timestamp: '10:32 AM'
    },
    {
      id: 5,
      sender: 'bot',
      message: "That's understandable. Financial stress can be particularly challenging. Let's try a quick breathing exercise that can help reduce anxiety. Take a slow, deep breath in through your nose for 4 counts, hold it for 2, and then exhale through your mouth for 6 counts. Would you like to try this together?",
      timestamp: '10:33 AM'
    }
  ]);

  const sendMessage = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: conversation.length + 1,
      sender: 'user',
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setConversation([...conversation, newMessage]);
    setMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: conversation.length + 2,
        sender: 'bot',
        message: "Thank you for sharing that. Remember that acknowledging your feelings is an important step. Would you like to explore some strategies to help manage gambling urges when they arise?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setConversation(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedResponses = [
    "Yes, I'd like to learn strategies to manage gambling urges",
    "Can you help me create a budget plan?",
    "I need resources for professional support"
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="bg-white rounded-lg shadow flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mr-3">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-base font-medium text-gray-800">MindGuard Support</h2>
              <p className="text-xs text-gray-500">AI-powered support assistant</p>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Info size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                  msg.sender === 'user'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start">
                  {msg.sender === 'bot' && (
                    <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mr-2 mt-0.5 flex-shrink-0">
                      <Bot size={14} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm">{msg.message}</p>
                    <div className={`flex justify-end mt-1 text-xs ${msg.sender === 'user' ? 'text-teal-100' : 'text-gray-500'}`}>
                      <Clock size={10} className="mr-1 mt-0.5" />
                      {msg.timestamp}
                    </div>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="h-6 w-6 rounded-full bg-teal-400 flex items-center justify-center text-white ml-2 mt-0.5 flex-shrink-0">
                      <User size={14} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Suggested responses:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedResponses.map((response, index) => (
                <button
                  key={index}
                  className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setMessage(response);
                  }}
                >
                  {response}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-end space-x-2">
            <div className="flex-1 bg-white rounded-lg border border-gray-200 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
              <textarea
                rows={1}
                placeholder="Type your message..."
                className="block w-full px-3 py-2 text-sm bg-transparent border-0 resize-none focus:ring-0 focus:outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              className={`p-2 rounded-full ${
                message.trim() ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}
              onClick={sendMessage}
              disabled={!message.trim()}
            >
              <Send size={18} />
            </button>
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              AI-powered support. Not a substitute for professional help.
            </p>
            <button className="flex items-center text-xs text-teal-600 hover:text-teal-700">
              <span>Resources</span>
              <ChevronDown size={12} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;