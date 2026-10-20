"use client";

import { X, Hotel, Save, Loader2 } from "lucide-react";
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
      await createRoom(payload);

      triggerNotify("Room created successfully", "positive");

      // Clear form data
      setForm({ roomNumber: "", floor: "", status: RoomStatus.Available });

      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      let finalMsg = err.message || "Failed to create room";

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
        className="fixed inset-0 bg-[#001e2b]/60 backdrop-blur-sm z-[9998] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[9999] px-4 animate-in zoom-in-95 fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
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
          <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/80">
                <Hotel size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Add New Room
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Configure space in property registry
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form className="p-6 space-y-4 bg-white" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Room Number <span className="text-red-500">*</span>
                </label>
                <input
                  onChange={handleForm}
                  name="roomNumber"
                  value={form.roomNumber}
                  type="text"
                  placeholder="e.g. 101"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:border-[#00ed64] focus:ring-2 focus:ring-[#00ed64]/20 outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Floor <span className="text-red-500">*</span>
                </label>
                <input
                  onChange={handleForm}
                  name="floor"
                  value={form.floor}
                  type="number"
                  placeholder="e.g. 1"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:border-[#00ed64] focus:ring-2 focus:ring-[#00ed64]/20 outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Initial Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleForm}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-800 font-medium outline-none focus:border-[#00ed64] focus:ring-2 focus:ring-[#00ed64]/20 transition-all cursor-pointer"
              >
                <option value={RoomStatus.Available}>Available</option>
                <option value={RoomStatus.Occupied}>Occupied</option>
                <option value={RoomStatus.Maintenance}>Maintenance</option>
              </select>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold bg-[#00ed64] text-[#001e2b] rounded-xl hover:bg-[#00c654] transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Room</span>
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
