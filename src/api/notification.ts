// src/api/notification.ts
import { API_URL } from "./config";

// Ensure these interfaces strictly match your Supabase database schema and backend response types
export interface NotificationSettings {
  id: string;
  user_id: string; // From DB schema
  notify_activity_reminders: boolean; // From DB schema
  notify_progress_updates: boolean; // From DB schema
  notify_support_messages?: boolean; // If this exists in DB/backend
  notify_new_articles?: boolean; // If this exists in DB/backend
  notify_risk_alerts: boolean; // From DB schema
  notify_weekly_summary: boolean; // From DB schema
  email_notifications?: boolean; // From ProfilePage.tsx usage
  push_notifications?: boolean; // From ProfilePage.tsx usage
  sms_notifications?: boolean; // From ProfilePage.tsx usage
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string; // From DB schema
  type: string;
  title: string;
  message: string;
  is_read: boolean; // From DB schema
  created_at: string;
  updated_at: string; // From backend response
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

class NotificationApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "An error occurred");
    }

    return response.json();
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    return this.request<NotificationSettings>("/notifications/settings");
  }

  async updateNotificationSettings(
    settings: Partial<NotificationSettings>,
  ): Promise<NotificationSettings> {
    return this.request<NotificationSettings>("/notifications/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  async getNotifications(
    page: number = 1,
    limit: number = 10,
  ): Promise<NotificationResponse> {
    return this.request<NotificationResponse>(
      `/notifications?page=${page}&limit=${limit}`,
    );
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    // Endpoint fixed to match backend: /notifications/:notificationId/read
    return this.request<Notification>(`/notifications/${notificationId}/read`, {
      method: "PUT",
    });
  }

  async markAllNotificationsAsRead(): Promise<{ message: string }> {
    // Endpoint fixed to match backend: /notifications/read-all
    return this.request<{ message: string }>("/notifications/read-all", {
      method: "PUT",
    });
  }
}

export const notificationApi = new NotificationApi();
