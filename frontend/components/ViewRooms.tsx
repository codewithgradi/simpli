"use client";
import React, { useEffect, useState } from "react";
import {
  LayoutGrid,
  RefreshCw,
  Filter,
  Edit3,
  X,
  TrendingUp,
  Search,
  Hash,
  Layers,
  MoreVertical,
  Inbox,
} from "lucide-react";
import Notification from "./Notification";
import { useRoom } from "@/hooks/useRoom";
import { Room, UpdateRoom, RoomStatus } from "@/services/roomService";

const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [notification, setNotification] = useState({
    show: false,
    msg: "",
    type: "positive" as "positive" | "negative",
  });

  // Consume custom hook
  const { getRooms, updateRoom, loading, error } = useRoom();

  const fetchRoomsData = async () => {
    const result = await getRooms();
    if (result) {
      const actualData = Array.isArray(result)
        ? result
        : (result as any).data || [];
      setRooms(Array.isArray(actualData) ? actualData : []);
    } else if (error) {
      setNotification({
        show: true,
        msg: error || "Failed to load rooms",
        type: "negative",
      });
    }
  };

  useEffect(() => {
    fetchRoomsData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    // Mapping using the exact UpdateRoom interface (without id)
    const updatePayload: UpdateRoom = {
      roomNumber: selectedRoom.roomNumber,
      floor: Number(selectedRoom.floor),
      type: selectedRoom.type,
      status: Number(selectedRoom.status),
    };

    // Call updateRoom with data and id separately as configured in your hook
    await updateRoom(updatePayload, parseInt(selectedRoom.id, 10));

    if (error) {
      setNotification({ show: true, msg: error, type: "negative" });
    } else {
      setNotification({ show: true, msg: "Room updated!", type: "positive" });
      setIsEditModalOpen(false);
      fetchRoomsData();
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const roomStatusString =
      typeof room.status === "number" ? RoomStatus[room.status] : room.status;
    const matchesStatus =
      filterStatus === "All" || roomStatusString === filterStatus;
    const matchesSearch = room.roomNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get string keys of RoomStatus enum for dropdowns
  const roomStatusKeys = Object.keys(RoomStatus).filter((k) =>
    isNaN(Number(k)),
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {notification.show && (
        <Notification
          message={notification.msg}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      {/* --- Header Section --- */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#001e2b]">Room Inventory</h2>
            <p className="text-sm text-gray-500">
              Manage and monitor facility room statuses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded text-sm outline-none focus:border-[#00ed64]"
              />
            </div>

            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded text-sm outline-none focus:border-[#00ed64] bg-white cursor-pointer"
              >
                <option value="All">All Statuses</option>
                {roomStatusKeys.map((statusKey) => (
                  <option key={statusKey} value={statusKey}>
                    {statusKey}
                  </option>
                ))}
              </select>
              <Filter
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={14}
              />
            </div>

            <button
              onClick={fetchRoomsData}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <RefreshCw
                size={18}
                className={
                  loading ? "animate-spin text-[#00ed64]" : "text-gray-500"
                }
              />
            </button>
          </div>
        </div>

        {/* --- Table Section --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-widest font-bold text-gray-400">
              <tr>
                <th className="px-6 py-3">Room Details</th>
                <th className="px-6 py-3 text-center">Stats</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => {
                  const statusName =
                    typeof room.status === "number"
                      ? RoomStatus[room.status]
                      : room.status;
                  return (
                    <tr
                      key={room.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#001e2b]">
                          {room.roomNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          Floor Level {room.floor}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-[#001e2b]">
                            {room.numberTimesBooked || 0}
                          </span>
                          <span className="text-[9px] text-gray-400 uppercase font-black">
                            Bookings
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-gray-600 px-2 py-1 bg-gray-100 rounded text-[10px] font-medium border border-gray-200">
                          {room.type}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            statusName === "Available"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : statusName === "Maintenance"
                                ? "bg-orange-100 text-orange-700 border border-orange-200"
                                : "bg-gray-100 text-gray-500 border border-gray-200"
                          }`}
                        >
                          {statusName}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedRoom({ ...room });
                            setIsEditModalOpen(true);
                          }}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <Edit3
                            size={16}
                            className="text-gray-400 cursor-pointer"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <Inbox size={24} />
                      </div>
                      <p className="text-gray-600 font-semibold text-base">
                        No rooms available
                      </p>
                      <p className="text-gray-400 text-xs max-w-xs">
                        {searchQuery || filterStatus !== "All"
                          ? "No rooms match your current search or filter criteria."
                          : "There are currently no rooms registered in the system."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001e2b]/80 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#001e2b] p-10 text-white flex justify-between items-center border-b-4 border-[#00ed64]">
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  Room Specification
                </h2>
                <p className="text-[#00ed64] text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                  Updating Database Record
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="hover:bg-white/10 p-2 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Hash size={12} /> Room Number
                  </label>
                  <input
                    type="text"
                    value={selectedRoom.roomNumber}
                    onChange={(e) =>
                      setSelectedRoom({
                        ...selectedRoom,
                        roomNumber: e.target.value,
                      })
                    }
                    className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-[#00ed64] font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Layers size={12} /> Floor Level
                  </label>
                  <input
                    type="number"
                    value={selectedRoom.floor}
                    onChange={(e) =>
                      setSelectedRoom({
                        ...selectedRoom,
                        floor: Number(e.target.value),
                      })
                    }
                    className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-[#00ed64] font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Room Type
                  </label>
                  <select
                    value={selectedRoom.type}
                    onChange={(e) =>
                      setSelectedRoom({ ...selectedRoom, type: e.target.value })
                    }
                    className="w-full p-4 bg-gray-50 border rounded-2xl font-bold outline-none"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Conference">Conference Room</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Operational Status
                  </label>
                  <select
                    value={
                      typeof selectedRoom.status === "number"
                        ? selectedRoom.status
                        : RoomStatus[
                            selectedRoom.status as keyof typeof RoomStatus
                          ]
                    }
                    onChange={(e) =>
                      setSelectedRoom({
                        ...selectedRoom,
                        status: Number(e.target.value) as RoomStatus,
                      })
                    }
                    className="w-full p-4 bg-gray-50 border rounded-2xl font-bold outline-none"
                  >
                    {roomStatusKeys.map((statusKey) => {
                      const enumValue =
                        RoomStatus[statusKey as keyof typeof RoomStatus];
                      return (
                        <option key={enumValue} value={enumValue}>
                          {statusKey}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-[#001e2b] text-[#00ed64] text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {loading ? "Syncing..." : "Update System"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
