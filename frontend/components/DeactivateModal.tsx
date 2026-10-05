'use client';
import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, LogOut, Loader2 } from 'lucide-react';

interface DeactivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Optional: callback to redirect user or show success notification in parent
  onSuccess?: () => void;
}

const baseUrl = process.env.NODE_ENV === 'development'
  ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
  : process.env.NEXT_PUBLIC_PRODUCTION_URL;

const DeactivationModal = ({ isOpen, onClose, onSuccess }: DeactivationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeactivate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/api/company/profile/deactivate`, {
        method: 'PUT', // Usually PATCH for status changes
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Failed to deactivate account");
      }

      // If successful
      if (onSuccess) onSuccess();
      onClose();
      
      // Optional: Redirect to login or landing page
      window.location.href = '/login'; 
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#001e2b]/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-red-100">
        
        {/* Warning Header */}
        <div className="bg-red-50 p-8 flex flex-col items-center text-center">
          <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-[#001e2b] tracking-tight">
            Deactivate Account?
          </h2>
          <p className="text-[10px] text-red-600 font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <ShieldAlert size={12} /> Final Confirmation Required
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-4">
          <p className="text-sm text-gray-500 leading-relaxed text-center">
            Are you absolutely sure? This will disable your company profile and 
            <span className="font-bold text-[#001e2b]"> terminate all active room listings </span> 
            immediately.
          </p>

          {error && (
            <div className="p-3 bg-red-100 border border-red-200 rounded-xl text-red-700 text-xs font-bold text-center animate-pulse">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-8 pt-0 flex flex-col gap-3">
          <button
            onClick={handleDeactivate}
            disabled={loading}
            className="w-full py-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-600 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <><LogOut size={16}/> Deactivate Now</>
            )}
          </button>
          
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all disabled:opacity-30"
          >
            Cancel & Keep Account
          </button>
        </div>

        {/* Close Icon (Hidden during loading for safety) */}
        {!loading && (
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-red-300 hover:text-red-500 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default DeactivationModal;