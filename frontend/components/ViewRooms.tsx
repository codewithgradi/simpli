'use client';
import React, { useEffect, useState } from 'react';
import { 
  LayoutGrid, RefreshCw, Filter, Edit3, X, 
  TrendingUp, Search, Hash, Layers, MoreVertical 
} from 'lucide-react';
import Notification from "./Notification"; 

interface Room {
  _id: string;
  roomNumber: string;
  floor: string;
  type: string;
  status: string;
  numberOfTimesBooked: number;
}

const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, msg: '', type: 'positive' as 'positive' | 'negative' });

  const baseUrl = process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/rooms`, { credentials: 'include' });
      const result = await res.json();
      const actualData = result.data || result;
      setRooms(Array.isArray(actualData) ? actualData : []);
    } catch (err: any) {
      setNotification({ show: true, msg: "Failed to load rooms", type: 'negative' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;
    setUpdateLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/rooms/${selectedRoom._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedRoom)
      });
      if (!res.ok) throw new Error("Update failed");
      setNotification({ show: true, msg: "Room updated!", type: 'positive' });
      setIsEditModalOpen(false);
      fetchRooms();
    } catch (err: any) {
      setNotification({ show: true, msg: err.message, type: 'negative' });
    } finally {
      setUpdateLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesStatus = filterStatus === 'All' || room.status === filterStatus;
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {notification.show && (
        <Notification message={notification.msg} type={notification.type} onClose={() => setNotification({ ...notification, show: false })} />
      )}

      {/* --- Updated Header to match VisitorView --- */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#001e2b]">Room Inventory</h2>
            <p className="text-sm text-gray-500">Manage and monitor facility room statuses.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
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
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>

            <button onClick={fetchRooms} className="p-2 border border-gray-300 rounded hover:bg-gray-50">
              <RefreshCw size={18} className={loading ? "animate-spin text-[#00ed64]" : "text-gray-500"} />
            </button>
          </div>
        </div>

        {/* --- Table Styled like VisitorView --- */}
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
              {filteredRooms.map((room) => (
                <tr key={room._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#001e2b]">{room.roomNumber}</div>
                    <div className="text-xs text-gray-500">Floor Level {room.floor}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-[#001e2b]">{room.numberOfTimesBooked || 0}</span>
                      <span className="text-[9px] text-gray-400 uppercase font-black">Bookings</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-gray-600 px-2 py-1 bg-gray-100 rounded text-[10px] font-medium border border-gray-200">
                      {room.type}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      room.status === 'Available' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : room.status === 'Maintenance' 
                        ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                      {room.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { setSelectedRoom({...room}); setIsEditModalOpen(true); }}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Edit3 size={16} className="text-gray-400 cursor-pointer" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal (Keeping your high-end styling for the modal as requested) */}
      {isEditModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001e2b]/80 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#001e2b] p-10 text-white flex justify-between items-center border-b-4 border-[#00ed64]">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Room Specification</h2>
                <p className="text-[#00ed64] text-[10px] font-black uppercase tracking-[0.3em] mt-2">Updating Database Record</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="hover:bg-white/10 p-2 rounded-full"><X size={24}/></button>
            </div>

            <form onSubmit={handleUpdate} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Hash size={12}/> Room Number</label>
                  <input type="text" value={selectedRoom.roomNumber} onChange={(e) => setSelectedRoom({...selectedRoom, roomNumber: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-[#00ed64] font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Layers size={12}/> Floor Level</label>
                  <input type="text" value={selectedRoom.floor} onChange={(e) => setSelectedRoom({...selectedRoom, floor: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-[#00ed64] font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Room Type</label>
                  <select value={selectedRoom.type} onChange={(e) => setSelectedRoom({...selectedRoom, type: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl font-bold outline-none appearance-none">
                    <option value="Standard">Standard</option>
                    <option value="Conference">Conference Room</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operational Status</label>
                  <select value={selectedRoom.status} onChange={(e) => setSelectedRoom({...selectedRoom, status: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl font-bold outline-none appearance-none">
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all">Discard</button>
                <button type="submit" disabled={updateLoading} className="flex-1 py-4 bg-[#001e2b] text-[#00ed64] text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50">
                  {updateLoading ? "Syncing..." : "Update System"}
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