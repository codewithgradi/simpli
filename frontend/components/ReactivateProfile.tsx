"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import NotificationToast from "@/components/NotificationLogoutToast";
import { useRouter } from "next/navigation";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;

export default function ReactivateProfile() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Toast state to manage messages and positive/negative types
  const [toast, setToast] = useState<{
    message: string;
    type: "positive" | "negative";
  } | null>(null);

  const handleReactivate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    setToast(null);

    try {
      const response = await fetch(`${baseUrl}/api/company/reactivate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Safely parse JSON or text response
      const contentType = response.headers.get("content-type");
      const data =
        contentType && contentType.includes("application/json")
          ? await response.json()
          : { message: await response.text() };

      if (response.ok) {
        setToast({
          message:
            data.message ||
            "Profile successfully restored. You can inspect the network tab.",
          type: "positive",
        });
        setTimeout(() => {
          router.push("/login");
        }, 400);
      } else {
        setToast({
          message: data.message || "Invalid credentials or account not found.",
          type: "negative",
        });
      }
    } catch (err: any) {
      setToast({
        message: err?.message || "Connection error. Please try again later.",
        type: "negative",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4 font-sans text-neutral-900">
      {/* Toast Notification */}
      {toast && (
        <NotificationToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-sm bg-white rounded-xl border border-neutral-200 shadow-sm p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">
            Reactivate Profile
          </h1>
          <p className="text-neutral-500 text-xs mt-1">
            Enter your email and password to restore your account.
          </p>
        </div>

        {/* Form container without form tags to completely prevent native refreshing */}
        <div className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-neutral-600 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
              placeholder="user@gmail.com"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-neutral-600 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleReactivate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm py-2.5 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Restoring...</span>
              </>
            ) : (
              <span>Restore Profile</span>
            )}
          </button>
        </div>

        {/* Minimal Footer Link */}
        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Remembered your password?{" "}
            <span className="underline font-medium">Log in</span>
          </a>
        </div>
      </div>
    </div>
  );
}
