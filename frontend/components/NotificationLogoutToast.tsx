"use client";
import React, { useEffect } from "react";

interface NotificationToastProps {
  message: string;
  type: "positive" | "negative";
  onClose: () => void;
}

export default function NotificationToast({
  message,
  type,
  onClose,
}: NotificationToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isPositive = type === "positive";

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-in slide-in-from-top duration-300">
      <div
        className={`pointer-events-auto flex items-center w-full max-w-sm p-4 rounded-xl shadow-lg border ${
          isPositive
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        <div className="ml-3 font-medium text-sm">{message}</div>
        <button
          onClick={onClose}
          className="ml-auto p-1 hover:bg-black/5 rounded-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
