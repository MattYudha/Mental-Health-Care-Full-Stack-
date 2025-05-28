import React, { useState } from "react";
import { twoFactorApi } from "../api/twoFactor";
import toast from "react-hot-toast";
import { Shield, ShieldOff, AlertCircle } from "lucide-react";
import TwoFactorSetup from "./TwoFactorSetup";

interface TwoFactorSettingsProps {
  isEnabled: boolean;
  onStatusChange: (enabled: boolean) => void;
}

const TwoFactorSettings: React.FC<TwoFactorSettingsProps> = ({
  isEnabled,
  onStatusChange,
}) => {
  const [showSetup, setShowSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDisable = async () => {
    if (
      !window.confirm(
        "Are you sure you want to disable two-factor authentication? This will make your account less secure."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await twoFactorApi.disable();
      onStatusChange(false);
      toast.success("Two-factor authentication has been disabled");
    } catch (error) {
      toast.error("Failed to disable two-factor authentication");
      console.error("Error disabling 2FA:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showSetup) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Set Up Two-Factor Authentication
          </h3>
          <button
            onClick={() => setShowSetup(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
        <TwoFactorSetup
          onSetupComplete={() => {
            setShowSetup(false);
            onStatusChange(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isEnabled ? (
            <Shield className="h-6 w-6 text-green-500" />
          ) : (
            <ShieldOff className="h-6 w-6 text-gray-400" />
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-500">
              {isEnabled
                ? "Two-factor authentication is enabled for your account"
                : "Add an extra layer of security to your account"}
            </p>
          </div>
        </div>
        {isEnabled ? (
          <button
            onClick={handleDisable}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Disabling..." : "Disable"}
          </button>
        ) : (
          <button
            onClick={() => setShowSetup(true)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enable
          </button>
        )}
      </div>

      {!isEnabled && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">
                Security Recommendation
              </h4>
              <p className="mt-2 text-sm text-yellow-700">
                Enable two-factor authentication to add an extra layer of
                security to your account. You'll need to enter a verification
                code from your authenticator app each time you log in.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSettings;
