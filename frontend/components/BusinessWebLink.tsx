'use client'

import React, { useState, useRef } from 'react';
import  QRCodeSVG  from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';


interface BusinessQRModalProps {
  businessId: string;
  businessName: string;
  isOpen: boolean;
  onClose: () => void;
}
 const baseUrl = process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
  : process.env.NEXT_PUBLIC_PRODUCTION_URL;
        

const BusinessQRModal: React.FC<BusinessQRModalProps> = ({ 
  businessId, 
  businessName, 
  isOpen, 
  onClose 
}) => {
  const [showQR, setShowQR] = useState<boolean>(false);
  
  const qrRef = useRef<HTMLDivElement>(null);
  const scanUrl = `${process.env.NEXT_PUBLIC_VECEL_URL}/visit?bid=${businessId}`
  const handlePrint = useReactToPrint({
    contentRef: qrRef,
    documentTitle: `${businessName}_QRCode`,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#001e2b] border border-[#00684a] w-full max-w-md rounded-xl shadow-2xl overflow-hidden text-white">
        
        <div className="p-5 border-b border-[#00684a]/30 flex justify-between items-center">
          <h2 className="text-lg font-bold tracking-tight text-[#00ed64]">
            Business Asset Generator
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="p-10 flex flex-col items-center justify-center min-h-[300px] bg-[#023430]">
          {showQR ? (
            <div className="p-6 bg-white rounded-lg" ref={qrRef}>
              {/* This section only appears in the PDF Print */}
              <div className="hidden print:block text-center mb-6">
                <h1 className="text-3xl font-bold text-[#001e2b] mb-1">{businessName}</h1>
                <p className="text-gray-600 text-sm">Official Business QR Code</p>
                <div className="w-full h-px bg-gray-200 my-4" />
              </div>

              <QRCodeSVG value={scanUrl} size={220} />
              
              <p className="mt-4 text-[10px] text-gray-400 text-center font-mono">
                ID: {businessId}
              </p>
            </div>
          ) : (
            <div className="text-[#00ed64]/40 flex flex-col items-center gap-3">
              <div className="w-16 h-16 border-2 border-dashed border-[#00ed64]/30 rounded-lg flex items-center justify-center text-2xl">
                ?
              </div>
              <p className="text-sm font-medium">Ready to generate</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-[#001e2b] flex flex-col gap-3">
          {!showQR ? (
            <button
              onClick={() => setShowQR(true)}
              className="w-full bg-[#00ed64] hover:bg-[#00c352] text-[#001e2b] font-bold py-3.5 rounded-md transition-all active:scale-95"
            >
              Generate QR Code
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => handlePrint()}
                className="flex-1 bg-white hover:bg-gray-100 text-[#001e2b] font-bold py-3.5 rounded-md transition-all flex items-center justify-center gap-2"
              >
                Print QR Code
              </button>
              <button
                onClick={() => setShowQR(false)}
                className="px-6 py-3.5 border border-[#00684a] text-[#00ed64] hover:bg-[#00684a]/10 font-bold rounded-md transition-all"
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
