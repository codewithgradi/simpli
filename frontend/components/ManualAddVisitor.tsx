'use client';
import { X, UserPlus, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Notification from "./Notification";
import { BusinessData } from './UpdateProfileComponent';

interface Room {
  companyId: string;
  roomNumber: string;
  floor: string;
  type: string;
  status: RoomStatus;
}
enum RoomStatus{
  Available = 'Available',
  Occupied = 'Occupied',
  Maintenance='Maintenance', 
}
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const baseUrl = process.env.NODE_ENV === 'development'
  ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
  : process.env.NEXT_PUBLIC_PRODUCTION_URL;

const AddVisitorModal = ({ isOpen, onClose }: ModalProps) => {
  const [profile, setProfile] = useState<BusinessData | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    phoneNumber: '',
    gender: 'MALE',
    roomNumber: '',
    reasonForVisit: 'Meeting',
    email:''
  });

  const [showNotification, setShowNotification] = useState<{
    show: boolean, msg: string, type: 'positive' | 'negative'
  }>({ show: false, msg: '', type: 'positive' });

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [profileRes, roomsRes] = await Promise.all([
          fetch(`${baseUrl}/api/company/profile/`, { credentials: 'include' }),
          fetch(`${baseUrl}/api/rooms`, { credentials: 'include' })
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          
          const rawData = profileData.data || profileData;
          
          const finalProfile = Array.isArray(rawData) ? rawData[0] : rawData;

          setProfile(finalProfile);
        }

        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          const rawRooms = Array.isArray(roomsData.data) ? roomsData.data : roomsData
          const availableRooms = rawRooms.filter((room:Room)=>room.status !== 'Occupied')
          setRooms(availableRooms);
        }
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      }
    };

    fetchData();
  }, [isOpen]); 

  const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const triggerNotify = (msg: string, type: 'positive' | 'negative') => {
    setShowNotification({ show: true, msg, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.firstName.trim()) return triggerNotify("First name is required", "negative");
    if (!form.lastName.trim()) return triggerNotify("Last name is required", "negative");
    if (form.phoneNumber.length !== 10) return triggerNotify("Phone number must be 10 digits", "negative");
    if (!form.phoneNumber.startsWith('0')) return triggerNotify("Phone number should start with zero", "negative");
    if (!form.roomNumber) return triggerNotify("Please select a room", "negative");
    if (!form.email) return triggerNotify("Email is required", "negative");

    const idToSubmit = (profile?._id || profile?.id || rooms[0]?.companyId)?.toString();
    console.log("FINAL ID CHECK:", idToSubmit);
    if (!idToSubmit) {
      console.log("Submit blocked. Profile state:", profile, "Rooms state:", rooms);
      return triggerNotify("Company identity not loaded. Please wait...", "negative");
    }

    setLoading(true);
    try {
      const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      idNumber: form.idNumber,
      phoneNumber: form.phoneNumber,
      gender: form.gender,
      email:form.email,
      roomNumber: form.roomNumber,
      reasonForVisit: form.reasonForVisit,
      companyId: idToSubmit 
      };
      
      const res = await fetch(`${baseUrl}/api/visitor/checkin`, {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "An error occurred");
      }

      triggerNotify("Visitor checked in successfully", "positive");
      setTimeout(() => {
        setForm({ firstName: '', lastName: '', idNumber: '', email:'', phoneNumber: '', gender: 'MALE', roomNumber: '', reasonForVisit: 'Meeting' });
        onClose();
      }, 2000);

    } catch (err: any) {
      triggerNotify(err.message || "Connection refused", "negative");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#001e2b]/60 backdrop-blur-sm z-9998 transition-opacity" onClick={onClose} />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-9999 px-4 animate-in zoom-in-95 fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">

          {showNotification.show && (
            <Notification
              message={showNotification.msg}
              type={showNotification.type}
              onClose={() => setShowNotification(prev => ({ ...prev, show: false }))}
            />
          )}

          <div className="bg-[#001e2b] p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#00ed64] rounded-lg">
                <UserPlus className="text-[#001e2b] w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-none">Manual Check-In</h3>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-1">Register New Visitor</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
          </div>

          <form className="p-8 space-y-6 bg-white" onSubmit={handleSubmit}>
            {/* ... rest of your JSX fields (Name, ID, Phone, etc.) ... */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">First Name</label>
                <input onChange={handleForm} name='firstName' value={form.firstName} type="text" placeholder="John" className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#00ed64] outline-none text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Last Name</label>
                <input onChange={handleForm} name='lastName' value={form.lastName} type="text" placeholder="Doe" className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#00ed64] outline-none text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">ID / Passport</label>
                <input onChange={handleForm} name='idNumber' value={form.idNumber} type="text" className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#00ed64] outline-none text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                <input onChange={handleForm} name='phoneNumber' value={form.phoneNumber} type="tel" placeholder="0123456789" className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#00ed64] outline-none text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Email</label>
                <input onChange={handleForm} name='email' value={form.email} type="email" placeholder="test@gmail.com" className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#00ed64] outline-none text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Gender</label>
                <select name='gender' value={form.gender} onChange={handleForm} className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-sm outline-none">
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Room Number</label>
                <select 
                  name="roomNumber" 
                  value={form.roomNumber} 
                  onChange={handleForm} 
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-sm outline-none"
                >
                  <option value="">Select Room</option>
                  {rooms.map((r, index) => (
                    <option value={r.roomNumber} key={`${r.roomNumber}-${index}`}>{r.roomNumber} ({r.type})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Reason</label>
                <select onChange={handleForm} name='reasonForVisit' value={form.reasonForVisit} className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-sm outline-none">
                  {['Meeting', 'Delivery', 'Maintenance', 'Personal'].map(reason => <option key={reason} value={reason}>{reason}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded transition-colors">Cancel</button>
              <button 
              type="submit" 
              disabled={loading || (!profile && rooms.length === 0)}
              className="px-6 py-2 text-sm font-bold bg-[#00ed64] text-[#001e2b] rounded hover:bg-[#00c654] transition-all flex items-center gap-2 disabled:opacity-50 disabled:bg-gray-300"
            >
              {loading ? "Processing..." : (!profile && rooms.length === 0) ? "Loading Data..." : <><ShieldCheck size={18} /> Complete Check-In</>}
            </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddVisitorModal;