'use client';
import React, { useEffect, useState } from 'react';
import { Search, Filter, MoreVertical, Download, Clock, X } from 'lucide-react';
import ProfileSkeleton from './ProfileSkeleton';
import { NoVisitors } from './NoVisitors';

export enum VisitorStatus {
  CHECKED_IN = "checked-in",
  CHECKED_OUT = "checked-out"
}

export enum VisitReason {
  MEETING = "Meeting",
  DELIVERY = "Delivery",
  PERSONAL = "Personal",
  MAINTENANCE = "Maintenance",
}

export enum VisitorGender {
  FEMALE = "FEMALE",
  MALE = "MALE",
  OTHER = "Other"
}

export interface Visitor {
  id: string; 
  firstName: string;
  lastName: string;
  phoneNumber: string;
  companyId: string;
  roomId: string;
  passCode: string;
  idNumber: string;
  gender: VisitorGender;
  room?: {
    roomNumber: string;
  };
  status: VisitorStatus;
  reasonForVisit: VisitReason;
  checkInTime: string; 
  checkOutTime?: string;
}

const VisitorView = () => {
  const [visitorsData, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<VisitorStatus | "all">("all");

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'development'
          ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
          : process.env.NEXT_PUBLIC_PRODUCTION_URL;

        const res = await fetch(`${baseUrl}/api/company`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          const fromDBVisitors = await res.json();
          const actualData = fromDBVisitors.data;
          setVisitors(Array.isArray(actualData) ? actualData : []);
        }
      } catch (err) {
        console.error("Failed to fetch visitors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisitors();
  }, []);

  // Filter Logic
  const filteredVisitors = visitorsData.filter((visitor) => {
    const fullName = `${visitor.firstName} ${visitor.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || visitor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      {visitorsData.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Header & Filter Section */}
          <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#001e2b]">Visitor Logs</h2>
              <p className="text-sm text-gray-500">History of all physical check-ins at this location.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Name Search */}
              <div className="relative flex-1 min-w-50">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name..." 
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-sm outline-none focus:border-[#00ed64] transition-all" 
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as VisitorStatus | "all")}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded text-sm outline-none focus:border-[#00ed64] bg-white cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value={VisitorStatus.CHECKED_IN}>Checked In</option>
                  <option value={VisitorStatus.CHECKED_OUT}>Checked Out</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>

              <button className="flex items-center gap-2 bg-[#00ed64] text-[#001e2b] font-bold py-2 px-4 rounded text-sm hover:bg-[#00c654] transition-colors shadow-sm">
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[11px] uppercase tracking-widest font-bold text-gray-400">
                <tr>
                  <th className="px-6 py-3">Visitor Details</th>
                  <th className="px-6 py-3">Reason</th>
                  <th className="px-6 py-3">Check-In</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredVisitors.length > 0 ? (
                  filteredVisitors.map((v) => (
                    <tr key={Math.random()} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#001e2b]">{`${v.firstName} ${v.lastName}`}</div>
                        <div className="text-xs text-gray-500">{v.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 px-2 py-1 bg-gray-100 rounded text-[10px] font-medium">
                          {v.reasonForVisit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          v.status === VisitorStatus.CHECKED_IN 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}>
                          {v.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                          <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                      No visitors match your current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <NoVisitors />
      )}
    </>
  );
};

export { VisitorView };