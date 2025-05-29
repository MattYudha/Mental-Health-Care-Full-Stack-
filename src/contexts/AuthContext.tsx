// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean; // True saat sesi awal sedang dimuat ATAU operasi auth sedang berjalan
  isAuthenticated: boolean;
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
  const [initialLoading, setInitialLoading] = useState(true); // Untuk pemuatan sesi awal
  const [operationLoading, setOperationLoading] = useState(false); // Untuk operasi login/signup/dll.
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setInitialLoading(false);
    };

    fetchInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setInitialLoading(false); // Sesi telah diperbarui atau dikonfirmasi

      if (_event === "SIGNED_IN") {
        navigate("/dashboard");
      } else if (_event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Email dan password harus diisi.");
      return;
    }
    setOperationLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Navigasi akan ditangani oleh onAuthStateChange
    } catch (error: any) {
      toast.error(
        error.message || "Gagal masuk. Periksa kembali kredensial Anda."
      );
      console.error("Sign-in error:", error);
    } finally {
      setOperationLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!email || !password || !fullName) {
      toast.error("Semua field wajib diisi untuk pendaftaran.");
      return;
    }
    setOperationLoading(true);
    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName, // Penting untuk trigger Supabase
          },
          emailRedirectTo: `${window.location.origin}/dashboard`, // Atau halaman konfirmasi
        },
      });

      if (signUpError) throw signUpError;

      if (data.user || data.session) {
        // Jika Supabase mengembalikan user atau sesi (tergantung konfigurasi)
        toast.success(
          "Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi jika diperlukan."
        );
        if (!data.session) {
          // Jika tidak langsung login (perlu verifikasi email)
          navigate("/login");
        }
        // Jika ada sesi, onAuthStateChange akan menangani navigasi ke dashboard
      } else {
        // Biasanya ini berarti verifikasi email diperlukan
        toast.info(
          "Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi."
        );
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal mendaftar.");
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
      // State user dan session akan di-clear oleh onAuthStateChange
      // Navigasi ke /login juga akan ditangani oleh onAuthStateChange
    } catch (error: any) {
      toast.error(error.message || "Gagal keluar.");
    } finally {
      setOperationLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setOperationLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Instruksi reset password telah dikirim ke email Anda.");
    } catch (error: any) {
      toast.error(error.message || "Gagal mengirim instruksi reset.");
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
      toast.success("Password berhasil diperbarui.");
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui password.");
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
