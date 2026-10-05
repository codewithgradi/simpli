import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'positive' | 'negative';
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  // Auto-close after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isPositive = type === 'positive';

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-in slide-in-from-top duration-300">
      <div 
        className={`pointer-events-auto flex items-center w-full max-w-sm p-4 rounded-xl shadow-lg border ${
          isPositive 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}
      >
        {/* Icon */}
        <div className={`shrink-0 p-2 rounded-full ${isPositive ? 'bg-green-200' : 'bg-red-200'}`}>
          {isPositive ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Message */}
        <div className="ml-3 font-medium text-sm">
          {message}
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="ml-auto p-1 hover:bg-black/5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}