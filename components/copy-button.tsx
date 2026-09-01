"use client";

import { useState } from "react";

type CopyButtonProps = {
  getValue: () => string;
  label?: string;
};

export function CopyButton({ getValue, label = "Salin" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getValue());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Teks belum dapat disalin otomatis. Silakan pilih dan salin manual.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{ height: "32px", padding: "0 16px" }}
      className={`rounded-lg border text-[14px] font-medium transition-colors focus:outline-none ${
        copied
          ? "border-[#12B76A] text-[#12B76A]"
          : "border-[#D0D5DD] text-[#667085] hover:border-[#2563EB] hover:text-[#2563EB]"
      }`}
    >
      {copied ? "Tersalin" : label}
    </button>
  );
}