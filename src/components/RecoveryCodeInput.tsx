import React, { useState } from "react";
import { twoFactorApi } from "../api/twoFactor";
import toast from "react-hot-toast";
import { AlertCircle } from "lucide-react";

interface RecoveryCodeInputProps {
  onVerify: (code: string) => Promise<void>;
  onBack: () => void;
}

const RecoveryCodeInput: React.FC<RecoveryCodeInputProps> = ({
  onVerify,
  onBack,
}) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!code || code.length !== 10) {
      toast.error("Please enter a valid 10-character recovery code");
      return;
    }

    setIsLoading(true);
    try {
      await onVerify(code);
    } catch (error) {
      toast.error("Invalid recovery code");
      console.error("Error verifying recovery code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-yellow-800">
              Recovery Code
            </h3>
            <p className="mt-2 text-sm text-yellow-700">
              Enter one of your recovery codes to access your account. Each code
              can only be used once.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="recovery-code"
          className="block text-sm font-medium text-gray-700"
        >
          Recovery Code
        </label>
        <input
          id="recovery-code"
          type="text"
          maxLength={10}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter 10-character code"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
        />
      </div>

      <button
        onClick={handleVerify}
        disabled={isLoading || code.length !== 10}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Verifying..." : "Verify Recovery Code"}
      </button>

      <button
        onClick={onBack}
        className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Back to verification code
      </button>
    </div>
  );
};

export default RecoveryCodeInput;
