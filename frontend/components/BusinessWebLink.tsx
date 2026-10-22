"use client";

import React, { useState, useRef, useEffect } from "react";
import QRCodeSVG from "react-qr-code";
import { useReactToPrint } from "react-to-print";
import { useCompany } from "@/hooks/useCompany";

interface BusinessQRModalProps {
  businessId?: string;
  businessName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const BusinessQRModal: React.FC<BusinessQRModalProps> = ({
  businessId: propBusinessId,
  businessName: propBusinessName,
  isOpen,
  onClose,
}) => {
  const [showQR, setShowQR] = useState<boolean>(false);
  const [companyId, setCompanyId] = useState<string>(propBusinessId || "");
  const [companyName, setCompanyName] = useState<string>(
    propBusinessName || "",
  );

  const qrRef = useRef<HTMLDivElement>(null);

  // Consume useCompany hook
  const { getCompany, loading } = useCompany();

  useEffect(() => {
    if (!isOpen) return;

    const fetchCompanyInfo = async () => {
      const result = await getCompany();
      if (result) {
        const rawData = (result as any).data || result;
        const id = rawData.id || rawData._id || (result as any).user?.companyId;
        const name = rawData.companyName;

        if (id) setCompanyId(id);
        if (name) setCompanyName(name);
      }
    };

    if (!propBusinessId || !propBusinessName) {
      fetchCompanyInfo();
    }
  }, [isOpen]);

  const activeId = companyId || propBusinessId || "";
  const activeName = companyName || propBusinessName || "Official Business";

  const FRONTEND_URL =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_VECEL_URL
      : process.env.NEXT_PUBLIC_LOCAL_URL;

  const scanUrl = `${FRONTEND_URL}/visit?bid=${activeId}`;

  const handlePrint = useReactToPrint({
    contentRef: qrRef,
    documentTitle: `${activeName}_QRCode`,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-200">
      <div className="bg-[#001e2b] border border-[#00684a]/40 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Business QR Code
            </h2>
            <p className="text-xs text-[#00ed64]/80 font-medium">
              {activeName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="px-6 py-8 flex flex-col items-center justify-center min-h-[280px]">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-7 h-7 border-2 border-[#00ed64] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium text-gray-400 tracking-wide">
                Fetching details...
              </p>
            </div>
          ) : showQR ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
              <div
                className="p-5 bg-white rounded-xl shadow-lg border border-white/10"
                ref={qrRef}
              >
                {/* Print view only */}
                <div className="hidden print:block text-center mb-6">
                  <h1 className="text-2xl font-bold text-[#001e2b]">
                    {activeName}
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Official Business QR Code
                  </p>
                  <div className="w-full h-px bg-gray-200 my-4" />
                </div>

                <QRCodeSVG value={scanUrl} size={180} />

                <p className="mt-3 text-[10px] text-gray-400 text-center font-mono tracking-wider">
                  ID: {activeId}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <div className="w-14 h-14 rounded-2xl bg-[#023430] border border-[#00684a]/40 flex items-center justify-center text-[#00ed64]/70">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-200">
                  Ready to Generate
                </p>
                <p className="text-xs text-gray-400 max-w-[200px]">
                  Generate a scanable QR code for your customers.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-2 pb-6">
          {!showQR ? (
            <button
              disabled={loading || !activeId}
              onClick={() => setShowQR(true)}
              className="w-full bg-[#00ed64] hover:bg-[#00c352] text-[#001e2b] font-semibold text-sm py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              Generate QR Code
            </button>
          ) : (
            <div className="flex gap-2.5">
              <button
                onClick={() => handlePrint()}
                className="flex-1 bg-white hover:bg-gray-100 text-[#001e2b] font-semibold text-sm py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              >
                Print Code
              </button>
              <button
                onClick={() => setShowQR(false)}
                className="px-4 border border-[#00684a]/50 text-[#00ed64] hover:bg-[#00684a]/20 font-semibold text-sm rounded-xl transition-all active:scale-[0.98]"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessQRModal;
