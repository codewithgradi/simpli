"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Download,
  Clock,
  X,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";
import ProfileSkeleton from "./ProfileSkeleton";
import { NoVisitors } from "./NoVisitors";
import { useVisitor } from "@/hooks/useVisitor"; // Adjust import path if necessary

export enum VisitorStatus {
  CHECKED_IN = "checked-in",
  CHECKED_OUT = "checked-out",
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
  OTHER = "Other",
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

  // Consume hook methods and states
  const { getVisitors, loading, error } = useVisitor();

  // Pagination & Sorting States (Defaulting sortOrder to "desc" for Latest -> Oldest)
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortOrder, setSortOrder] = useState<string>("desc");

  // Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<VisitorStatus | "all">(
    "all",
  );

 const fetchVisitorsData = useCallback(async () => {
   const result = await getVisitors({
     Page: page,
     Size: size,
     sortOrder: sortOrder,
     SortBy: "checkInTime", // Explicitly tell the backend to sort by check-in time
   });

   if (result) {
     const actualData = Array.isArray(result)
       ? result
       : (result as any).data || [];
     setVisitors(Array.isArray(actualData) ? actualData : []);
   } else if (error) {
     console.error("Failed to fetch visitors:", error);
   }
 }, [page, size, sortOrder]);
  useEffect(() => {
    fetchVisitorsData();
  }, [fetchVisitorsData]);

  // Toggle Sort Order
  const toggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(1); // Reset to page 1 on sort change
  };

  // Filter Logic (Client-side filtering for search & status)
  const filteredVisitors = visitorsData.filter((visitor) => {
    const fullName = `${visitor.firstName} ${visitor.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || visitor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading && visitorsData.length === 0) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      {visitorsData.length > 0 || searchQuery ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Header & Filter Section */}
          <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#001e2b]">Visitor Logs</h2>
              <p className="text-sm text-gray-500">
                History of all physical check-ins at this location.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Name Search */}
              <div className="relative flex-1 min-w-50">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
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

              {/* Sort Order Button */}
              <button
                onClick={toggleSort}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ArrowUpDown size={14} className="text-gray-500" />
                <span>
                  Sort:{" "}
                  {sortOrder === "desc"
                    ? "Latest to Oldest"
                    : "Oldest to Latest"}
                </span>
              </button>

              {/* Page Size Selector */}
              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-[#00ed64] cursor-pointer shadow-sm"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={fetchVisitorsData}
                disabled={loading}
                title="Refresh table"
                className="p-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredVisitors.length > 0 ? (
                  filteredVisitors.map((v) => (
                    <tr
                      key={v.id || Math.random()}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#001e2b]">{`${v.firstName} ${v.lastName}`}</div>
                        <div className="text-xs text-gray-500">
                          {v.phoneNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 px-2 py-1 bg-gray-100 rounded text-[10px] font-medium">
                          {v.reasonForVisit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(v.checkInTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            v.status === VisitorStatus.CHECKED_IN
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-gray-100 text-gray-500 border border-gray-200"
                          }`}
                        >
                          {v.status ? v.status.replace("-", " ") : "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500 italic"
                    >
                      No visitors match your current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs text-gray-500">
              Current Page: <strong className="text-gray-700">{page}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || loading}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
              >
                Previous
              </button>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={visitorsData.length < size || loading}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <NoVisitors />
      )}
    </>
  );
};

export { VisitorView };
