'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from 'next/navigation'
import Notification from "./Notification";
import SuccessScreen from "./SuccesScreen";
import { ROUTER_TYPE } from "next/dist/build/utils";

interface ReservationFormProps {
  onSuccess: (id: string) => void;
}
enum RoomType{
  Suite = "Suite",
  Standard = 'Standard',
  Conference = "Conference"
}


enum RoomStatus{
  Available = "Available",
  Occupied = 'Occupied',
  Maintenance = "Maintenacne"
}
interface Room {
  _id?: string;
  id?:String,
  companyId: string;
  roomNumber: string;
  floor: string;
  type: RoomType;
  status: RoomStatus;
  numberOfTimesBooked: number;
}


const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_PRODUCTION_URL
  : process.env.NEXT_PUBLIC_DEVELOPMENT_URL;
        
export default function ReservationForm({ onSuccess }: ReservationFormProps) {
  // 1. Get companyId from URL (/visit?bid=694a64d780745aafe7436029)
  const searchParams = useSearchParams();
  const bid = searchParams.get('bid');

  const [form, setForm] = useState({
    
    firstName: '',
    lastName: '',
    phoneNumber: '',
    idNumber: '',
    gender: '',
    reasonForVisit: '',
    roomNumber:'',
    email: '', 
  })

  const [showNotification, setShowNotification] = useState<{
    show: boolean, msg: string, type: 'positive' | 'negative'
  }>({ show: false, msg: '', type: 'positive' });

  const [isSubmited, setSubmitted] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])
  
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  useEffect(() => {
  const fetchAndFilterRooms = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/front-end/rooms/${bid}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        return setShowNotification({ 
          msg: 'Could not get rooms', 
          show: true, 
          type: 'negative' 
        });
      }

      const rawData  = await res.json();
      const actualData: Room[] = rawData.data || rawData;

      const availableOnly = actualData.filter(
        (room) => room.status === RoomStatus.Available
      );

      setRooms(availableOnly);

    } catch (err) {
      console.error("Fetch error:", err);
      setShowNotification({ 
        msg: 'Server error fetching rooms', 
        show: true, 
        type: 'negative' 
      });
    }
  };

  fetchAndFilterRooms();
}, []); // Runs once on mount
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation
    let validationErrors: Partial<Record<keyof typeof form, string>> = {};

    if (!bid) {
      setShowNotification({ show: true, msg: "Invalid QR Code. Business ID missing.", type: "negative" });
      return;
    }

    if (!form.firstName.trim()) validationErrors.firstName = "First name is required";
    if (!form.lastName.trim()) validationErrors.lastName = "Last name is required";
    if (!form.email.trim()) validationErrors.lastName = "Email is required";
    if (!form.gender || form.gender === "0") validationErrors.gender = "Please select a gender";
    
    if (!form.phoneNumber.trim()) {
      validationErrors.phoneNumber = "WhatsApp number is required";
    } else if (form.phoneNumber.length !== 10) {
      validationErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!form.idNumber.trim()) {
      validationErrors.idNumber = "ID number is required";
    } else if (form.idNumber.length !== 13) {
      validationErrors.idNumber = "ID number must be 13 digits";
    }

    if (!form.reasonForVisit || form.reasonForVisit === "0") validationErrors.reasonForVisit = "Reason is required";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setShowNotification({ show: true, msg: Object.values(validationErrors)[0] as string, type: "negative" });
      return;
    }

    setLoading(true);
    try {
      

      const res = await fetch(`${baseUrl}/api/visitor/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          companyId: bid 
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Check-in failed");

      setShowNotification({ show: true, msg: "Check-in successful!", type: "positive" });
      setSubmitted(true);
      
      if (data.passCode) {
        onSuccess(data.passCode);
      }

    } catch (error: any) {
      setShowNotification({ show: true, msg: error.message || "System error. Try again.", type: "negative" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showNotification.show && (
        <Notification 
          message={showNotification.msg} 
          type={showNotification.type} 
          onClose={() => setShowNotification(prev => ({ ...prev, show: false }))} 
        />
      )}
      
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
        {isSubmited ? (
          <SuccessScreen />
        ) : (
          <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Hi there, 😀</h1>
              <p className="text-sm text-gray-500">Please fill in your details to check in.</p>
              {!bid && <p className="text-xs text-red-500 font-bold mt-2">⚠️ Warning: No Business ID detected.</p>}
            </header>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">First Name</label>
                  <input
                    value={form.firstName}
                    onChange={handleChange}
                    name="firstName"
                    type="text"
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00ed64] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Last Name</label>
                  <input
                    value={form.lastName}
                    onChange={handleChange}
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00ed64] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none"
                >
                  <option value="0">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  name="phoneNumber"
                  placeholder="082 123 4567"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  name="email"
                  placeholder="testing@gmail.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">ID Number</label>
                <input
                  type="text"
                  name="idNumber"
                  value={form.idNumber}
                  onChange={handleChange}
                  placeholder="South African ID"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Reason for Visit</label>
                <select
                  name="reasonForVisit"
                  value={form.reasonForVisit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none"
                >
                  <option value="0">Select Reason</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Personal">Personal</option>
                </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                    Room Number
                  </label>
                  <select
                    name="roomNumber"
                    value={form.roomNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#00ed64] appearance-none"
                    style={{ minHeight: '50px' }} // Ensures the box is tall enough to see text
                  >
                    <option value="" className="text-gray-500">Select a room</option>
                    {rooms.map((room) => (
                      <option 
                        key={room._id?.toString() || room.roomNumber} 
                        value={room.roomNumber}
                        className="text-gray-900"
                      >
                        Room {room.roomNumber} - {room.type}
                      </option>
                    ))}
                  </select>
                </div>
              <button
                type="submit"
                disabled={isLoading || !bid}
                className={`w-full font-bold py-4 rounded-xl mt-4 transition-all shadow-lg ${
                  isLoading || !bid ? "bg-gray-300 cursor-not-allowed" : "bg-[#001e2b] text-[#00ed64] hover:scale-[1.02]"
                }`}
              >
                {isLoading ? "Checking in..." : "Confirm Check-in"}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}