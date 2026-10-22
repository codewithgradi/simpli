"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef, ReactNode } from "react";
import {
  ShieldCheck,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bot,
  QrCode,
  Send,
  LogOut,
  MapPin,
} from "lucide-react";
import Link from "next/link";

// Custom Hooks
import { useSystemService } from "@/hooks/useSystemService";
import { useChat } from "@/hooks/useChat";
import { useVisitor } from "@/hooks/useVisitor";
import { useCompany } from "@/hooks/useCompany";
import { CheckOut } from "@/services/visitorService";
import { ChatInterface } from "@/services/chatService";

const ScannerComponent = dynamic(() => import("@/components/GuardScanner"), {
  ssr: false,
});

type TabType = "scanner" | "chat";

export default function GuardExitPage() {
  const [activeTab, setActiveTab] = useState<TabType>("scanner");

  // Hooks Initialization
  const { checkout } = useVisitor();
  const { chat, loading: chatLoading } = useChat();
  const { getCompany, loading: companyLoading } = useCompany();

  // Scanner & Terminal State
  const [roomId, setRoomId] = useState("Gate-01");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [scanMessage, setScanMessage] = useState(
    "Scan visitor pass to authorize exit",
  );

  // Scanning lock ref to prevent rapid overlapping camera triggers
  const isScanningRef = useRef(false);

  // Chat & Company State
  const [companyId, setCompanyId] = useState<string | number>("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    {
      role: "assistant",
      content: "Terminal Assistant active. Ready to process security queries.",
    },
  ]);

  // Stabilize getCompany reference to prevent infinite loops
  const getCompanyRef = useRef(getCompany);
  useEffect(() => {
    getCompanyRef.current = getCompany;
  }, [getCompany]);

  // 1. Fetch Company on Mount using stable ref (Runs ONLY ONCE)
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const res = await getCompanyRef.current();
        const cid = res?.id || "";
        if (cid) {
          setCompanyId(cid);
        }
      } catch (err) {
        console.error("Could not load company details:", err);
      }
    };
    fetchCompanyData();
  }, []);

  // Helper to extract clean error string
  const getErrorMessage = (err: any, fallback: string): string => {
    if (!err) return fallback;
    if (typeof err === "string") return err;

    const message = err.message || "";
    if (message) {
      try {
        const parsed = JSON.parse(message);
        return parsed.detail || parsed.title || parsed.message || message;
      } catch {
        return message;
      }
    }

    return fallback;
  };

  // Helper to format AI response text (handles newlines, bolding, and bullet points)
  const formatMessageContent = (content: string): ReactNode => {
    if (!content) return null;
    const lines = content.split("\n");

    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();
      const isBullet = trimmed.startsWith("-") || trimmed.startsWith("*");
      const cleanText = isBullet ? trimmed.replace(/^[-*]\s*/, "") : line;

      // Parse **bold** markdown tags
      const parts = cleanText.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, partIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={partIdx} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-emerald-600 font-bold">•</span>
            <span>{renderedParts}</span>
          </div>
        );
      }

      return (
        <span key={lineIdx} className="block min-h-[0.75rem]">
          {renderedParts}
        </span>
      );
    });
  };

  // Scanner Action
  const handleScan = async (decodedText: string) => {
    if (isScanningRef.current || status === "loading" || status === "success")
      return;

    if (!roomId.trim()) {
      setStatus("error");
      setScanMessage("Room / Gate ID required");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    const cleanPassCode = decodedText.trim();
    if (!cleanPassCode) return;

    isScanningRef.current = true;
    setStatus("loading");
    setScanMessage("Verifying visitor pass...");

    try {
      const payload: CheckOut = {
        passCode: cleanPassCode,
        roomId: roomId,
      };

      await checkout(payload);

      setStatus("success");
      setScanMessage("Exit Approved: Visitor Checked Out");
    } catch (err: any) {
      setStatus("error");
      setScanMessage(getErrorMessage(err, "Pass Verification Failed"));
    } finally {
      setTimeout(() => {
        setStatus("idle");
        setScanMessage("Scan visitor pass to authorize exit");
        isScanningRef.current = false;
      }, 4000);
    }
  };

  // Chat Action
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    if (!companyId) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Fetching your company credentials... Please try again in a moment.",
        },
      ]);
      return;
    }

    const userMsg = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    const chatPayload: ChatInterface = {
      message: userMsg,
      companyId: String(companyId),
    };

    try {
      const response: any = await chat(chatPayload);

      if (response) {
        const replyText =
          typeof response === "string"
            ? response
            : response?.reply ||
              response?.Reply ||
              response?.message ||
              JSON.stringify(response);

        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: replyText },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Unable to reach security server. Please retry.",
          },
        ]);
      }
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: getErrorMessage(err, "Could not process chat request."),
        },
      ]);
    }
  };

  // Determine Online/Offline Status for Support
  const isOnline = Boolean(companyId) && !companyLoading;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-md shadow-emerald-600/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              Simply<span className="text-emerald-600">Terminal</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Exit Station Terminal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Terminal Connected
          </div>

          <Link
            href="/console"
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-[0.98]"
          >
            <LogOut size={16} />
            <span>Console</span>
          </Link>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-6 gap-6 overflow-hidden">
        {/* Navigation Sidebar */}
        <nav className="flex md:flex-col gap-2 shrink-0 w-full md:w-60 bg-white border border-slate-200 p-2.5 rounded-2xl shadow-sm">
          <button
            onClick={() => setActiveTab("scanner")}
            className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98] ${
              activeTab === "scanner"
                ? "bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <QrCode size={18} />
            <span>Pass Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98] ${
              activeTab === "chat"
                ? "bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Bot size={18} />
            <span>Guard Support</span>
          </button>
        </nav>

        {/* Content Panel */}
        <section className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col shadow-sm min-h-[520px]">
          {/* TAB 1: SCANNER - Rendered ONLY when active tab is scanner */}
          <div
            className={`flex-1 flex-col items-center justify-center max-w-lg mx-auto w-full ${activeTab === "scanner" ? "flex" : "hidden"}`}
          >
            {/* Gate / Room Configuration */}
            <div className="w-full mb-5 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                <MapPin size={16} className="text-emerald-600" />
                <span>Terminal Gate ID:</span>
              </div>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Gate ID"
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 w-36 shadow-sm"
              />
            </div>

            {/* Camera Scanner Viewport */}
            <div
              className={`relative w-full p-1.5 rounded-2xl transition-all duration-300 ${
                status === "success"
                  ? "bg-emerald-500 shadow-lg shadow-emerald-500/20"
                  : status === "error"
                    ? "bg-red-500 shadow-lg shadow-red-500/20"
                    : "bg-slate-200"
              }`}
            >
              <div className="bg-slate-900 rounded-xl overflow-hidden p-3 min-h-[280px] flex items-center justify-center">
                {activeTab === "scanner" && (
                  <ScannerComponent onResult={handleScan} />
                )}
              </div>

              {/* Status Overlay */}
              {status !== "idle" && (
                <div
                  className={`absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-md rounded-2xl p-6 transition-all ${
                    status === "success"
                      ? "bg-emerald-950/90 text-white"
                      : status === "error"
                        ? "bg-red-950/90 text-white"
                        : "bg-slate-900/90 text-white"
                  }`}
                >
                  {status === "loading" && (
                    <Loader2
                      className="animate-spin text-emerald-400 mb-3"
                      size={48}
                    />
                  )}
                  {status === "success" && (
                    <div className="bg-emerald-500 p-3 rounded-full mb-3 text-white">
                      <CheckCircle2 size={40} />
                    </div>
                  )}
                  {status === "error" && (
                    <AlertCircle className="text-red-400 mb-3" size={48} />
                  )}

                  <p className="text-lg font-bold text-center leading-snug">
                    {scanMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Guidance Footer */}
            <div className="mt-5 w-full bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3">
              <div className="bg-emerald-100 p-2.5 rounded-lg text-emerald-700 shrink-0">
                <Camera size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Scanner Ready
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  Position visitor pass QR code in front of the lens.
                </p>
              </div>
            </div>
          </div>

          {/* TAB 2: AI GUARD ASSISTANT */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col h-full">
              {/* Header Info with Online/Offline Status */}
              <div className="pb-3 mb-4 border-b border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-emerald-600" />
                  <h2 className="font-bold text-slate-800 text-sm">
                    Security Assistant
                  </h2>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      companyLoading
                        ? "bg-amber-400 animate-ping"
                        : isOnline
                          ? "bg-emerald-500"
                          : "bg-red-400"
                    }`}
                  ></span>
                  <span className="font-bold text-slate-700">
                    {companyLoading
                      ? "Connecting..."
                      : isOnline
                        ? "Online"
                        : "Offline"}
                  </span>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4 max-h-[380px]">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-emerald-600 text-white font-medium rounded-tr-none shadow-sm"
                          : "bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none space-y-1"
                      }`}
                    >
                      {msg.role === "user"
                        ? msg.content
                        : formatMessageContent(msg.content)}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 border border-slate-200 text-slate-600 p-3 rounded-xl text-xs flex items-center gap-2">
                      <Loader2
                        size={14}
                        className="animate-spin text-emerald-600"
                      />
                      Searching records...
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="flex gap-2 pt-3 border-t border-slate-200"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message or issue..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-50 shadow-md shadow-emerald-600/20"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-2.5 px-6 text-center text-xs text-slate-500 font-medium shrink-0">
        Simply Terminal • Operating Normally
      </footer>
    </main>
  );
}
