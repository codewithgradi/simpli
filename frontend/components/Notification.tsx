import React, { useState, useEffect, useCallback, useRef } from "react";

export interface PaginatedObject {
  sortOrder?: string;
  SortBy?: string;
  Page?: number;
  Size?: number;
}

interface NotificationItem {
  id: number;
  message: string;
  createdAt: string;
}

interface NotificationTableProps {
  fetchNotifications: (
    query: PaginatedObject,
  ) => Promise<
    { data: NotificationItem[]; totalCount?: number } | NotificationItem[]
  >;
}

export default function NotificationTable({
  fetchNotifications,
}: NotificationTableProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Pagination & Sorting State
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Reference for the scrollable container
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(
    async (
      currentPage: number,
      currentSize: number,
      currentSort: string,
      isNewQuery: boolean = false,
    ) => {
      if (loading) return;
      setLoading(true);

      try {
        const response = await fetchNotifications({
          Page: currentPage,
          Size: currentSize,
          sortOrder: currentSort,
          SortBy: "CreatedAt",
        });

        const actualData = Array.isArray(response)
          ? response
          : response?.data || [];

        // If fewer items are returned than requested size, we've hit the end
        if (actualData.length < currentSize) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setNotifications((prev) =>
          isNewQuery ? actualData : [...prev, ...actualData],
        );
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchNotifications, loading],
  );

  // Trigger initial load or filter/sort changes (reset to page 1)
  useEffect(() => {
    setNotifications([]);
    setPage(1);
    setHasMore(true);
    loadData(1, size, sortOrder, true);
  }, [sortOrder, size]);

  // Trigger load when page changes via infinite scroll
  useEffect(() => {
    if (page > 1) {
      loadData(page, size, sortOrder, false);
    }
  }, [page]);

  // Handle scroll event for infinite loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 20;

    if (scrollBottom && !loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // Toggle Sort Order
  const toggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 flex justify-between items-center border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-800">Notifications</h3>

        <div className="flex items-center gap-3">
          {/* Sort Button */}
          <button
            onClick={toggleSort}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            <span>
              Date:{" "}
              {sortOrder === "desc" ? "Latest to Oldest" : "Oldest to Latest"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${sortOrder === "desc" ? "" : "rotate-180"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Page Size Selector */}
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
            }}
            className="px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none shadow-sm cursor-pointer"
          >
            <option value={5}>5 per load</option>
            <option value={10}>10 per load</option>
            <option value={20}>20 per load</option>
          </select>
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div
        ref={tableContainerRef}
        onScroll={handleScroll}
        className="overflow-y-auto max-h-[400px]"
      >
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 bg-gray-50">ID</th>
              <th className="py-3 px-4 bg-gray-50">Message</th>
              <th className="py-3 px-4 bg-gray-50">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {notifications.length === 0 && loading ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-400">
                  Loading notifications...
                </td>
              </tr>
            ) : notifications.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-400">
                  No notifications found.
                </td>
              </tr>
            ) : (
              notifications.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-500 font-mono text-xs">
                    #{item.id}
                  </td>
                  <td className="py-3 px-4 text-gray-800 font-medium">
                    {item.message}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Loading Indicator at Bottom during Scroll */}
        {loading && notifications.length > 0 && (
          <div className="py-3 text-center text-xs text-gray-400 bg-gray-50/50">
            Loading more notifications...
          </div>
        )}

        {!hasMore && notifications.length > 0 && (
          <div className="py-3 text-center text-xs text-gray-400 bg-gray-50/50">
            You've reached the end of the list.
          </div>
        )}
      </div>
    </div>
  );
}
