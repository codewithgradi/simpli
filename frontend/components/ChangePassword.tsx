'use client';
import React, { useEffect, useState } from "react";
import Notification from "./Notification";
import { BusinessData } from "./UpdateProfileComponent";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<BusinessData | null>(null);
  const [form, setForm] = useState<PasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showNotification, setShowNotification] = useState<{
    show: boolean, msg: string, type: 'positive' | 'negative'
  }>({
    show: false,
    msg: '',
    type: 'positive'
  });

   const baseUrl = process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;

  useEffect(() => {
    if (isOpen) {
      const getCompany = async () => {
        try {
          const res = await fetch(`${baseUrl}/api/company/profile/`, {
            headers: { 'Content-Type': 'application/json' }, 
            credentials: 'include'
          });
          const result = await res.json();
          const actualData = result.data || result
          console.log(actualData)
          setCompany(actualData);
        } catch (err) {
          console.error("Error fetching company:", err);
        }
      };
      getCompany();
    }
  }, [isOpen, baseUrl]);

  if (!isOpen) return null;

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const triggerNotification = (msg: string, type: 'positive' | 'negative') => {
    setShowNotification({ show: true, msg, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1. Extract the ID safely (check both _id and id)
        const idToSubmit = company?._id || company?.id;

    if (!idToSubmit) {
      return triggerNotification("Company profile not loaded. Please refresh.", "negative");
    }
    
    // Validation
    if (!form.oldPassword.trim()) return triggerNotification("Enter your current password", "negative");
    if (form.newPassword.length < 6) return triggerNotification("New password must be at least 6 characters", "negative");
    if (form.newPassword === form.oldPassword) return triggerNotification("New password must be different", "negative");
    if (form.newPassword !== form.confirmPassword) return triggerNotification("New passwords do not match", "negative");

    setLoading(true);

    try {
      
    const dataToSent = { 
      oldPassword: form.oldPassword, 
      newPassword: form.newPassword 
    };
      
      const res = await fetch(`${baseUrl}/api/company/profile/password`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSent) 
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update password");
      }
      
      triggerNotification("Password updated successfully", "positive");
      
      setTimeout(() => {
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        onClose();
      }, 2000);

    } catch (err: any) {
      triggerNotification(err.message, "negative");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {showNotification.show && (
        <Notification 
          message={showNotification.msg} 
          type={showNotification.type} 
          onClose={() => setShowNotification(prev => ({ ...prev, show: false }))} 
        />
      )}

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-[#001e2b] mb-2">Change Password</h2>
        <p className="text-gray-500 text-sm mb-6">Update your security credentials.</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Current Password</label>
            <input 
              type="password" 
              name="oldPassword"
              onChange={handleForm}
              value={form.oldPassword}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00684a] focus:ring-2 focus:ring-[#00684a]/20 outline-none transition-all"
            />
          </div>

          <hr className="border-gray-100" />

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">New Password</label>
            <input 
              type="password" 
              name="newPassword"
              onChange={handleForm}
              value={form.newPassword}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00684a] focus:ring-2 focus:ring-[#00684a]/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              onChange={handleForm}
              value={form.confirmPassword}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00684a] focus:ring-2 focus:ring-[#00684a]/20 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center font-bold py-3 px-4 rounded-xl mt-4 transition-all duration-200 shadow-lg ${
              loading
                ? "bg-green-400 cursor-not-allowed text-white"
                : "bg-[#00684a] hover:bg-[#00523a] text-white active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
