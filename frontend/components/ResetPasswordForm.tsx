"use client";
import React, { useState, useEffect } from "react";
import { useAuthService } from "../hooks/useAuthService";
import { ResetPassword } from "../services/authService";
import NotificationToast from "./NotificationLogoutToast";
import { useRouter } from "next/navigation";
interface ResetPasswordProps {
  onSuccess?: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordProps> = ({
  onSuccess,
}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);

  const { resetPassword, loading } = useAuthService();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlEmail = queryParams.get("email");
    const urlToken = queryParams.get("token");

    if (urlEmail) setEmail(urlEmail);
    if (urlToken) setResetCode(urlToken);
  }, []);

  // Bulletproof extractor that strips JSON formatting/brackets
  const getCleanErrorMessage = (err: any): string => {
    if (!err) return "An unexpected error occurred";

    let rawMessage = "";

    if (typeof err === "string") {
      rawMessage = err;
    } else if (err.response?.data?.message) {
      rawMessage = err.response.data.message;
    } else if (err.data?.message) {
      rawMessage = err.data.message;
    } else if (err.message) {
      rawMessage = err.message;
    } else {
      rawMessage = JSON.stringify(err);
    }

    // If rawMessage is a JSON string like {"message":"..."} or '{...}', parse it
    if (typeof rawMessage === "string") {
      try {
        const parsed = JSON.parse(rawMessage);
        if (parsed && typeof parsed === "object") {
          return parsed.message || parsed.error || JSON.stringify(parsed);
        }
      } catch {
        // Not JSON, continue with string cleanup
      }

      // Strip unwanted JSON artifacts if any remain (e.g., {"message":"..."} text remnants)
      return rawMessage
        .replace(/^[{"'\s]+|[}\"'\s]+$/g, "")
        .replace(/^message\s*:\s*/i, "")
        .replace(/^["']|["']$/g, "");
    }

    return "Failed to reset password";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToastError(null);
    setSuccessMessage(null);

    if (newPassword !== confirmedPassword) {
      setToastError("Confirmed password does not match new password");
      return;
    }

    const payload: ResetPassword = {
      email,
      newPassword,
      confirmedPassword,
      resetCode: Number(resetCode),
    };

    try {
      const res = await resetPassword(payload);
      if (res !== null) {
        setSuccessMessage("Password has been successfully updated...redirecting to login page.");
        if (onSuccess) onSuccess();
        setTimeout(() => {
          router.push("/login");
        }, 500);
      }
    } catch (err: any) {
      const cleanMessage = getCleanErrorMessage(err);
      setToastError(cleanMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative">
      {toastError && (
        <NotificationToast
          message={toastError}
          type="negative"
          onClose={() => setToastError(null)}
        />
      )}
      {successMessage && (
        <NotificationToast
          message={successMessage}
          type="positive"
          onClose={() => setSuccessMessage(null)}
        />
      )}

      <div className="max-w-md w-full bg-white border border-gray-100 shadow-xl shadow-emerald-900/5 rounded-2xl p-8">
        <div className="text-center mb-8">
          
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Set New Password
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Please enter the code sent to your email and your new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              Reset Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              required
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              placeholder="123456"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all shadow-sm shadow-emerald-600/20 disabled:opacity-50 text-sm mt-2"
          >
            {loading ? "Updating Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};
