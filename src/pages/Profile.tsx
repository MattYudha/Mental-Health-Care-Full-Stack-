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
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Support Sessions</p>
                      <p className="text-2xl font-bold text-blue-700">12</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                      <MessageSquare size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-base font-medium text-gray-800 mb-3">
                  Risk Score Progress
                </h3>
                <div className="flex items-center mb-3">
                  <div className="w-full mr-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">
                        Previous: {userData.risk_score_previous}%
                      </span>
                      <span className="text-sm text-gray-600">
                        Current: {userData.risk_score_current}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${userData.risk_score_current}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {userData.risk_score_previous - userData.risk_score_current}
                    %
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Your risk score has improved by{" "}
                  {Math.abs(
                    userData.risk_score_previous - userData.risk_score_current
                  )}
                  % since your last assessment. Keep up the good work with your
                  wellness activities!
                </p>
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
                  onClick={() => setActiveTab("privacy")}
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
            <Section
              title="Notification Settings"
              description="Manage how and when you receive notifications"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Activity Reminders
                    </p>
                    <p className="text-xs text-gray-500">
                      Receive reminders for your scheduled activities
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleNotificationSettingChange(
                        "notify_activity_reminders",
                        !notificationSettings?.notify_activity_reminders
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                      notificationSettings?.notify_activity_reminders
                        ? "bg-teal-600"
                        : "bg-gray-200"
                    }`}
                  >
                    <span className="sr-only">Enable activity reminders</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings?.notify_activity_reminders
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Progress Updates
                    </p>
                    <p className="text-xs text-gray-500">
                      Get notified about your milestones and progress
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleNotificationSettingChange(
                        "notify_progress_updates",
                        !notificationSettings?.notify_progress_updates
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                      notificationSettings?.notify_progress_updates
                        ? "bg-teal-600"
                        : "bg-gray-200"
                    }`}
                  >
                    <span className="sr-only">Enable progress updates</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings?.notify_progress_updates
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Risk Alerts
                    </p>
                    <p className="text-xs text-gray-500">
                      Receive alerts about changes in your risk assessment
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleNotificationSettingChange(
                        "notify_risk_alerts",
                        !notificationSettings?.notify_risk_alerts
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                      notificationSettings?.notify_risk_alerts
                        ? "bg-teal-600"
                        : "bg-gray-200"
                    }`}
                  >
                    <span className="sr-only">Enable risk alerts</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings?.notify_risk_alerts
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Weekly Summary
                    </p>
                    <p className="text-xs text-gray-500">
                      Get a weekly summary of your activities and progress
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleNotificationSettingChange(
                        "notify_weekly_summary",
                        !notificationSettings?.notify_weekly_summary
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                      notificationSettings?.notify_weekly_summary
                        ? "bg-teal-600"
                        : "bg-gray-200"
                    }`}
                  >
                    <span className="sr-only">Enable weekly summary</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings?.notify_weekly_summary
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </Section>
          </div>
        );

      case "privacy":
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

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
        <p className="text-gray-600">
          Manage your account and review your progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
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
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center p-2 rounded-md text-sm ${
                  activeTab === "settings"
                    ? "bg-teal-50 text-teal-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Settings size={16} className="mr-3" />
                Settings
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export { ProfilePage as Profile };
