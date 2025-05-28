import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Profile } from "../pages/Profile";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/Dashboard";
import SentimentAnalysis from "../pages/SentimentAnalysis";
import WellnessTracker from "../pages/WellnessTracker";
import ChatSupport from "../pages/ChatSupport";
import Resources from "../pages/Resources";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sentiment-analysis"
        element={
          <ProtectedRoute>
            <SentimentAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wellness-tracker"
        element={
          <ProtectedRoute>
            <WellnessTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat-support"
        element={
          <ProtectedRoute>
            <ChatSupport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <Resources />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
