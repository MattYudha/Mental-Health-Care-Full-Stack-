import React, { useState, useEffect } from "react";
import {
  notificationApi,
  NotificationSettings as NotificationSettingsType,
} from "../api/notification";
import toast from "react-hot-toast";
import { Bell, BellOff, Loader2 } from "lucide-react";

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
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-4 text-center text-gray-500">
        Failed to load notification settings
      </div>
    );
  }

  const notificationTypes = [
    {
      key: "notifyActivityReminders",
      label: "Activity Reminders",
      description: "Get reminders for daily activities and exercises",
    },
    {
      key: "notifyProgressUpdates",
      label: "Progress Updates",
      description: "Receive updates about your progress and achievements",
    },
    {
      key: "notifySupportMessages",
      label: "Support Messages",
      description: "Get notified when you receive messages from support",
    },
    {
      key: "notifyNewArticles",
      label: "New Articles",
      description: "Stay informed about new educational content",
    },
    {
      key: "notifyRiskAlerts",
      label: "Risk Alerts",
      description: "Get notified about important risk assessments",
    },
    {
      key: "notifyWeeklyReports",
      label: "Weekly Reports",
      description: "Receive weekly progress reports",
    },
  ];

  const deliveryMethods = [
    {
      key: "emailNotifications",
      label: "Email Notifications",
      description: "Receive notifications via email",
    },
    {
      key: "pushNotifications",
      label: "Push Notifications",
      description: "Receive notifications in your browser",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Notification Settings
        </h3>
      </div>

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
    </div>
  );
};

export default NotificationSettings;
