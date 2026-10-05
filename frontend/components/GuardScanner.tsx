"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function ScannerComponent({ onResult }: { onResult: (data: string) => void }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 20,
      qrbox: { width: 280, height: 280 },
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true,
    }, false);

    scanner.render(
      (decodedText) => {
        onResult(decodedText);
        // We don't clear here immediately to allow the parent to handle the "Success" state
      },
      () => { /* silent error for frame-by-frame scanning */ }
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