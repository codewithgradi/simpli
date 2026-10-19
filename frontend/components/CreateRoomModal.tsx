"use client";
import { X, Hotel, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import Notification from "./Notification";
import { useRoom } from "@/hooks/useRoom";
import { useCompany } from "@/hooks/useCompany";
import { PostRoom, RoomStatus } from "@/services/roomService";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateRoomModal = ({ isOpen, onClose, onSuccess }: ModalProps) => {
  const [profileId, setProfileId] = useState<string | null>(null);

  // Consume custom hooks
  const { createRoom, loading } = useRoom();
  const { getCompany, error: companyError } = useCompany();

  useEffect(() => {
    if (!isOpen) return;

    const fetchCompanyProfile = async () => {
      const result = await getCompany();
      if (result) {
        const actualData = (result as any).data || result;
        const id = actualData.id || actualData._id;
        setProfileId(id || null);
      } else if (companyError) {
        console.error(
          "Error fetching company profile in Room Modal:",
          companyError,
        );
      }
    };

    fetchCompanyProfile();
  }, [isOpen]);

  const [showNotification, setShowNotification] = useState<{
    show: boolean;
    msg: string;
    type: "positive" | "negative";
  }>({ show: false, msg: "", type: "positive" });

  // Form states matching your types
  const [form, setForm] = useState({
    roomNumber: "",
    floor: "",
    status: RoomStatus.Available,
  });

  const handleForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "status" ? Number(value) : value,
    }));
  };

  const triggerNotify = (msg: string, type: "positive" | "negative") => {
    setShowNotification({ show: true, msg, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.roomNumber.trim())
      return triggerNotify("Room number is required", "negative");
    if (!form.floor.trim())
      return triggerNotify("Floor number is required", "negative");
    if (!profileId)
      return triggerNotify("Company profile not loaded", "negative");

    // Construct the payload matching PostRoom interface
    const payload: PostRoom = {
      roomNumber: form.roomNumber.trim(),
      floor: Number(form.floor),
    };

    try {
      const res = await createRoom(payload);

      // If the service/hook returns null or throws an error
      // if (!res) {
      //   throw new Error("Failed to create room");
      // }

      // Success notification
      triggerNotify("Room created successfully", "positive");

      // Clear form data immediately so it's ready for a new entry
      setForm({ roomNumber: "", floor: "", status: RoomStatus.Available });

      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      let finalMsg = err.message || "Failed to create room";

      // Extract only the 'detail' string if error message contains JSON
      try {
        if (typeof finalMsg === "string" && finalMsg.includes("detail")) {
          const parsed = JSON.parse(finalMsg);
          if (parsed.detail) finalMsg = parsed.detail;
        }
      } catch (e) {
        const match = finalMsg.match(/"detail"\s*:\s*"([^"]+)"/);
        if (match && match[1]) {
          finalMsg = match[1];
        }
      }

      triggerNotify(finalMsg, "negative");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#001e2b]/60 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[9999] px-4 animate-in zoom-in-95 fade-in duration-200">
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

          {/* Header */}
          <div className="bg-[#001e2b] p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#00ed64] rounded-lg">
                <Hotel className="text-[#001e2b] w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-none">Add New Room</h3>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-1">
                  Property Management
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

          {/* Form */}
          <form className="p-8 space-y-5 bg-white" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  Room Number
                </label>
                <input
                  onChange={handleForm}
                  name="roomNumber"
                  value={form.roomNumber}
                  type="text"
                  placeholder="e.g. 101"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#00ed64] focus:ring-1 focus:ring-[#00ed64] outline-none text-sm transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  Floor
                </label>
                <input
                  onChange={handleForm}
                  name="floor"
                  value={form.floor}
                  type="number"
                  placeholder="e.g. 1"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#00ed64] focus:ring-1 focus:ring-[#00ed64] outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                Initial Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleForm}
                className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-sm outline-none focus:border-[#00ed64]"
              >
                <option value={RoomStatus.Available}>Available</option>
                <option value={RoomStatus.Occupied}>Occupied</option>
                <option value={RoomStatus.Maintenance}>Maintenance</option>
              </select>
            </div>

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
                disabled={loading}
                className="px-6 py-2 text-sm font-bold bg-[#00ed64] text-[#001e2b] rounded hover:bg-[#00c654] transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <Save size={18} /> Save Room
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

export default CreateRoomModal;
