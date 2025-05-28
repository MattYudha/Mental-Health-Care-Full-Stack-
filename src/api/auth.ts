import {
  LoginCredentials,
  RegisterCredentials,
  User,
  AuthResponse,
  PasswordFormData,
} from "../types/auth";
import { API_URL } from "./config";
import { ChangePasswordInput } from "../schemas/authSchemas";

class AuthApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem("token");
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

  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getCurrentUser() {
    return this.request("/auth/me");
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    return this.request<User>("/auth/profile", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: ChangePasswordInput) {
    return this.request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getTwoFactorStatus() {
    return this.request<{ isEnabled: boolean }>("/auth/2fa/status");
  }
}

export const authApi = new AuthApi();
