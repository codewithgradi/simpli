"use client";

import { useEffect, useState } from "react";
import { useAnalytics } from "@/hooks/useAnanlytics";
import { DashboardAnalyticsDto } from "@/services/analyticsService";
import {
  Users,
  Building2,
  DoorOpen,
  Activity,
  TrendingUp,
  Loader2,
  AlertCircle,
  PieChart,
  BarChart3,
  RotateCw,
} from "lucide-react";

export function FirstView() {
  const { getAnalytics, loading, error } = useAnalytics();
  const [data, setData] = useState<DashboardAnalyticsDto | null>(null);

  const fetchDashboardData = async () => {
    const res = await getAnalytics();
    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <Loader2 className="animate-spin text-[#00ed64] mb-3" size={40} />
        <p className="text-sm font-semibold text-slate-600">
          Loading analytics dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center bg-white rounded-2xl border border-red-200 p-6 text-center shadow-sm">
        <AlertCircle className="text-red-500 mb-2" size={36} />
        <h3 className="text-base font-bold text-slate-800">
          Could not load dashboard data
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">{error}</p>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-[#001e2b] bg-[#00ed64] rounded-xl hover:bg-[#00c654] transition-all shadow-md disabled:opacity-50"
        >
          <RotateCw size={14} className={loading ? "animate-spin" : ""} />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
     

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-100">
            <Users size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Today Visitors
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">
              {data?.totalVisitorsToday ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-100">
            <Activity size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Active Now
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">
              {data?.activeVisitorsNow ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-100">
            <DoorOpen size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Total Rooms
            </p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {data?.totalRooms ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl border border-amber-100">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Occupied
            </p>
            <p className="text-2xl font-black text-amber-600 mt-0.5">
              {data?.occupiedRooms ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-100">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Available
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">
              {data?.availableRooms ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Graphs Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. LINE / BAR GRAPH: 7-Day Visitor Trend */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-emerald-600" size={20} />
              <h3 className="font-bold text-slate-800 text-sm">
                Visitor Trend (Last 7 Days)
              </h3>
            </div>
          </div>

          <div className="h-60 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100">
            {data?.visitorTrends?.map((trend, i) => {
              const maxCount = Math.max(
                ...(data.visitorTrends.map((t) => t.visitorCount) || [1]),
                5,
              );
              const heightPercent = Math.round(
                (trend.visitorCount / maxCount) * 100,
              );

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                >
                  <span className="text-xs font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {trend.visitorCount}
                  </span>
                  <div
                    style={{ height: `${Math.max(heightPercent, 12)}%` }}
                    className="w-full bg-[#00ed64] group-hover:bg-[#00c654] rounded-t-lg transition-all duration-300 shadow-sm"
                  ></div>
                  <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                    {trend.dateLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. DEMOGRAPHICS GRAPH: Gender Distribution */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="text-emerald-600" size={20} />
            <h3 className="font-bold text-slate-800 text-sm">
              Gender Distribution
            </h3>
          </div>

          <div className="space-y-4 my-auto">
            {data?.genderDistribution?.map((item, i) => {
              const total =
                data.genderDistribution.reduce(
                  (acc, curr) => acc + curr.count,
                  0,
                ) || 1;
              const percentage = Math.round((item.count / total) * 100);

              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{item.gender}</span>
                    <span className="text-emerald-600">
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`h-full rounded-full ${i % 2 === 0 ? "bg-[#00ed64]" : "bg-emerald-400"}`}
                    ></div>
                  </div>
                </div>
              );
            })}
            {(!data?.genderDistribution ||
              data.genderDistribution.length === 0) && (
              <p className="text-xs text-slate-400 text-center py-10">
                No demographic data available
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] font-medium text-slate-400 text-center">
            Calculated across all registered visitors
          </div>
        </div>

        {/* 3. REASON BREAKDOWN */}
        <div className="lg:col-span-3 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="text-emerald-600" size={20} />
            <h3 className="font-bold text-slate-800 text-sm">
              Visits Breakdown by Reason
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {data?.visitsByReason?.map((reason, i) => (
              <div
                key={i}
                className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl flex flex-col justify-between"
              >
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  {reason.reason}
                </span>
                <div className="flex items-baseline justify-between mt-3">
                  <span className="text-2xl font-black text-emerald-600">
                    {reason.count}
                  </span>
                  <span className="text-xs font-bold text-[#001e2b] bg-[#00ed64] px-2 py-0.5 rounded shadow-xs">
                    Visits
                  </span>
                </div>
              </div>
            ))}
            {(!data?.visitsByReason || data.visitsByReason.length === 0) && (
              <p className="text-xs text-slate-400 col-span-full text-center py-6">
                No reason records found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
