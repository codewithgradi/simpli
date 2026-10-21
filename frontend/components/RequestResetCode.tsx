"use client";
import React, { useState, useEffect } from "react";
import { useAuthService } from "../hooks/useAuthService";
import { SendCode } from "../services/authService";
import NotificationToast from "./NotificationLogoutToast";
import { useRouter } from "next/navigation";

interface RequestResetCodeProps {
  onSuccess?: (email: string) => void;
}

export const RequestResetCode: React.FC<RequestResetCodeProps> = ({
  onSuccess,
}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);

  const { sendCode, loading, error } = useAuthService();

  // Bulletproof function to extract ONLY the inner string message from any nested error structure
  const getCleanErrorMessage = (err: any): string => {
    if (!err) return "An unexpected error occurred";

    if (typeof err === "string") {
      try {
        const parsed = JSON.parse(err);
        if (parsed && typeof parsed === "object")
          return getCleanErrorMessage(parsed);
      } catch {}
      return err;
    }

    if (err.message) {
      if (typeof err.message === "string") return err.message;
      if (typeof err.message === "object")
        return getCleanErrorMessage(err.message);
    }

    if (err.response?.data?.message) {
      if (typeof err.response.data.message === "string")
        return err.response.data.message;
      if (typeof err.response.data.message === "object")
        return getCleanErrorMessage(err.response.data.message);
    }

    if (err.data?.message) {
      if (typeof err.data.message === "string") return err.data.message;
    }

    if (typeof err === "object" && err !== null) {
      for (const key of Object.keys(err)) {
        if (typeof err[key] === "string") return err[key];
        if (typeof err[key] === "object" && err[key] !== null) {
          const nested = getCleanErrorMessage(err[key]);
          if (nested && nested !== "An unexpected error occurred")
            return nested;
        }
      }
    }

    return "Failed to send reset code";
  };

  useEffect(() => {
    if (error) {
      const cleanMessage = getCleanErrorMessage(error);
      setToastError(cleanMessage);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setToastError(null);

    const payload: SendCode = { email };
    const res = await sendCode(payload);

    if (res !== null && !error) {
      setSuccessMessage("Verification code has been sent to your email.");
      if (onSuccess) onSuccess(email);
      setTimeout(() => {
        router.push("/code/reset")
      }, 300);
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
            Forgot Password?
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email address and we'll send you a reset code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all shadow-sm shadow-emerald-600/20 disabled:opacity-50 text-sm"
          >
            {loading ? "Sending Code..." : "Send Reset Code"}
          </button>
        </form>
      </div>
    </div>
  );
};
