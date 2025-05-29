// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient"; // Assuming direct Supabase client usage for profile data
import StatCard from "../components/dashboard/StatCard";
import RiskScoreChart from "../components/dashboard/RiskScoreChart";
import ActivitySummary from "../components/dashboard/ActivitySummary";
import RecommendedResources from "../components/dashboard/RecommendedResources";
import {
  TrendingDown,
  Activity,
  Smile,
  MessageSquareText,
  BookOpen,
  BarChart3,
  HeartPulse,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Profile as ProfileType } from "../lib/supabaseClient"; // Import Profile type

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<ProfileType | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setDashboardLoading(false);
        return;
      }

      setDashboardLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*") // Select all fields from the profile
          .eq("id", user.id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            // "Searched for a single row, but found no rows"
            console.warn(
              "Profile not found for user. This might be okay if it's a new user and trigger handles it."
            );
            // Fallback or create a default view if profile is essential and not yet created
            // For now, we can show a message or default values.
            setProfileData({
              // Provide a default structure
              id: user.id,
              full_name: user.email || "New User", // Use email as a fallback name
              phone_number: null,
              join_date: new Date().toISOString(),
              streak: 0,
              completed_activities: 0,
              risk_score_current: 0,
              risk_score_previous: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
            toast.success("Welcome! Your profile is being set up.");
          } else {
            throw error;
          }
        } else if (data) {
          setProfileData(data as ProfileType);
        }
      } catch (error: any) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error(error.message || "Could not load dashboard data.");
      } finally {
        setDashboardLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchProfileData();
    } else if (!authLoading && !user) {
      // If not loading and no user, probably should be redirected by ProtectedRoute
      setDashboardLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || dashboardLoading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  if (!user) {
    // This should ideally be caught by ProtectedRoute, but as a fallback:
    navigate("/login");
    return null;
  }

  if (!profileData) {
    return (
      <div className="p-6 text-center">
        Welcome! Setting up your dashboard. If this persists, please check your
        profile or contact support.
      </div>
    );
  }

  const riskChange =
    profileData.risk_score_current !== null &&
    profileData.risk_score_previous !== null
      ? profileData.risk_score_current - profileData.risk_score_previous
      : 0;
  const riskTrend = riskChange < 0 ? "down" : riskChange > 0 ? "up" : "neutral";
  const riskChangeText = `${riskChange >= 0 ? "+" : ""}${riskChange.toFixed(
    0
  )}%`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {profileData.full_name || user.email}
        </h1>
        <p className="text-gray-600">
          Here's an overview of your wellness journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Risk Score"
          value={`${profileData.risk_score_current ?? 0}%`}
          change={riskChangeText}
          trend={riskTrend}
          icon={
            <TrendingDown
              className={`h-5 w-5 ${
                riskTrend === "down"
                  ? "text-green-500"
                  : riskTrend === "up"
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            />
          }
          description={
            riskTrend === "neutral"
              ? "No change"
              : riskTrend === "down"
              ? "Improvement"
              : "Needs attention"
          }
        />
        <StatCard
          title="Wellness Activities"
          value={`${profileData.completed_activities ?? 0}`}
          icon={<Activity className="h-5 w-5 text-purple-500" />}
          description="Total completed"
          // change="+0" // Would need more data for a weekly/daily change
          // trend="neutral"
        />
        <StatCard
          title="Current Streak"
          value={`${profileData.streak ?? 0} days`}
          icon={<Smile className="h-5 w-5 text-yellow-500" />}
          description="Consecutive days active"
          // change="+0"
          // trend="neutral"
        />
        <StatCard
          title="Chat Sessions"
          value="N/A" // This would require data from your chat system
          icon={<MessageSquareText className="h-5 w-5 text-blue-500" />}
          description="Support conversations"
          // change="+0"
          // trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Risk Score Trend
            </h2>
            {/* Add actual controls for weekly/monthly if chart supports it */}
          </div>
          {/* RiskScoreChart would need to be passed actual data or fetch its own */}
          <RiskScoreChart />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              className="w-full flex items-center p-3 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors"
              onClick={() => navigate("/sentiment-analysis")}
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              <span>Check Sentiment Analysis</span>
            </button>
            <button
              className="w-full flex items-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              onClick={() => navigate("/wellness-tracker")}
            >
              <HeartPulse className="mr-3 h-5 w-5" />
              <span>Track Wellness Activity</span>
            </button>
            <button
              className="w-full flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              onClick={() => navigate("/chat-support")}
            >
              <MessageSquareText className="mr-3 h-5 w-5" />
              <span>Chat with Support</span>
            </button>
            <button
              className="w-full flex items-center p-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
              onClick={() => navigate("/resources")}
            >
              <BookOpen className="mr-3 h-5 w-5" />
              <span>Access Resources</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activities
          </h2>
          {/* ActivitySummary would need to fetch and display real recent activities */}
          <ActivitySummary />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recommended Resources
          </h2>
          {/* RecommendedResources can be static or fetch personalized ones */}
          <RecommendedResources />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
