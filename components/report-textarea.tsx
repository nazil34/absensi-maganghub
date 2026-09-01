import { TextareaHTMLAttributes } from "react";

type ReportTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export function ReportTextarea({ hasError, className = "", ...props }: ReportTextareaProps) {
  return (
    <textarea
      {...props}
      className={`w-full resize-none rounded-[10px] border bg-white px-3.5 py-2.5 text-[15px] text-[#101828] placeholder:text-[#98A2B3] focus:outline-none ${
        hasError
          ? "border-red-300 focus:border-red-400"
          : "border-[#D0D5DD] focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
      } ${className}`}
    />
  );
}