import React, { useState, useEffect } from "react";
import { Lock, Shield, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { authApi } from "../api/auth";
import {
  changePasswordSchema,
  ChangePasswordInput,
} from "../schemas/authSchemas";
import Section from "./ui/Section";
import Input from "./ui/Input";
import Button from "./ui/Button";

const PrivacySecuritySettings: React.FC = () => {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    fetchTwoFactorStatus();
  }, []);

  const fetchTwoFactorStatus = async () => {
    try {
      const { isEnabled } = await authApi.getTwoFactorStatus();
      setIsTwoFactorEnabled(isEnabled);
    } catch (error) {
      console.error("Error fetching 2FA status:", error);
      toast.error("Failed to fetch 2FA status");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      await authApi.changePassword(data);
      toast.success("Password updated successfully");
      setShowPasswordForm(false);
      reset();
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to update password");
    }
  };

  const handleEnable2FA = () => {
    // TODO: Implement 2FA setup flow
    toast.error("2FA setup not implemented yet");
  };

  const handleDisable2FA = () => {
    // TODO: Implement 2FA disable flow
    toast.error("2FA disable not implemented yet");
  };

  if (isLoading) {
    return (
      <Section title="Privacy & Security">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Section>
    );
  }

  return (
    <div className="space-y-6">
      <Section
        title="Password"
        description="Update your password to keep your account secure"
      >
        {!showPasswordForm ? (
          <Button
            onClick={() => setShowPasswordForm(true)}
            leftIcon={<Lock className="h-4 w-4" />}
          >
            Change Password
          </Button>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              {...register("currentPassword")}
              error={errors.currentPassword?.message}
              fullWidth
            />
            <Input
              label="New Password"
              type="password"
              {...register("newPassword")}
              error={errors.newPassword?.message}
              fullWidth
            />
            <div className="flex space-x-4">
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Update Password
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowPasswordForm(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Section>

      <Section
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-gray-100 rounded-full">
              <Shield className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                Two-Factor Authentication
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {isTwoFactorEnabled
                  ? "Two-factor authentication is currently enabled for your account."
                  : "Add an extra layer of security to your account by enabling two-factor authentication."}
              </p>
            </div>
          </div>

          {isTwoFactorEnabled ? (
            <div className="mt-4">
              <Button
                variant="danger"
                onClick={handleDisable2FA}
                leftIcon={<AlertCircle className="h-4 w-4" />}
              >
                Disable Two-Factor Authentication
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <Button
                onClick={handleEnable2FA}
                leftIcon={<Shield className="h-4 w-4" />}
              >
                Enable Two-Factor Authentication
              </Button>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};

export default PrivacySecuritySettings;
