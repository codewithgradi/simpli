"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { QRCodeSVG } from "qrcode.react";

interface CheckInResponseData {
  id?: number | string;
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  phoneNumber?: string;
  email?: string;
  reasonForVisit?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status?: string;
  createdAt?: string;
  gender?: string;
  passCode?: string;
  companyId?: number | string;
  roomId?: number | string;
}

interface SuccessScreenProps {
  data?: CheckInResponseData;
}

export default function SuccessScreen({ data }: SuccessScreenProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Visitor-Pass-${data?.passCode || "Receipt"}`,
  });

  const formattedDate = data?.checkInTime
    ? new Date(data.checkInTime).toLocaleString()
    : new Date().toLocaleString();

  // QR code payload containing roomId and passcode for scanning
  const qrValue = JSON.stringify({
    roomId: data?.roomId || "",
    passCode: data?.passCode || "",
    companyId: data?.companyId || "",
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50 p-6 overflow-y-auto">
      <div className="flex flex-col items-center w-full max-w-sm my-auto">
        {/* Animated Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm print:hidden">
          <svg
            className="w-8 h-8 text-green-600 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Screen Header */}
        <h2 className="text-2xl font-bold text-gray-900 text-center print:hidden">
          Enjoy your stay 😀
        </h2>
        <p className="text-gray-500 mt-1 mb-6 text-center text-sm print:hidden">
          Your registration has been successfully processed.
        </p>

        {/* Printable Receipt Card */}
        <div
          ref={receiptRef}
          className="w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6 text-left space-y-5 print:shadow-none print:border-none print:mb-0"
        >
          <div className="text-center border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Visitor Pass</h3>
            <p className="text-xs text-gray-400">Official Check-In Receipt</p>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center py-2 bg-gray-50 rounded-xl border border-gray-100 p-4">
            <QRCodeSVG
              value={qrValue}
              size={330}
              level="H"
              includeMargin={false}
            />
            {/* <span className="mt-3 text-xs font-mono font-bold text-gray-700 tracking-wider">
              PASSCODE: {data?.passCode || "N/A"}
            </span> */}
          </div>

          {/* Receipt Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium text-xs uppercase">
                First Name
              </span>
              <span className="font-semibold text-gray-900">
                {data?.firstName || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium text-xs uppercase">
                Full Name
              </span>
              <span className="font-semibold text-gray-900">
                {data?.lastName
                  ? `${data.firstName} ${data.lastName}`
                  : data?.firstName || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium text-xs uppercase">
                Reason for Visit
              </span>
              <span className="font-semibold text-gray-900">
                {data?.reasonForVisit || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium text-xs uppercase">
                Room ID
              </span>
              <span className="font-semibold text-gray-900">
                {data?.roomId ?? "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-400 font-medium text-xs uppercase pt-0.5">
                Check-In Time
              </span>
              <span className="font-semibold text-gray-900 text-right">
                {formattedDate}
              </span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-4 text-center">
            <p className="text-xs text-gray-400">Powered by Simpli Solutions</p>
          </div>
        </div>

        {/* Print Button */}
        <div className="w-full print:hidden">
          <button
            onClick={() => handlePrint()}
            className="w-full bg-[#001e2b] text-[#00ed64] font-bold py-3.5 px-4 rounded-xl shadow-md hover:scale-[1.02] transition-all text-sm flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print / Save PDF Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
