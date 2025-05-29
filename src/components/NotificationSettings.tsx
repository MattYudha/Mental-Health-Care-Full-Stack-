// src/components/NotificationSettings.tsx
import React, { useState, useEffect } from "react";
import {
  notificationApi,
  NotificationSettings as NotificationSettingsType,
} from "../api/notification";
import toast from "react-hot-toast";
import { Bell, BellOff, Loader2 } from "lucide-react";
import Section from "./ui/Section"; // Assuming you want to use your Section component

interface NotificationSettingsProps {
  onSettingsChange?: (settings: NotificationSettingsType) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  onSettingsChange,
}) => {
  const [settings, setSettings] = useState<NotificationSettingsType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await notificationApi.getNotificationSettings();
      setSettings(data);
      onSettingsChange?.(data);
    } catch (error) {
      toast.error("Failed to load notification settings");
      console.error("Error loading notification settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (key: keyof NotificationSettingsType) => {
    if (!settings || isSaving) return;

    setIsSaving(true);
    try {
      const updatedSettings = await notificationApi.updateNotificationSettings({
        [key]: !settings[key],
      });
      setSettings(updatedSettings);
      onSettingsChange?.(updatedSettings);
      toast.success("Notification settings updated");
    } catch (error) {
      toast.error("Failed to update notification settings");
      console.error("Error updating notification settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Section
        title="Notification Settings"
        description="Manage your email and push notification preferences."
      >
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      </Section>
    );
  }

  if (!settings) {
    return (
      <Section
        title="Notification Settings"
        description="Manage your email and push notification preferences."
      >
        <div className="p-4 text-center text-gray-500">
          Failed to load notification settings.
        </div>
      </Section>
    );
  }

  // Ensure these keys match the NotificationSettingsType and your backend expectations
  const notificationTypes = [
    {
      key: "notify_activity_reminders", // Changed to snake_case
      label: "Activity Reminders",
      description: "Get reminders for daily activities and exercises",
    },
    {
      key: "notify_progress_updates", // Changed to snake_case
      label: "Progress Updates",
      description: "Receive updates about your progress and achievements",
    },
    {
      key: "notify_support_messages", // Changed to snake_case
      label: "Support Messages",
      description: "Get notified when you receive messages from support",
    },
    {
      key: "notify_new_articles", // Changed to snake_case
      label: "New Articles",
      description: "Stay informed about new educational content",
    },
    {
      key: "notify_risk_alerts", // Changed to snake_case
      label: "Risk Alerts",
      description: "Get notified about important risk assessments",
    },
    {
      key: "notify_weekly_summary", // Changed to snake_case, previously notifyWeeklyReports
      label: "Weekly Reports",
      description: "Receive weekly progress reports",
    },
  ];

  const deliveryMethods = [
    {
      key: "email_notifications", // Changed to snake_case
      label: "Email Notifications",
      description: "Receive notifications via email",
    },
    {
      key: "push_notifications", // Changed to snake_case
      label: "Push Notifications",
      description: "Receive notifications in your browser",
    },
    // Assuming you have SMS notifications field as per ProfilePage.tsx
    {
      key: "sms_notifications", // Changed to snake_case
      label: "SMS Notifications",
      description: "Receive notifications via SMS",
    },
  ];

  return (
    <Section
      title="Notification Settings"
      description="Manage your email and push notification preferences."
    >
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Notification Types
          </h4>
          <div className="space-y-3">
            {notificationTypes.map(({ key, label, description }) => (
              <div
                key={key}
                className="flex items-start justify-between p-4 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-gray-900">{label}</h5>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
                <button
                  onClick={() =>
                    handleToggle(key as keyof NotificationSettingsType)
                  }
                  disabled={isSaving}
                  title={`Toggle ${label}`}
                  className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings[key as keyof NotificationSettingsType]
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings[key as keyof NotificationSettingsType]
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Delivery Methods
          </h4>
          <div className="space-y-3">
            {deliveryMethods.map(({ key, label, description }) => (
              <div
                key={key}
                className="flex items-start justify-between p-4 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-gray-900">{label}</h5>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
                <button
                  onClick={() =>
                    handleToggle(key as keyof NotificationSettingsType)
                  }
                  disabled={isSaving}
                  title={`Toggle ${label}`}
                  className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings[key as keyof NotificationSettingsType]
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings[key as keyof NotificationSettingsType]
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default NotificationSettings;
