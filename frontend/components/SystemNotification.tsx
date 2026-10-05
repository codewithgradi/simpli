'use client';

import { UserCheck, Clock, X, BellRing, Trash2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Notification {
  id: string;
  visitorName: string;
  time: string;
  isRead: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const baseUrl = process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;

const NotificationSidebar = ({ isOpen, onClose }: Props) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/notification`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        method: 'GET',
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const result = await res.json();
      const actualData = result.data || result;
      setNotifications(Array.isArray(actualData) ? actualData : []);
    } catch (error) {
      console.error("Notification fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  // Handler for "Mark all as read" -> api/notification/
  const handleMarkAllRead = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/notification`, {
        method: 'PUT', // or PATCH depending on your backend
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAll = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/notification`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (res.ok) {
        // Optimistic UI update
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-[#001e2b]/40 backdrop-blur-sm z-9998 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      <div 
        className={`fixed top-0 right-0 h-screen w-full max-w-md bg-white shadow-2xl z-9999 transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 bg-[#001e2b] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00ed64] rounded-lg">
              <BellRing className="text-[#001e2b] w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-none">Activity Feed</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-bold">System Notifications</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div key={ Math.random()} className="flex-1 overflow-y-auto bg-white relative">
          {loading ? (
             <div key={Math.random()} className="flex flex-col items-center justify-center h-full text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#00ed64] mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Loading Feed...</p>
             </div>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={Math.random()} 
                className={`p-5 border-b border-gray-50 flex gap-4 hover:bg-gray-50 transition-colors relative ${!notif.isRead ? 'bg-[#00ed64]/5' : ''}`}
              >
                {!notif.isRead && (
                  <div key={Math.random()} className="absolute left-0 top-0 bottom-0 w-1 bg-[#00ed64]" />
                )}
                
                <div className="shrink-0 p-2.5 bg-gray-50 border border-gray-200 rounded-xl h-fit">
                  <UserCheck size={20} className="text-[#00684a]" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-[#001e2b]">
                      {notif.visitorName}
                    </p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight flex items-center gap-1">
                      <Clock size={10} /> {notif.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Successfully completed check-in at the front desk.
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div key={Math.random()} className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
              <BellRing size={48} className="opacity-10" />
              <p className="text-sm font-medium">Your feed is empty</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
          <button 
            disabled={actionLoading || notifications.length === 0}
            onClick={handleClearAll}
            className="flex-1 bg-white border border-gray-200 text-[#001e2b] text-xs font-bold py-3 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
             <Trash2 size={14} /> Clear All
          </button>
          <button 
            disabled={actionLoading || notifications.length === 0}
            onClick={handleMarkAllRead}
            className="flex-1 bg-[#00ed64] text-[#001e2b] text-xs font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-[#00ed64]/20 transition-all disabled:opacity-50"
          >
             {actionLoading ? "Processing..." : "Mark all as read"}
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationSidebar;