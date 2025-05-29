// src/pages/Profile.tsx
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Settings,
  Bell,
  Lock,
  ChevronRight,
  LogOut,
  Calendar,
  BarChart4,
  MessageSquare,
  TrendingDown,
} from "lucide-react";
import toast from "react-hot-toast";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Section from "../components/ui/Section";
import PrivacySecuritySettings from "../components/PrivacySecuritySettings";
import NotificationSettingsComponent from "../components/NotificationSettings"; // Renamed to avoid conflict
import { profileSchema, ProfileFormData } from "../schemas/profileSchema";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { userApi } from "../api/auth"; // Import the userApi for profile updates
import { notificationApi } from "../api/notification"; // Import notificationApi for settings

// Import types from lib/supabaseClient
import type {
  Profile as SupabaseProfileType,
  NotificationSettings as SupabaseNotificationSettingsType,
} from "../lib/supabaseClient";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] =
    useState<SupabaseNotificationSettingsType | null>(null);

  // User data state, aligned with SupabaseProfileType
  const [userData, setUserData] = useState<SupabaseProfileType>({
    id: "",
    full_name: null, // Can be null in DB
    phone_number: null,
    join_date: "",
    streak: 0,
    completed_activities: 0,
    risk_score_current: 0,
    risk_score_previous: 0,
    created_at: "",
    updated_at: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "", // Initialize with empty string, will be reset by useEffect
      email: "",
      phone: "",
    },
  });

  // Fetch profile and notification settings data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Supabase profile fetch error:", profileError);
          // Handle case where profile might not exist for a new user yet
          // based on handle_new_user trigger in Supabase.
          // If profileData is null because the trigger hasn't run yet,
          // create a temporary default profile for the form.
          if (profileError.code === "PGRST116") {
            // No rows found for single()
            setUserData({
              id: user.id,
              full_name: user.email?.split("@")[0] || "New User",
              phone_number: null,
              join_date: new Date().toISOString(),
              streak: 0,
              completed_activities: 0,
              risk_score_current: 0,
              risk_score_previous: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          } else {
            throw profileError;
          }
        } else if (profileData) {
          setUserData(profileData as SupabaseProfileType);
        }

        // Fetch notification settings
        const { data: settingsData, error: settingsError } =
          await notificationApi.getNotificationSettings();

        if (settingsError) throw settingsError;

        if (settingsData) {
          setNotificationSettings(settingsData);
        }

        // Update form with fetched data
        reset({
          name: profileData?.full_name || user.email?.split("@")[0] || "",
          email: user.email || "",
          phone: profileData?.phone_number || "",
        });
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error(error.message || "Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, reset]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (!user) return;

    try {
      const updatedUser = await userApi.updateProfile({
        id: user.id, // Pass ID to API
        name: data.name,
        email: data.email, // Email might not be updatable via this endpoint, ensure backend handles it
        phone: data.phone || null,
      });

      setUserData((prev) => ({
        ...prev,
        full_name: updatedUser.name,
        phone_number: updatedUser.phone || null,
        // Update other fields if the API returns them
        updated_at: new Date().toISOString(), // Assuming API updates this
      }));
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  // This function is now handled by the NotificationSettings component internally
  // but it's good practice to keep the handler for state management if needed.
  const handleNotificationSettingsChange = (
    updatedSettings: SupabaseNotificationSettingsType
  ) => {
    setNotificationSettings(updatedSettings);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <Section
              title="Personal Information"
              description="Update your personal details"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  {...register("name")}
                  error={errors.name?.message}
                  fullWidth
                />

                <Input
                  label="Email Address"
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                  fullWidth
                  disabled // Email typically not directly editable here
                />

                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  {...register("phone")}
                  error={errors.phone?.message}
                  placeholder="Add a phone number"
                  fullWidth
                />

                <Button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  isLoading={isSubmitting}
                  className="mt-6"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Section>

            <Section title="Activity Overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Current Streak</p>
                      <p className="text-2xl font-bold text-teal-700">
                        {userData.streak} days
                      </p>
                    </div>
                    <div className="p-2 bg-teal-100 rounded-full text-teal-600">
                      <Calendar size={18} />
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">
                        Activities Completed
                      </p>
                      <p className="text-2xl font-bold text-purple-700">
                        {userData.completed_activities}
                      </p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                      <BarChart4 size={18} />
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Risk Score</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-yellow-700">
                          {userData.risk_score_current}%
                        </p>
                        {userData.risk_score_current >
                        userData.risk_score_previous ? (
                          <span className="ml-2 text-sm text-red-500 flex items-center">
                            <TrendingDown size={16} />
                            {Math.abs(
                              userData.risk_score_current -
                                userData.risk_score_previous
                            )}
                            %
                          </span>
                        ) : (
                          <span className="ml-2 text-sm text-green-500 flex items-center">
                            <TrendingDown size={16} className="rotate-180" />
                            {Math.abs(
                              userData.risk_score_previous -
                                userData.risk_score_current
                            )}
                            %
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                      <BarChart4 size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Settings">
              <div className="divide-y divide-gray-200">
                <button
                  onClick={() => setActiveTab("notifications")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-full text-gray-600 mr-3">
                      <Bell size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Notifications
                      </p>
                      <p className="text-xs text-gray-500">
                        Manage how and when you receive alerts
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>

                <button
                  onClick={() => setActiveTab("privacy-security")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-full text-gray-600 mr-3">
                      <Lock size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Privacy & Security
                      </p>
                      <p className="text-xs text-gray-500">
                        Update password and security settings
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>

                {/* You had "preferences" tab, but no content in renderTabContent for it.
                    If it's intentional, it's fine. Otherwise, consider adding content or removing. */}
                <button
                  onClick={() => setActiveTab("preferences")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-full text-gray-600 mr-3">
                      <Settings size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Preferences
                      </p>
                      <p className="text-xs text-gray-500">
                        Customize your experience
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center p-4 hover:bg-gray-50 text-left text-red-500"
                >
                  <div className="p-2 bg-red-100 rounded-full text-red-500 mr-3">
                    <LogOut size={18} />
                  </div>
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </Section>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <NotificationSettingsComponent
              onSettingsChange={handleNotificationSettingsChange}
            />
          </div>
        );

      case "privacy-security":
        return (
          <div className="space-y-6">
            <PrivacySecuritySettings />
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6">
            <Section
              title="Preferences"
              description="Customize your application experience"
            >
              <p className="text-gray-600">
                More preferences will be available soon.
              </p>
            </Section>
          </div>
        );
      case "activity-history":
        return (
          <Section title="Activity History">
            <p className="text-gray-600">Coming soon...</p>
          </Section>
        );
      case "chat-history":
        return (
          <Section title="Chat History">
            <p className="text-gray-600">Coming soon...</p>
          </Section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Account Settings
      </h1>
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col items-center pb-4 border-b border-gray-200">
              <div className="h-20 w-20 rounded-full bg-teal-500 flex items-center justify-center text-white mb-3">
                <User size={40} />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                {userData.full_name}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="mt-1 text-xs text-gray-400">
                Member since {new Date(userData.join_date).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-1 mt-4">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center p-2 rounded-md text-sm ${
                  activeTab === "profile"
                    ? "bg-teal-50 text-teal-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <User size={16} className="mr-3" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab("activity-history")}
                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === "activity-history"
                    ? "bg-teal-100 text-teal-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BarChart4 className="mr-3 h-5 w-5" />
                Activity History
              </button>
              <button
                onClick={() => setActiveTab("chat-history")}
                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === "chat-history"
                    ? "bg-teal-100 text-teal-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <MessageSquare className="mr-3 h-5 w-5" />
                Chat History
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === "notifications"
                    ? "bg-teal-100 text-teal-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Bell className="mr-3 h-5 w-5" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("privacy-security")}
                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === "privacy-security"
                    ? "bg-teal-100 text-teal-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Lock className="mr-3 h-5 w-5" />
                Privacy & Security
              </button>
              <button
                onClick={handleSignOut}
                className="w-full text-left flex items-center p-3 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:w-3/4 mt-6 lg:mt-0">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export { ProfilePage as Profile };
