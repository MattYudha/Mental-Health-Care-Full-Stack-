import { createClient } from "@supabase/supabase-js";

// Hardcoded values for testing
const supabaseUrl = "http://127.0.0.1:54321";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Profile {
  id: string;
  full_name: string;
  phone_number: string | null;
  join_date: string;
  streak: number;
  completed_activities: number;
  risk_score_current: number;
  risk_score_previous: number;
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
}
