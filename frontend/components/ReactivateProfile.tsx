"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, User, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const baseUrl = process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
  : process.env.NEXT_PUBLIC_PRODUCTION_URL;
    
export default function ReactivateProfile() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

    const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReactivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(`${baseUrl}/api/reactivate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password:formData.password
          }),
        
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        setStatus("success");
          setMessage("Profile successfully restored. Redirecting...");
          router.push('/login')
      } else {
        setStatus("error");
        setMessage(data.message || "Invalid credentials or account not found.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Connection error. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#001E2B] p-4 font-sans">
      <div className="w-full max-w-md bg-[#023447] rounded-lg border border-[#093244] shadow-2xl p-8">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#00684A] p-3 rounded-full mb-4 shadow-inner">
            <ShieldCheck className="text-[#00ED64]" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reactivate Profile</h1>
          <p className="text-slate-400 text-sm mt-2 text-center">
            Enter your credentials to restore your soft-deleted account.
          </p>
        </div>

        <form onSubmit={handleReactivate} className="space-y-6">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#00ED64] uppercase tracking-widest ml-1">
              Username
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#00ED64]">
                <User size={18} />
              </div>
              <input
                type="text"
                name="email"
                required
                className="block w-full pl-10 pr-3 py-3 bg-[#001E2B] border border-[#093244] rounded-md text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#00ED64] focus:border-[#00ED64] transition-all"
                placeholder="user@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#00ED64] uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#00ED64]">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                required
                className="block w-full pl-10 pr-3 py-3 bg-[#001E2B] border border-[#093244] rounded-md text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#00ED64] focus:border-[#00ED64] transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Status Messages */}
          {status === "error" && (
            <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded border border-red-900/50 text-sm animate-shake">
              <AlertCircle size={16} />
              <span>{message}</span>
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center gap-2 text-[#00ED64] bg-[#00ED64]/10 p-3 rounded border border-[#00ED64]/30 text-sm animate-pulse">
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full flex items-center justify-center gap-2 bg-[#00ED64] hover:bg-[#00c553] text-[#001E2B] font-bold py-3 rounded-md shadow-[0_4px_0_0_#00684A] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Restoring Document...</span>
              </>
            ) : (
              <>
                <RefreshCw size={20} />
                <span>Restore Profile</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-[10px] text-slate-500 font-mono tracking-widest">
          SYSTEM_STATUS: {status.toUpperCase()} // AUTH_GATEWAY: ACTIVE
        </p>
      </div>
    </div>
  );
}