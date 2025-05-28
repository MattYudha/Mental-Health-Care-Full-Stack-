import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout components
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import SentimentAnalysis from './pages/SentimentAnalysis';
import WellnessTracker from './pages/WellnessTracker';
import ChatSupport from './pages/ChatSupport';
import Resources from './pages/Resources';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="sentiment" element={<SentimentAnalysis />} />
          <Route path="wellness" element={<WellnessTracker />} />
          <Route path="chat" element={<ChatSupport />} />
          <Route path="resources" element={<Resources />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;