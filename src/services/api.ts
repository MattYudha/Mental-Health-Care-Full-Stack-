// src/services/api.ts
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { supabase } from "../lib/supabaseClient"; // Assuming supabase client is exported from here

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Keep if your backend relies on cookie-based sessions for other things
});

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => { // Make the interceptor async
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor for token refresh (if using custom backend tokens)
// If your backend strictly uses Supabase JWTs and validates them (e.g. via Supabase Admin SDK or public key),
// then Supabase client itself handles token refreshes. This interceptor might be for a custom token system.
// For this example, assuming it might still be relevant if you have a hybrid system or custom backend tokens.
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle token expiration specifically for your custom backend API if needed
    if (
      error.response?.status === 401 && !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to get a fresh Supabase token, assuming it's the one your backend expects or can exchange
        const { data: { session }, error: sessionError } = await supabase.auth
          .refreshSession();
        if (sessionError || !session?.access_token) {
          throw new Error(
            sessionError?.message ||
              "No refresh token or session available via Supabase",
          );
        }
        const newToken = session.access_token;

        // If your backend uses its own token refresh mechanism (e.g. /auth/refresh with a Supabase token)
        // This part needs to align with your backend's token strategy.
        // For now, let's assume the new Supabase token is directly usable.
        // localStorage.setItem("token", newToken); // Not strictly needed if Supabase client manages it and interceptor fetches it

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, sign out the user via Supabase
        await supabase.auth.signOut();
        window.location.href = "/login"; // Redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
