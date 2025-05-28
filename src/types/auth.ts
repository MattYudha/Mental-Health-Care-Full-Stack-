export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  joinDate?: string;
  streak?: number;
  completedActivities?: number;
  supportSessions?: number;
  riskScore?: {
    current: number;
    previous: number;
    change: number;
  };
  twoFactorEnabled: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  requiresTwoFactor?: boolean;
  tempToken?: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorSetupResponse {
  secret: string;
  qrCode: string;
}

export interface TwoFactorVerifyResponse {
  recoveryCodes: string[];
}

export interface TwoFactorVerifyTokenResponse {
  token: string;
  user: User;
}
