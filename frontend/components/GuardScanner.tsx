"use client";

import { CheckOut } from "@/services/visitorService";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function ScannerComponent({ onResult }: { onResult: (data: CheckOut) => void }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 20,
      qrbox: { width: 480, height: 480 },
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true,
    }, false);

    scanner.render(
      (decodedText : any) => {
        onResult(decodedText);
      },
      () => {  }
    );

    return () => {
      scanner.clear().catch((error) => console.error("Scanner cleanup failed", error));
    };
  }, [onResult]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-950">
      <div id="reader" className="w-full" />
    </div>
  );
}