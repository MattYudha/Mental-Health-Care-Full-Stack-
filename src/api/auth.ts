// src/api/auth.ts
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User, // Ensure this User type is comprehensive
} from "../types/auth";
import { API_URL } from "./config";
import { ChangePasswordInput } from "../schemas/authSchemas";

class AuthApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = localStorage.getItem("token"); // This token should come from AuthContext or be consistently managed
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getCurrentUser(): Promise<User> { // Ensure the return type matches the backend's /me endpoint
    return this.request<User>("/auth/me");
  }

  // Moved to a dedicated `userApi` if one exists, or rename to reflect its purpose.
  // If it's still here, ensure the endpoint path is correct.
  async changePassword(data: ChangePasswordInput): Promise<any> { // Adjust return type if specific response is given
    return this.request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getTwoFactorStatus(): Promise<{ isEnabled: boolean }> {
    return this.request<{ isEnabled: boolean }>("/auth/2fa/status");
  }
}

export const authApi = new AuthApi();

// New API for user profile (or extend AuthApi if preferred)
class UserApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = localStorage.getItem("token"); // Token from AuthContext
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    // Correct endpoint for user profile updates handled by userRoutes
    return this.request<User>("/users/profile", {
      method: "PUT", // Or PATCH based on your backend
      body: JSON.stringify(data),
    });
  }
}

export const userApi = new UserApi();
