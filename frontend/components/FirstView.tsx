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
  Calendar,
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
      <div className="min-h-[420px] flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200/80 shadow-sm">
        <Loader2 className="animate-spin text-emerald-500 mb-3" size={32} />
        <p className="text-xs font-semibold text-slate-600">
          Fetching live metrics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[420px] flex flex-col items-center justify-center bg-white rounded-xl border border-rose-200/80 p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3 border border-rose-100">
          <AlertCircle size={22} />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">
          Unable to synchronize dashboard
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
          {error}
        </p>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-500 rounded-lg transition-all shadow-sm disabled:opacity-50"
        >
          <RotateCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 antialiased">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Analytics & Operations Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry on guest traffic and property capacity.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60 w-fit">
          <Calendar size={14} className="text-slate-400" />
          <span>Today</span>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Visitors Today */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Today Visitors
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/60">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {data?.totalVisitorsToday ?? 0}
            </span>
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              Live
            </span>
          </div>
        </div>

        {/* Active Now */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active Now
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/60">
              <Activity size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {data?.activeVisitorsNow ?? 0}
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        </div>

        {/* Total Rooms */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Rooms
            </span>
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg border border-slate-200/60">
              <DoorOpen size={16} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {data?.totalRooms ?? 0}
            </span>
          </div>
        </div>

        {/* Occupied */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Occupied
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100/60">
              <Building2 size={16} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-600 tracking-tight">
              {data?.occupiedRooms ?? 0}
            </span>
          </div>
        </div>

        {/* Available */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Available
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/60">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600 tracking-tight">
              {data?.availableRooms ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. VISITOR TREND CHART */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={18} />
              <h3 className="font-semibold text-slate-900 text-sm">
                7-Day Traffic Analysis
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Daily Visitors
            </span>
          </div>

          {/* BAR CONTAINER */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100 relative">
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
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative"
                >
                  {/* Tooltip badge */}
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 shadow-xs border border-slate-200">
                    {trend.visitorCount}
                  </span>

                  {/* Bar element */}
                  <div
                    style={{ height: `${Math.max(heightPercent, 8)}%` }}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t-md transition-all duration-200"
                  />

                  <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap mt-2">
                    {trend.dateLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. DEMOGRAPHICS GRAPH */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="text-emerald-500" size={18} />
            <h3 className="font-semibold text-slate-900 text-sm">
              Demographics
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
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{item.gender}</span>
                    <span className="text-slate-500 font-mono">
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        i % 2 === 0 ? "bg-emerald-500" : "bg-slate-700"
                      }`}
                    />
                  </div>
                </div>
              );
            })}

            {(!data?.genderDistribution ||
              data.genderDistribution.length === 0) && (
              <p className="text-xs text-slate-400 text-center py-8">
                No demographic metrics recorded
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center font-mono">
            Aggregate visitor logs
          </div>
        </div>

        {/* 3. REASON BREAKDOWN */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 p-6 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="text-emerald-500" size={18} />
            <h3 className="font-semibold text-slate-900 text-sm">
              Visit Purpose Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {data?.visitsByReason?.map((reason, i) => (
              <div
                key={i}
                className="bg-slate-50/60 border border-slate-200/60 p-4 rounded-xl flex flex-col justify-between hover:bg-slate-50 transition-colors"
              >
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {reason.reason}
                </span>
                <div className="flex items-baseline justify-between mt-3">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {reason.count}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100/80 px-2 py-0.5 rounded">
                    Visits
                  </span>
                </div>
              </div>
            ))}

            {(!data?.visitsByReason || data.visitsByReason.length === 0) && (
              <p className="text-xs text-slate-400 col-span-full text-center py-6">
                No breakdown data available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
