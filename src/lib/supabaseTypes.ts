export interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  notify_activity_reminders: boolean;
  notify_progress_updates: boolean;
  notify_risk_alerts: boolean;
  notify_weekly_summary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string | null;
  mood_score: number | null;
  created_at: string;
}

export interface UserGoal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      notification_settings: {
        Row: NotificationSettings;
        Insert: Omit<NotificationSettings, "id" | "created_at" | "updated_at">;
        Update: Partial<
          Omit<NotificationSettings, "id" | "created_at" | "updated_at">
        >;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Notification, "id" | "created_at" | "updated_at">>;
      };
      user_activities: {
        Row: UserActivity;
        Insert: Omit<UserActivity, "id" | "created_at">;
        Update: Partial<Omit<UserActivity, "id" | "created_at">>;
      };
      user_goals: {
        Row: UserGoal;
        Insert: Omit<UserGoal, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<UserGoal, "id" | "created_at" | "updated_at">>;
      };
    };
  };
}
