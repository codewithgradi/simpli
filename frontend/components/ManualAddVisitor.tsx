"use client";

import { X, UserPlus, ShieldCheck, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Notification from "./Notification";
import { useVisitor } from "@/hooks/useVisitor";
import { useRoom } from "@/hooks/useRoom";
import { useCompany } from "@/hooks/useCompany";
import { CheckIn, Gender, ReasonForVisit } from "@/services/visitorService";

interface Room {
  id: string | number;
  companyId: string;
  roomNumber: string;
  floor: string;
  type: string;
  status: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddVisitorModal = ({ isOpen, onClose }: ModalProps) => {
  // Hook Initialization
  const { checkin, loading: checkInLoading } = useVisitor();
  const { getRoomsPrivate, loading: roomsLoading } = useRoom();
  const { getCompany } = useCompany();

  // Local State
  const [rooms, setRooms] = useState<Room[]>([]);
  const [companyId, setCompanyId] = useState<string>("");

  const [form, setForm] = useState<CheckIn>({
    companyId: "",
    firstName: "",
    lastName: "",
    idNumber: "",
    phoneNumber: "",
    gender: Gender.Male,
    roomNumber: "",
    reasonForVisit: ReasonForVisit.Personal,
    email: "",
  });

  const [showNotification, setShowNotification] = useState<{
    show: boolean;
    msg: string;
    type: "positive" | "negative";
  }>({ show: false, msg: "", type: "positive" });

  // Fetch initial company and private rooms on open
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const compData = await getCompany();
        const foundCompanyId =
          compData?.id ;
        if (foundCompanyId) {
          setCompanyId(String(foundCompanyId));
        }

        const roomsData = await getRoomsPrivate();
        if (roomsData) {
          const rawRooms: Room[] = Array.isArray(roomsData)
            ? roomsData
            : Array.isArray((roomsData as any)?.data)
              ? (roomsData as any).data
              : [];

          const availableRooms = rawRooms.filter(
            (room: Room) => room.status !== "Occupied",
          );
          setRooms(availableRooms);
        }
      } catch (err) {
        console.error("Failed to fetch initial modal data:", err);
      }
    };

    fetchData();
  }, [isOpen]);

  const handleForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "gender" || name === "reasonForVisit") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const triggerNotify = (msg: string, type: "positive" | "negative") => {
    setShowNotification({ show: true, msg, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Required fields validation
    if (!form.firstName.trim())
      return triggerNotify("First name is required", "negative");
    if (!form.lastName.trim())
      return triggerNotify("Last name is required", "negative");
    if (!form.roomNumber)
      return triggerNotify("Please select a room", "negative");

    // Strict validation if ID number is provided (must be 13 digits)
    const trimmedId = form.idNumber.trim();
    if (trimmedId && trimmedId !== "N/A" && trimmedId.length !== 13) {
      return triggerNotify(
        "ID number must be exactly 13 digits long",
        "negative",
      );
    }

    const targetCompanyId = companyId || rooms[0]?.companyId?.toString();

    if (!targetCompanyId) {
      return triggerNotify(
        "Company identity not loaded. Please wait...",
        "negative",
      );
    }

    // Find selected room ID for the query parameter
    const selectedRoom = rooms.find((r) => r.roomNumber === form.roomNumber);
    const targetRoomId = selectedRoom
      ? String(selectedRoom.id)
      : form.roomNumber;

    // Optional fields fallback placeholders
    const payload: CheckIn = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      idNumber: trimmedId ? trimmedId : "0000000000000",
      phoneNumber: form.phoneNumber.trim()
        ? form.phoneNumber.trim()
        : "0000000000",
      email: form.email.trim() ? form.email.trim() : "simpli.solutions.sys@gmail.com",
      gender: form.gender,
      roomNumber: form.roomNumber,
      reasonForVisit: form.reasonForVisit,
      companyId: targetCompanyId,
    };

    try {
      const response = await checkin(payload, targetRoomId);

      // Check if backend returned a failure status or error message within response
      if (response && (response as any).success === false) {
        throw new Error(
          (response as any).error ||
            (response as any).message ||
            "Check-in failed",
        );
      }

      triggerNotify("Visitor checked in successfully", "positive");
      setTimeout(() => {
        setForm({
          companyId: "",
          firstName: "",
          lastName: "",
          idNumber: "",
          email: "",
          phoneNumber: "",
          gender: Gender.Male,
          roomNumber: "",
          reasonForVisit: ReasonForVisit.Personal,
        });
        onClose();
      }, 1500);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "Failed to complete check-in";
      triggerNotify(errorMessage, "negative");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-[#001e2b]/60 backdrop-blur-sm z-[9998] transition-opacity"
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[9999] px-4 animate-in zoom-in-95 fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {showNotification.show && (
            <Notification
              message={showNotification.msg}
              type={showNotification.type}
              onClose={() =>
                setShowNotification((prev) => ({ ...prev, show: false }))
              }
            />
          )}

          <div className="bg-[#001e2b] p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#00ed64] rounded-lg">
                <UserPlus className="text-[#001e2b] w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-none">
                  Manual Check-In
                </h3>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-1">
                  Register New Visitor
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form className="p-8 space-y-6 bg-white" onSubmit={handleSubmit}>
            {/* Required Names */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  onChange={handleForm}
                  name="firstName"
                  value={form.firstName}
                  type="text"
                  placeholder="John"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#00ed64] outline-none text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  onChange={handleForm}
                  name="lastName"
                  value={form.lastName}
                  type="text"
                  placeholder="Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#00ed64] outline-none text-sm"
                />
              </div>
            </div>

            {/* Optional Contact / Details */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  ID / Passport (13 digits)
                </label>
                <input
                  onChange={handleForm}
                  name="idNumber"
                  value={form.idNumber}
                  type="text"
                  maxLength={13}
                  placeholder="13 digits ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#00ed64] outline-none text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  Phone Number (Optional)
                </label>
                <input
                  onChange={handleForm}
                  name="phoneNumber"
                  value={form.phoneNumber}
                  type="tel"
                  placeholder="0000000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#00ed64] outline-none text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  Email (Optional)
                </label>
                <input
                  onChange={handleForm}
                  name="email"
                  value={form.email}
                  type="email"
                  placeholder="no-email@provided.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#00ed64] outline-none text-sm"
                />
              </div>
            </div>

            {/* Room, Gender, and Reason */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleForm}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-sm outline-none"
                >
                  <option value={Gender.Male}>Male</option>
                  <option value={Gender.Female}>Female</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  Room Number <span className="text-red-500">*</span>
                </label>
                <select
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={handleForm}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-sm outline-none"
                >
                  <option value="">
                    {roomsLoading ? "Loading Rooms..." : "Select Room"}
                  </option>
                  {rooms.map((r, index) => (
                    <option
                      value={r.roomNumber}
                      key={`${r.roomNumber}-${index}`}
                    >
                      {r.roomNumber} ({r.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  Reason
                </label>
                <select
                  onChange={handleForm}
                  name="reasonForVisit"
                  value={form.reasonForVisit}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-sm outline-none"
                >
                  <option value={ReasonForVisit.Meeting}>Meeting</option>
                  <option value={ReasonForVisit.Delivery}>Delivery</option>
                  <option value={ReasonForVisit.Maintenance}>
                    Maintenance
                  </option>
                  <option value={ReasonForVisit.Personal}>Personal</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={checkInLoading || roomsLoading}
                className="px-6 py-2 text-sm font-bold bg-[#00ed64] text-[#001e2b] rounded hover:bg-[#00c654] transition-all flex items-center gap-2 disabled:opacity-50 disabled:bg-gray-300"
              >
                {checkInLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Checking In...
                  </>
                ) : roomsLoading ? (
                  "Loading Rooms..."
                ) : (
                  <>
                    <ShieldCheck size={18} /> Complete Check-In
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddVisitorModal;
