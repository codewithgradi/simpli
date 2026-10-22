"use client";

import React, { useState } from "react";
import { useDeviceType } from "@/hooks/useDeviceType";

export default function UnsupportedDeviceModal() {
  const { deviceType, isClient } = useDeviceType();
  const [dismissed, setDismissed] = useState(false);

  if (
    !isClient ||
    dismissed ||
    (deviceType !== "mobile" && deviceType !== "tablet")
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all duration-200">
      <div className="bg-white border border-slate-100 w-full max-w-sm rounded-2xl shadow-xl p-6 flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-11 h-11 rounded-full bg-[#00ed64]/10 border border-[#00ed64]/30 flex items-center justify-center text-[#00a843]">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Text Content */}
        <div className="space-y-1.5">
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">
            Desktop Optimized View
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-[260px] mx-auto">
            This platform is optimized for larger screens. Browsing on a{" "}
            <span className="text-[#00a843] font-medium capitalize">
              {deviceType}
            </span>{" "}
            may cause visual misalignments.
          </p>
        </div>

        {/* Actions */}
        <button
          onClick={() => setDismissed(true)}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-3 rounded-xl transition-all active:scale-[0.98] shadow-sm hover:shadow-md"
        >
          Continue Anyway
        </button>
      </div>
    </div>
  );
}
