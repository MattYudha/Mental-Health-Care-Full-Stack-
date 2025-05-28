import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, PasswordFormData } from "../schemas/passwordSchema";
import { authApi } from "../api/auth";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface PasswordChangeFormProps {
  onClose: () => void;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    const savingToast = toast.loading("Updating password...");
    try {
      await authApi.changePassword(data);
      toast.success("Password updated successfully! Please log in again.", {
        id: savingToast,
      });
      reset();
      onClose();
      // Log out the user and redirect to login
      logout();
      navigate("/login");
    } catch (error) {
      toast.error("Failed to update password", { id: savingToast });
      console.error("Error updating password:", error);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Current Password
        </label>
        <div className="relative mt-1">
          <input
            id="currentPassword"
            type={showPassword.current ? "text" : "password"}
            {...register("currentPassword")}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              errors.currentPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-indigo-500"
            }`}
            aria-invalid="false"
            aria-describedby={
              errors.currentPassword ? "current-password-error" : undefined
            }
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("current")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
          >
            {showPassword.current ? "Hide" : "Show"}
          </button>
        </div>
        {errors.currentPassword && (
          <p id="current-password-error" className="mt-1 text-sm text-red-500">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <div className="relative mt-1">
          <input
            id="newPassword"
            type={showPassword.new ? "text" : "password"}
            {...register("newPassword")}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              errors.newPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-indigo-500"
            }`}
            aria-invalid="false"
            aria-describedby={
              errors.newPassword ? "new-password-error" : undefined
            }
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("new")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
          >
            {showPassword.new ? "Hide" : "Show"}
          </button>
        </div>
        {errors.newPassword && (
          <p id="new-password-error" className="mt-1 text-sm text-red-500">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm New Password
        </label>
        <div className="relative mt-1">
          <input
            id="confirmPassword"
            type={showPassword.confirm ? "text" : "password"}
            {...register("confirmPassword")}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-indigo-500"
            }`}
            aria-invalid="false"
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("confirm")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
          >
            {showPassword.confirm ? "Hide" : "Show"}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirm-password-error" className="mt-1 text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;
