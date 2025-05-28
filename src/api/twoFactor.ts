import {
  TwoFactorSetupResponse,
  TwoFactorVerifyResponse,
  TwoFactorVerifyTokenResponse,
} from "../types/auth";
import { API_URL } from "./config";

class TwoFactorApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "An error occurred");
    }

    return response.json();
  }

  async setup(): Promise<TwoFactorSetupResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    return this.request<TwoFactorSetupResponse>("/2fa/setup", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async verifyAndEnable(token: string): Promise<TwoFactorVerifyResponse> {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      throw new Error("No token found");
    }

    return this.request<TwoFactorVerifyResponse>("/2fa/verify-and-enable", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ token }),
    });
  }

  async verifyToken(
    token: string,
    tempToken: string
  ): Promise<TwoFactorVerifyTokenResponse> {
    return this.request<TwoFactorVerifyTokenResponse>("/2fa/verify-token", {
      method: "POST",
      body: JSON.stringify({ token, tempToken }),
    });
  }

  async verifyRecoveryCode(
    code: string,
    tempToken: string
  ): Promise<TwoFactorVerifyTokenResponse> {
    return this.request<TwoFactorVerifyTokenResponse>("/2fa/verify-recovery", {
      method: "POST",
      body: JSON.stringify({ code, tempToken }),
    });
  }

  async disable(): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    return this.request<void>("/2fa/disable", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const twoFactorApi = new TwoFactorApi();
