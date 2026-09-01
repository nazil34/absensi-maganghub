"use client";

import { useState } from "react";
import { ReportForm } from "@/components/report-form";
import { ReportResults } from "@/components/report-results";
import { LoadingButton } from "@/components/loading-button";
import { InlineAlert } from "@/components/inline-alert";
import { GenerateReportResponse, ReportData } from "@/types/report";

type Status = "initial" | "loading" | "success" | "error";

export default function Home() {
  const [activity, setActivity] = useState("");
  const [learning, setLearning] = useState("");
  const [obstacle, setObstacle] = useState("");
  const [status, setStatus] = useState<Status>("initial");
  const [results, setResults] = useState<ReportData | null>(null);
  const [activityError, setActivityError] = useState("");

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const runGenerate = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity, learning, obstacle }),
      });
      const json: GenerateReportResponse = await res.json();

      if (!json.success) {
        setStatus("error");
        return;
      }

      setResults(json.data);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const handleSubmit = () => {
    if (!activity.trim()) {
      setActivityError("Tuliskan kegiatan hari ini terlebih dahulu.");
      return;
    }
    setActivityError("");
    runGenerate();
  };

  const handleReset = () => {
    setActivity("");
    setLearning("");
    setObstacle("");
    setResults(null);
    setStatus("initial");
    setActivityError("");
  };

  const handleChangeField = (key: keyof ReportData, value: string) => {
    setResults((r) => (r ? { ...r, [key]: value } : r));
  };

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] py-10 px-5">
      <div className="mx-auto w-full max-w-[760px]">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-[15px] font-semibold text-[#101828]">
            Absen Maganghub
          </span>
          <span className="text-[14px] text-[#98A2B3]">{today}</span>
        </div>

        <div className="rounded-[16px] border border-[#EAECF0] bg-white p-10 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          <h1 className="text-[24px] font-bold text-[#101828]">
            Buat laporan hari ini
          </h1>
          <p className="mt-1 text-[15px] font-normal text-[#667085]">
            Tulis catatan seadanya. Tidak perlu menggunakan bahasa formal.
          </p>

          <ReportForm
            activity={activity}
            learning={learning}
            obstacle={obstacle}
            activityError={activityError}
            onChangeActivity={(v) => {
              setActivity(v);
              if (activityError) setActivityError("");
            }}
            onChangeLearning={setLearning}
            onChangeObstacle={setObstacle}
          />

          <LoadingButton
            loading={status === "loading"}
            disabled={activity.trim().length === 0}
            onClick={handleSubmit}
            idleLabel="Buat Laporan"
            loadingLabel="Menyusun laporan..."
          />

          {status === "error" && (
            <InlineAlert
              message="Laporan belum berhasil dibuat. Coba lagi beberapa saat."
              onRetry={handleSubmit}
            />
          )}

          {status === "success" && results && (
            <ReportResults
              results={results}
              onChangeField={handleChangeField}
              onRegenerate={runGenerate}
              onReset={handleReset}
            />
          )}
        </div>

        <p className="mt-4 text-center text-[14px] text-[#98A2B3]">
          Isi laporan tidak disimpan oleh aplikasi.
        </p>
      </div>
    </div>
  );
}