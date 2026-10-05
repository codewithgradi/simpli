"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ShieldCheck, Camera, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const ScannerComponent = dynamic(() => import("@/components/GuardScanner"), { ssr: false });

const baseUrl = process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;

export default function GuardExitPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("Scan visitor pass to authorize exit");

  const handleScan = async (decodedText: string) => {
    if (status === "loading" || status === "success") return;
    setStatus("loading");
    setMessage("Querying Database...");

    try {
      const res = await fetch(`${baseUrl}/api/visitor/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passCode: decodedText }),
        credentials:'include',
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(`Document Updated: ${data.visitorName || "Visitor"} Exited`);
          setTimeout(() => {
        setStatus("idle");   
        setMessage("");    
      }, 4000);
      } else {
        setStatus("error");
        setMessage(data.error || "Write Error: Invalid Token");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Connection Failed");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("Scan visitor pass to authorize exit");
    }, 3500);
  };

  return (
    <main className="min-h-screen bg-[#001E2B] text-white p-6 flex flex-col items-center font-sans">
      {/* MongoDB Styled Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-10 border-b border-[#093244] pb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-[#00ED64]" size={28} />
          <div>
            <h1 className="text-xl font-medium tracking-tight">Simply<span className="text-[#00ED64] font-bold">Scanner</span></h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Exit Terminal v1.0</p>
          </div>
        </div>
        <div className="bg-[#00684A] px-3 py-1 rounded text-[10px] font-bold text-white uppercase">
          Live Connection
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className={`relative p-0.5 rounded-xl transition-all duration-300
          ${status === 'success' ? 'bg-[#00ED64]' : status === 'error' ? 'bg-red-500' : 'bg-[#093244]'}`}>
          
          <div className="bg-[#023447] rounded-[10px] overflow-hidden p-4">
            <ScannerComponent onResult={handleScan} />
          </div>

          {status !== 'idle' && (
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm transition-all rounded-[10px]
              ${status === 'success' ? 'bg-[#001E2B]/90' : status === 'error' ? 'bg-red-950/90' : 'bg-[#001E2B]/80'}`}>
              
              {status === 'loading' && <Loader2 className="animate-spin text-[#00ED64] mb-4" size={48} />}
              {status === 'success' && <div className="bg-[#00ED64] p-3 rounded-full mb-4 animate-scale-in"><CheckCircle2 className="text-[#001E2B]" size={40} /></div>}
              {status === 'error' && <AlertCircle className="text-red-500 mb-4" size={50} />}
              
              <p className={`text-lg font-bold px-8 text-center ${status === 'success' ? 'text-[#00ED64]' : 'text-white'}`}>
                {message}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 w-full max-w-md grid grid-cols-1 gap-3">
        <div className="bg-[#023447] border border-[#093244] p-4 rounded-lg flex items-center gap-4 group hover:border-[#00ED64] transition-colors">
          <div className="bg-[#001E2B] p-3 rounded border border-[#093244]">
            <Camera size={20} className="text-[#00ED64]" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Terminal Input</p>
            <p className="text-sm text-white">Awaiting QR scan from visitor device...</p>
          </div>
        </div>
      </div>
      <Link href={'/console'}
          className="bg-green-800 px-3 mt-3 py-3 rounded text-[10px] font-bold text-white uppercase hover:bg-green-900">
          Return to console
        </Link>
      
      <p className="mt-auto text-[10px] text-slate-500 font-mono tracking-widest">
        SYSTEM_STATUS: OK // CLUSTER: PRIMARY
      </p>
    </main>
  );
}
