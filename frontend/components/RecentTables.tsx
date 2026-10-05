'use client';
import { MoreHorizontal, Plus } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import AddVisitorModal from "./ManualAddVisitor";
import ProfileSkeleton from "./ProfileSkeleton";
import { generateThemePalette } from "@/lib/utils";

// Colors for the Pie Chart slices

export default function RecentActivityDashboard() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const COLORS = useMemo(()=>generateThemePalette(pieData.length),[pieData.length])

  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [recentRes, dailyRes, statsRes] = await Promise.all([
        fetch(`${baseUrl}/api/stats/recent-five-hours`, { credentials: 'include' }),
        fetch(`${baseUrl}/api/stats/daily-volume`, { credentials: 'include' }),
        fetch(`${baseUrl}/api/stats/room-stats`, { credentials: 'include' }),
      ]);

      const recentData = await recentRes.json();
      const dailyData = await dailyRes.json();
      const statsData = await statsRes.json();

      

      if (recentRes.ok) {
        setRecentVisitors(recentData.data || []); 
      };
      if (dailyRes.ok) setBarData(dailyData.data || []);
      if (statsRes.ok) setPieData(statsData.data || []);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchDashboardData();
}, [baseUrl]);
      

   if (loading) return <ProfileSkeleton />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Volume Bar Chart */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          <h4 className="font-bold text-sm mb-4">Weekly Volume (Mon - Wed)</h4>
          <div className="h-62.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="volume" fill="#00ed64" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Booking Pie Chart */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          <h4 className="font-bold text-sm mb-4">Bookings per Room</h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/*Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h4 className="font-bold text-sm">Recent Activity</h4>
            <p className="text-[10px] text-gray-400 uppercase mt-0.5">Visitors from the last 5 hours</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#00ed64] hover:bg-[#00c654] text-[#001e2b] px-4 py-1.5 rounded font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Plus size={14} /> Manually Add Guest
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Guest Name</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Room</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Check-In</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentVisitors.length > 0 ? (
                recentVisitors.map((row: any, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-[#001e2b]">{`${row.firstName} ${row.lastName}`}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.roomId?.roomNumber || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        row.status === 'checked-in' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <MoreHorizontal className="text-gray-400 hover:text-gray-600 cursor-pointer ml-auto" size={18} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm italic">
                    No activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddVisitorModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}