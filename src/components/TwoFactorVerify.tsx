import React, { useState } from "react";
import { twoFactorApi } from "../api/twoFactor";
import toast from "react-hot-toast";
import { AlertCircle } from "lucide-react";

interface TwoFactorVerifyProps {
  onVerify: (token: string) => Promise<void>;
  onUseRecoveryCode: () => void;
}

const TwoFactorVerify: React.FC<TwoFactorVerifyProps> = ({
  onVerify,
  onUseRecoveryCode,
}) => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!token || token.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      await onVerify(token);
    } catch (error) {
      toast.error("Invalid verification code");
      console.error("Error verifying 2FA:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800">
          Two-Factor Authentication
        </h3>
        <p className="mt-2 text-sm text-blue-600">
          Please enter the 6-digit verification code from your authenticator
          app.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="token"
          className="block text-sm font-medium text-gray-700"
        >
          Verification Code
        </label>
        <input
          id="token"
          type="text"
          maxLength={6}
          value={token}
          onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 6-digit code"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        onClick={handleVerify}
        disabled={isLoading || token.length !== 6}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      <button
        onClick={onUseRecoveryCode}
        className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Use a recovery code instead
      </button>
    </div>
  );
};

export default TwoFactorVerify;
