// Common types for the application

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  streak: number;
  completedActivities: number;
}

export interface RiskScore {
  overall: number;
  factors: {
    [key: string]: number;
  };
  previousScore?: number;
  lastUpdated: string;
}

export interface WellnessActivity {
  id: number;
  name: string;
  duration: string;
  impact: string;
  category: string;
  completed: boolean;
  scheduledDate?: string;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'hotlines' | 'articles' | 'videos' | 'groups';
  contact?: string;
  website?: string;
  source?: string;
  readTime?: string;
  duration?: string;
  schedule?: string;
  locations?: string;
  featured?: boolean;
}