// src/components/Dashboard.tsx (or HotelDashboard.tsx)
"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Hotel,
  ActivityIcon,
  HotelIcon,
  Settings,
  LogOut,
  Bell,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { FirstView } from "./FirstView";
import { VisitorView } from "./VisitorView";
import { ProfileView } from "./Profile";
import { SettingsView } from "./Settings";
import { QuickActionsView } from "./QuickActions";
import NotificationCenter from "./SystemNotification";
import DashboardSkeleton from "./DashboardSkeleton";
import RoomManagement from "./ViewRooms";
import { useRouter } from "next/navigation";
import { useAuthService } from "@/hooks/useAuthService";
import Cookies from "js-cookie";

export default function HotelDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [loading] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  const { logout } = useAuthService();

  const navigation = [
    { name: "Analytics", icon: LayoutDashboard, component: <FirstView /> },
    { name: "Visitor Logs", icon: Users, component: <VisitorView /> },
    { name: "Hotel Profile", icon: Hotel, component: <ProfileView /> },
    { name: "Settings", icon: Settings, component: <SettingsView /> },
    { name: "Rooms", icon: HotelIcon, component: <RoomManagement /> },
    {
      name: "Quick Action",
      icon: ActivityIcon,
      component: <QuickActionsView />,
    },
  ];

  const renderContent = () => {
    const activeItem = navigation.find((item) => item.name === activeTab);
    return activeItem ? activeItem.component : <FirstView />;
  };

  const handleLogOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    } finally {
      // Clear local storage and cookies cleanly on logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      Cookies.remove("jwt", { path: "/" });
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });

      router.push("/login");
      router.refresh();
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex h-screen bg-white font-sans text-[#001e2b]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#001e2b] flex flex-col border-r border-gray-200">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00ed64] rounded flex items-center justify-center">
            <ShieldCheck size={20} className="text-[#001e2b]" />
          </div>
          <span className="text-white font-bold tracking-tight text-xl">
            SIMPLY
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                activeTab === item.name
                  ? "bg-[#00ed64]/10 text-[#00ed64] border-l-4 border-[#00ed64]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </nav>

        {/* BOTTOM SIDEBAR ACTIONS */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
          <div className="text-[11px] text-gray-500 px-4">
            v2.4.0-production
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white z-10">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="font-bold text-[#001e2b] tracking-tight uppercase text-xs">
              {activeTab}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 text-gray-400 hover:text-[#00ed64] transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <NotificationCenter
                isOpen={showNotifs}
                onClose={() => setShowNotifs(false)}
              />
            </div>
          </div>
        </header>

        {/* COMPONENT RENDERER */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* SIGN OUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-[#001e2b]/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center border border-red-100">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#001e2b]">
                Confirm Sign Out
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to end your terminal session? You will
                need to log back in to manage visitors.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogOut}
                className="px-4 py-2 text-xs font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
