// src/pages/Login.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom"; // useNavigate typically handled by AuthContext after successful login
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // isLoading is now primarily managed by AuthContext's methods
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { signIn, resetPassword, loading: authLoading } = useAuth(); // Use loading state from AuthContext

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Email and password cannot be empty.");
      return;
    }
    // The signIn function in AuthContext will handle its own loading state
    // and navigation on success/toast on error.
    await signIn(email, password);
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.error("Please enter your email address for password reset.");
      return;
    }
    // The resetPassword function in AuthContext will handle its own loading state
    await resetPassword(resetEmail);
    // Optionally clear fields or change view based on resetPassword's outcome (e.g., if it doesn't throw on error)
    // setShowResetPassword(false); // This might be too soon if resetPassword is async and doesn't navigate
    // setResetEmail("");
  };

  if (showResetPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email address and we'll send you instructions to reset
              your password.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <Input
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={resetEmail}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setResetEmail(e.target.value)
              }
              placeholder="Email address"
            />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowResetPassword(false)}
                disabled={authLoading}
              >
                Back to login
              </Button>
              <Button type="submit" isLoading={authLoading}>
                Send reset instructions
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder="Email address"
          />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            placeholder="Password"
          />
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="font-medium text-teal-600 hover:text-teal-500"
                disabled={authLoading}
              >
                Forgot your password?
              </button>
            </div>
          </div>
          <div>
            <Button type="submit" className="w-full" isLoading={authLoading}>
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
