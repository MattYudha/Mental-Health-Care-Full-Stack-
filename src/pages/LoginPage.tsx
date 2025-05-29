import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
    } catch (error) {
      // Error is already handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(resetEmail);
      setShowResetPassword(false);
      setResetEmail("");
    } catch (error) {
      // Error is already handled in AuthContext
    } finally {
      setIsLoading(false);
    }
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
            <div className="rounded-md shadow-sm -space-y-px">
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
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowResetPassword(false)}
              >
                Back to login
              </Button>
              <Button type="submit" isLoading={isLoading}>
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
          <div className="rounded-md shadow-sm -space-y-px">
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
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
