"use client";

import { useState } from "react";
import { Plus, UserCheck, QrCode, ArrowRight } from "lucide-react";
import Link from "next/link";
import CreateRoomModal from "./CreateRoomModal";
import AddVisitorModal from "./ManualAddVisitor";

export function QuickActionsView() {
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Action 1: Create Room */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-[#00ed64] transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 border border-emerald-100 group-hover:bg-[#00ed64] group-hover:text-[#001e2b] transition-colors">
              <Plus size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Create New Room
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Add a new room or standard space to the active property registry.
            </p>
          </div>
          <button
            onClick={() => setIsRoomModalOpen(true)}
            className="mt-6 w-full py-2.5 px-4 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-[#001e2b] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>Add Room</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Action 2: Check-In Visitor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-[#00ed64] transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 border border-emerald-100 group-hover:bg-[#00ed64] group-hover:text-[#001e2b] transition-colors">
              <UserCheck size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Manual Visitor Check-In
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Register an incoming guest or walk-in visitor directly into the
              system.
            </p>
          </div>
          <button
            onClick={() => setIsVisitorModalOpen(true)}
            className="mt-6 w-full py-2.5 px-4 bg-[#00ed64] text-[#001e2b] hover:bg-[#00c654] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Check In Guest</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Action 3: Guard View Scanner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-[#00ed64] transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 border border-emerald-100 group-hover:bg-[#00ed64] group-hover:text-[#001e2b] transition-colors">
              <QrCode size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Guard Scanner Terminal
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Launch the live optical scanner console to verify guest access
              codes.
            </p>
          </div>
          <Link
            href="/console/scan"
            className="mt-6 w-full py-2.5 px-4 bg-[#001e2b] text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-center"
          >
            <span>Launch Scanner</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Trigger Modals */}
      <CreateRoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
      />
      <AddVisitorModal
        isOpen={isVisitorModalOpen}
        onClose={() => setIsVisitorModalOpen(false)}
      />
    </div>
  );
}
