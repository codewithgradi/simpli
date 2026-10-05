'use client';
import React, { useEffect, useState } from "react";
import { Clock, Users, History, Activity } from 'lucide-react';

interface StatsState {
  totalCheckins: number;
  recentCheckins: number;
  avgStayTime: string;
}

export default function StatCards() {
  const [stats, setStats] = useState<StatsState>({
    totalCheckins: 0,
    recentCheckins: 0,
    avgStayTime: "0h 0m",
  });
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        setLoading(true);
        // Fetch all analytics in parallel
        const [totalRes, recentRes, stayRes] = await Promise.all([
          fetch(`${baseUrl}/api/stats/total`, { credentials: 'include' }),
          fetch(`${baseUrl}/api/stats/recent-five-hours`, { credentials: 'include' }),
          fetch(`${baseUrl}/api/stats/average-stay`, { credentials: 'include' })
        ]);

        const totalData = totalRes.ok ? await totalRes.json() : { count: 0 };
        const recentData = recentRes.ok ? await recentRes.json() : { count: 0 };
        const stayData = stayRes.ok ? await stayRes.json() : { formattedStayTime: "0h 0m" };

        setStats({
          totalCheckins: totalData.count || 0,
          recentCheckins: recentData.count || 0,
          avgStayTime: stayData.formattedStayTime || "0h 0m",
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, [baseUrl]);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-lg" />)}
    </div>;
  }

  const cards = [
    { label: 'Total Check-ins', value: stats.totalCheckins.toLocaleString(), icon: <Users size={16}/>, color: 'text-blue-600' },
    { label: 'Recent (Last 5h)', value: stats.recentCheckins.toString(), icon: <Activity size={16}/>, color: 'text-[#00ed64]' },
    { label: 'Avg. Stay Time', value: stats.avgStayTime, icon: <Clock size={16}/>, color: 'text-orange-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((stat, i) => (
        <div key={i} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm hover:border-[#00ed64] transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <span className={stat.color}>{stat.icon}</span>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-[#001e2b]">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}