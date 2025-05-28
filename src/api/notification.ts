import { API_URL } from "./config";

export interface NotificationSettings {
  id: string;
  userId: string;
  notifyActivityReminders: boolean;
  notifyProgressUpdates: boolean;
  notifySupportMessages: boolean;
  notifyNewArticles: boolean;
  notifyRiskAlerts: boolean;
  notifyWeeklyReports: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
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
    options: RequestInit = {}
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
    settings: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    return this.request<NotificationSettings>("/notifications/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  async getNotifications(
    page: number = 1,
    limit: number = 10
  ): Promise<NotificationResponse> {
    return this.request<NotificationResponse>(
      `/notifications?page=${page}&limit=${limit}`
    );
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    return this.request<Notification>(`/notifications/${notificationId}/read`, {
      method: "PUT",
    });
  }

  async markAllNotificationsAsRead(): Promise<{ message: string }> {
    return this.request<{ message: string }>("/notifications/read-all", {
      method: "PUT",
    });
  }
}

export const notificationApi = new NotificationApi();
