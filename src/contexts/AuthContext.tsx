// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthResponse } from "../types/auth"; // Import AuthResponse type

interface AuthContextType {
  user: User | null; // Supabase User type
  session: Session | null;
  loading: boolean; // True when initial session is loading OR an auth operation is in progress
  isAuthenticated: boolean;
  token: string | null; // Added to easily expose token for API calls
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null); // State for the JWT token
  const [initialLoading, setInitialLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setToken(currentSession?.access_token ?? null); // Set token from session
      setInitialLoading(false);
    };

    fetchInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setToken(currentSession?.access_token ?? null); // Update token on auth state change
      setInitialLoading(false); // Session updated or confirmed

      if (_event === "SIGNED_IN") {
        navigate("/dashboard");
      } else if (_event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required.");
      return;
    }
    setOperationLoading(true);
    try {
      // Use your backend auth endpoint for login instead of direct supabase if your backend handles it
      // For now, sticking to supabase direct as per `backend/src/server.ts` routes setup (authRoutes handling login)
      // If backend `auth/login` is custom, you'd use `authApi.login` here.
      // Assuming you want to use the backend /api/auth/login endpoint for custom logic/validation
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data: AuthResponse = await response.json();
      localStorage.setItem("token", data.token); // Store token if backend returns one

      // Now, use Supabase client to set the session
      // This is crucial if Supabase client is also used for RLS policies
      await supabase.auth.setSession({
        access_token: data.token,
        refresh_token: session?.refresh_token || "", // Use existing refresh token or handle new one
      });
      // onAuthStateChange will handle user and session state updates and navigation
    } catch (error: any) {
      toast.error(error.message || "Login failed. Check your credentials.");
      console.error("Sign-in error:", error);
    } finally {
      setOperationLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      toast.error("All fields are required for registration.");
      return;
    }
    setOperationLoading(true);
    try {
      // Use your backend auth endpoint for register
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: fullName, email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data: AuthResponse = await response.json();
      localStorage.setItem("token", data.token); // Store token if backend returns one

      await supabase.auth.setSession({
        access_token: data.token,
        refresh_token: session?.refresh_token || "",
      });

      toast.success(
        "Account created successfully! Please check your email for verification if required."
      );
      // onAuthStateChange will handle navigation
    } catch (error: any) {
      toast.error(error.message || "Registration failed.");
      console.error("Sign-up error:", error);
    } finally {
      setOperationLoading(false);
    }
  };

  const signOut = async () => {
    setOperationLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out.");
    } finally {
      setOperationLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setOperationLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // Ensure this route exists for password update
      });
      if (error) throw error;
      toast.success("Password reset instructions sent to your email.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset instructions.");
    } finally {
      setOperationLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setOperationLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast.success("Password updated successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password.");
    } finally {
      setOperationLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading: initialLoading || operationLoading,
        isAuthenticated: !!session?.user,
        token,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
