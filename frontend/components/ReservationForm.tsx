"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Notification from "./NotificationLogoutToast";
import SuccessScreen from "./SuccesScreen";
import { useVisitor } from "@/hooks/useVisitor";
import { useRoom } from "@/hooks/useRoom";
import { RoomStatus } from "@/services/roomService";
import { CheckIn, Gender, ReasonForVisit } from "@/services/visitorService";

interface ReservationFormProps {
  onSuccess: (id: string) => void;
}

enum RoomType {
  Suite = "Suite",
  Standard = "Standard",
  Conference = "Conference",
}

interface Room {
  _id?: string;
  id?: string | number;
  ID?: string | number;
  companyId?: string | number;
  roomNumber: string;
  floor: string | number;
  type: RoomType;
  status: RoomStatus | string;
  numberOfTimesBooked?: number;
}

export default function ReservationForm({ onSuccess }: ReservationFormProps) {
  const searchParams = useSearchParams();
  const bid = searchParams.get("bid");

  const { checkin, loading: hookLoading, error: hookError } = useVisitor();
  const { getRooms, error: roomError } = useRoom();

  const [form, setForm] = useState<CheckIn>({
    firstName: "",
    lastName: "",
    companyId: "",
    phoneNumber: "",
    idNumber: "",
    gender: Gender.Male,
    reasonForVisit: ReasonForVisit.Personal,
    roomNumber: "",
    email: "",
  });

  // Skip toggles
  const [skipPhone, setSkipPhone] = useState(false);
  const [skipEmail, setSkipEmail] = useState(false);
  const [skipId, setSkipId] = useState(false);

  const [showNotification, setShowNotification] = useState<{
    show: boolean;
    msg: string;
    type: "positive" | "negative";
  }>({ show: false, msg: "", type: "positive" });

  const [isSubmitted, setSubmitted] = useState(false);
  const [checkInResponse, setCheckInResponse] = useState<any>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    const fetchRoomsData = async () => {
      if (!bid) {
        setShowNotification({
          msg: "Business ID missing from URL",
          show: true,
          type: "negative",
        });
        return;
      }

      setLoadingRooms(true);
      try {
        const result = await getRooms(bid);

        if (roomError) {
          setShowNotification({
            msg: roomError || "Could not get rooms",
            show: true,
            type: "negative",
          });
          return;
        }

        if (result) {
          const actualData: Room[] = Array.isArray(result)
            ? result
            : (result as any).data || (result as any).rooms || [];

          // Case-insensitive filter for available rooms
          const availableOnly = actualData.filter((room) => {
            const statusStr = String(room.status).toLowerCase();
            return statusStr === "available" || statusStr === "0";
          });

          setRooms(availableOnly);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setShowNotification({
          msg: "Server error fetching rooms",
          show: true,
          type: "negative",
        });
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRoomsData();
  }, [bid]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let validationErrors: Partial<Record<keyof typeof form, string>> = {};

    if (!bid) {
      setShowNotification({
        show: true,
        msg: "Invalid QR Code. Business ID missing.",
        type: "negative",
      });
      return;
    }

    if (!form.firstName.trim())
      validationErrors.firstName = "First name is required";
    if (!form.lastName.trim())
      validationErrors.lastName = "Last name is required";
    if (!form.roomNumber.trim())
      validationErrors.roomNumber = "Please select a room";

    if (!skipPhone) {
      if (!form.phoneNumber.trim()) {
        validationErrors.phoneNumber = "WhatsApp number is required";
      } else if (form.phoneNumber.length !== 10) {
        validationErrors.phoneNumber = "Phone number must be 10 digits";
      }
    }

    if (!skipEmail) {
      if (!form.email.trim()) {
        validationErrors.email = "Email is required";
      }
    }

    if (!skipId) {
      if (!form.idNumber.trim()) {
        validationErrors.idNumber = "ID number is required";
      } else if (form.idNumber.length !== 13) {
        validationErrors.idNumber = "ID number must be 13 digits";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setShowNotification({
        show: true,
        msg: Object.values(validationErrors)[0] as string,
        type: "negative",
      });
      return;
    }

    // Safely extract room id handling multiple casing variants
    const selectedRoom = rooms.find((r) => r.roomNumber === form.roomNumber);
    const roomId =
      selectedRoom?.id?.toString() ||
      selectedRoom?.ID?.toString() ||
      selectedRoom?._id?.toString() ||
      "";

    if (!roomId) {
      setShowNotification({
        show: true,
        msg: "Please select a valid room.",
        type: "negative",
      });
      return;
    }

    const finalPayload = {
      ...form,
      phoneNumber: skipPhone ? "0000000000" : form.phoneNumber,
      email: skipEmail ? "simpli.solutions.sys@gmail.com" : form.email,
      idNumber: skipId ? "0000000000000" : form.idNumber,
      companyId: bid,
    };

    try {
      const res = await checkin(finalPayload, roomId);

      if (hookError || !res) {
        throw new Error(hookError || "Check-in failed");
      }

      setShowNotification({
        show: true,
        msg: "Check-in successful!",
        type: "positive",
      });

      const responseData = (res as any).data || res;
      setCheckInResponse(responseData);
      setSubmitted(true);

      const passCode = responseData.passCode;
      if (passCode && onSuccess) {
        onSuccess(passCode);
      }
    } catch (error: any) {
      setShowNotification({
        show: true,
        msg: error.message || "System error. Try again.",
        type: "negative",
      });
    }
  };

  return (
    <>
      {showNotification.show && (
        <Notification
          message={showNotification.msg}
          type={showNotification.type}
          onClose={() =>
            setShowNotification((prev) => ({ ...prev, show: false }))
          }
        />
      )}

      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
        {isSubmitted ? (
          <SuccessScreen data={checkInResponse} />
        ) : (
          <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Hi there, 😀</h1>
              <p className="text-sm text-gray-500">
                Please fill in your details to check in.
              </p>
              {!bid && (
                <p className="text-xs text-red-500 font-bold mt-2">
                  ⚠️ Warning: No Business ID detected.
                </p>
              )}
            </header>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                    First Name
                  </label>
                  <input
                    value={form.firstName}
                    onChange={handleChange}
                    name="firstName"
                    type="text"
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00ed64] outline-none text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                    Last Name
                  </label>
                  <input
                    value={form.lastName}
                    onChange={handleChange}
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00ed64] outline-none text-sm text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none text-sm text-gray-900"
                >
                  <option value={Gender.Male}>Male</option>
                  <option value={Gender.Female}>Female</option>
                </select>
              </div>

              {/* WhatsApp Number Section */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase">
                    WhatsApp Number
                  </label>
                  <label className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skipPhone}
                      onChange={(e) => setSkipPhone(e.target.checked)}
                      className="rounded accent-[#001e2b]"
                    />
                    Skip
                  </label>
                </div>
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  name="phoneNumber"
                  disabled={skipPhone}
                  placeholder={skipPhone ? "Skipped" : "082 123 4567"}
                  className={`w-full px-4 py-3 rounded-lg border border-gray-300 outline-none text-sm text-gray-900 ${skipPhone ? "bg-gray-100 text-gray-400" : ""}`}
                />
              </div>

              {/* Email Section */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase">
                    Email
                  </label>
                  <label className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skipEmail}
                      onChange={(e) => setSkipEmail(e.target.checked)}
                      className="rounded accent-[#001e2b]"
                    />
                    Skip
                  </label>
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  name="email"
                  disabled={skipEmail}
                  placeholder={skipEmail ? "Skipped" : "testing@gmail.com"}
                  className={`w-full px-4 py-3 rounded-lg border border-gray-300 outline-none text-sm text-gray-900 ${skipEmail ? "bg-gray-100 text-gray-400" : ""}`}
                />
              </div>

              {/* ID Number Section */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase">
                    ID Number
                  </label>
                  <label className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skipId}
                      onChange={(e) => setSkipId(e.target.checked)}
                      className="rounded accent-[#001e2b]"
                    />
                    Skip
                  </label>
                </div>
                <input
                  type="text"
                  name="idNumber"
                  value={form.idNumber}
                  onChange={handleChange}
                  disabled={skipId}
                  placeholder={skipId ? "Skipped" : "South African ID"}
                  className={`w-full px-4 py-3 rounded-lg border border-gray-300 outline-none text-sm text-gray-900 ${skipId ? "bg-gray-100 text-gray-400" : ""}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Reason for Visit
                </label>
                <select
                  name="reasonForVisit"
                  value={form.reasonForVisit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none text-sm text-gray-900"
                >
                  <option value={ReasonForVisit.Personal}>Personal</option>
                  <option value={ReasonForVisit.Delivery}>Delivery</option>
                  <option value={ReasonForVisit.Meeting}>Meeting</option>
                  <option value={ReasonForVisit.Maintenance}>
                    Maintenance
                  </option>
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#00ed64] text-sm"
                >
                  <option value="" className="text-gray-500">
                    {loadingRooms ? "Loading rooms..." : "Select a room"}
                  </option>
                  {rooms.length > 0
                    ? rooms.map((room) => (
                        <option
                          key={
                            room.id?.toString() ||
                            room.ID?.toString() ||
                            room._id?.toString() ||
                            room.roomNumber
                          }
                          value={room.roomNumber}
                          className="text-gray-900"
                        >
                          Room {room.roomNumber} ({room.type})
                        </option>
                      ))
                    : !loadingRooms && (
                        <option value="" disabled>
                          No available rooms found
                        </option>
                      )}
                </select>
              </div>

              <button
                type="submit"
                disabled={hookLoading || !bid}
                className={`w-full font-bold py-4 rounded-xl mt-4 transition-all shadow-lg text-sm ${
                  hookLoading || !bid
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#001e2b] text-[#00ed64] hover:scale-[1.02]"
                }`}
              >
                {hookLoading ? "Checking in..." : "Confirm Check-in"}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
