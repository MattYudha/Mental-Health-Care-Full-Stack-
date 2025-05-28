import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { twoFactorApi } from "../api/twoFactor";
import toast from "react-hot-toast";
import { Copy, Check, AlertCircle } from "lucide-react";

interface TwoFactorSetupProps {
  onSetupComplete: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onSetupComplete }) => {
  const [step, setStep] = useState<"initial" | "qr" | "verify" | "recovery">(
    "initial"
  );
  const [secret, setSecret] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [token, setToken] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const { secret, qrCode } = await twoFactorApi.setup();
      setSecret(secret);
      setQrCode(qrCode);
      setStep("qr");
    } catch (error) {
      toast.error("Failed to setup 2FA");
      console.error("Error setting up 2FA:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!token || token.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const { recoveryCodes } = await twoFactorApi.verifyAndEnable(token);
      setRecoveryCodes(recoveryCodes || []);
      setStep("recovery");
    } catch (error) {
      toast.error("Invalid verification code");
      console.error("Error verifying 2FA:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  if (step === "initial") {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800">
            Enable Two-Factor Authentication
          </h3>
          <p className="mt-2 text-sm text-blue-600">
            Add an extra layer of security to your account by enabling
            two-factor authentication. You'll need to enter a verification code
            from your authenticator app each time you log in.
          </p>
        </div>
        <button
          onClick={handleSetup}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Setting up..." : "Enable 2FA"}
        </button>
      </div>
    );
  }

  if (step === "qr") {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800">Scan QR Code</h3>
          <p className="mt-2 text-sm text-blue-600">
            Scan this QR code with your authenticator app (like Google
            Authenticator or Authy). If you can't scan the code, you can
            manually enter the setup key below.
          </p>
        </div>

        <div className="flex justify-center">
          <QRCodeSVG value={qrCode} size={200} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Setup Key
          </label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 p-2 bg-gray-50 rounded-lg text-sm font-mono">
              {secret}
            </code>
            <button
              onClick={() => copyToClipboard(secret)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
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
          {isLoading ? "Verifying..." : "Verify and Enable"}
        </button>
      </div>
    );
  }

  if (step === "recovery") {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">
                Save Your Recovery Codes
              </h3>
              <p className="mt-2 text-sm text-yellow-700">
                These recovery codes can be used to access your account if you
                lose your authenticator device. Save them in a secure place.
                Each code can only be used once.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          {recoveryCodes.map((code, index) => (
            <div key={index} className="flex items-center justify-between">
              <code className="text-sm font-mono">{code}</code>
              <button
                onClick={() => copyToClipboard(code)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            copyToClipboard(recoveryCodes.join("\n"));
            onSetupComplete();
          }}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          I have saved these codes
        </button>
      </div>
    );
  }

  return null;
};

export default TwoFactorSetup;
