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
import { profileSchema, ProfileFormData } from "../schemas/profileSchema";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
import type { Profile, NotificationSettings } from "../lib/supabaseClient";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings | null>(null);

  // User data state
  const [userData, setUserData] = useState<Profile>({
    id: "",
    full_name: "",
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
      name: userData.full_name,
      email: user?.email || "",
      phone: userData.phone_number || "",
    },
  });

  // Fetch profile and notification settings data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData) {
          setUserData(profileData);
          reset({
            name: profileData.full_name,
            email: user.email || "",
            phone: profileData.phone_number || "",
          });
        }

        // Fetch notification settings
        const { data: settingsData, error: settingsError } = await supabase
          .from("notification_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (settingsError) throw settingsError;

        if (settingsData) {
          setNotificationSettings(settingsData);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, reset]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.name,
          phone_number: data.phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      // Update userData state
      setUserData((prev) => ({
        ...prev,
        full_name: data.name,
        phone_number: data.phone || null,
        updated_at: new Date().toISOString(),
      }));

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleNotificationSettingChange = async (
    setting: keyof NotificationSettings,
    value: boolean
  ) => {
    if (!user || !notificationSettings) return;

    try {
      const { error } = await supabase
        .from("notification_settings")
        .update({
          [setting]: value,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setNotificationSettings((prev) =>
        prev ? { ...prev, [setting]: value } : null
      );
      toast.success("Notification settings updated!");
    } catch (error: any) {
      console.error("Error updating notification settings:", error);
      toast.error(error.message || "Failed to update notification settings");
    }
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
                  disabled
                />

                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  {...register("phone")}
                  error={errors.phone?.message}
                  placeholder="Add a phone number"
                  fullWidth
                ></Input>

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
                            {userData.risk_score_current -
                              userData.risk_score_previous}
                            %
                          </span>
                        ) : (
                          <span className="ml-2 text-sm text-green-500 flex items-center">
                            <TrendingDown size={16} className="rotate-180" />
                            {userData.risk_score_previous -
                              userData.risk_score_current}
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
          </div>
        );
      case "notifications":
        return notificationSettings ? (
          <Section
            title="Notification Settings"
            description="Manage your email and push notification preferences."
          >
            <div className="space-y-4">
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.email_notifications}
                    onChange={(e) =>
                      handleNotificationSettingChange(
                        "email_notifications",
                        e.target.checked
                      )
                    }
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Email Notifications
                  </span>
                </label>
              </div>
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.push_notifications}
                    onChange={(e) =>
                      handleNotificationSettingChange(
                        "push_notifications",
                        e.target.checked
                      )
                    }
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Push Notifications
                  </span>
                </label>
              </div>
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.sms_notifications}
                    onChange={(e) =>
                      handleNotificationSettingChange(
                        "sms_notifications",
                        e.target.checked
                      )
                    }
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    SMS Notifications
                  </span>
                </label>
              </div>
            </div>
          </Section>
        ) : (
          <div className="text-center text-gray-500">
            Notification settings not available.
          </div>
        );
      case "privacy-security":
        return <PrivacySecuritySettings />;
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
          <div className="bg-white rounded-lg shadow p-6 space-y-2">
            <button
              className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                activeTab === "profile"
                  ? "bg-teal-100 text-teal-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="mr-3 h-5 w-5" />
              Profile
            </button>
            <button
              className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                activeTab === "activity-history"
                  ? "bg-teal-100 text-teal-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("activity-history")}
            >
              <BarChart4 className="mr-3 h-5 w-5" />
              Activity History
            </button>
            <button
              className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                activeTab === "chat-history"
                  ? "bg-teal-100 text-teal-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("chat-history")}
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              Chat History
            </button>
            <button
              className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                activeTab === "notifications"
                  ? "bg-teal-100 text-teal-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="mr-3 h-5 w-5" />
              Notifications
            </button>
            <button
              className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                activeTab === "privacy-security"
                  ? "bg-teal-100 text-teal-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("privacy-security")}
            >
              <Lock className="mr-3 h-5 w-5" />
              Privacy & Security
            </button>
            <button
              className="w-full text-left flex items-center p-3 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:w-3/4 mt-6 lg:mt-0">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ProfilePage;
