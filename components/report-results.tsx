import { ReportData } from "@/types/report";
import { ReportTextarea } from "./report-textarea";
import { CharacterCounter } from "./character-counter";
import { CopyButton } from "./copy-button";

const OUTPUT_FIELDS: { key: keyof ReportData; label: string }[] = [
  { key: "activity", label: "Uraian Aktivitas" },
  { key: "learning", label: "Pembelajaran yang Diperoleh" },
  { key: "obstacle", label: "Kendala yang Dialami" },
];

type ReportResultsProps = {
  results: ReportData;
  onChangeField: (key: keyof ReportData, value: string) => void;
  onRegenerate: () => void;
  onReset: () => void;
};

export function ReportResults({
  results,
  onChangeField,
  onRegenerate,
  onReset,
}: ReportResultsProps) {
  const copyAll = () =>
    OUTPUT_FIELDS.map((f) => `${f.label}:\n${results[f.key]}`).join("\n\n");

  return (
    <div className="mt-8 space-y-5 border-t border-[#EAECF0] pt-6">
      {OUTPUT_FIELDS.map((f) => {
        const value = results[f.key];
        return (
          <div key={f.key}>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-[15px] font-medium text-[#344054]">
                {f.label}
              </label>
              <div className="flex items-center gap-2">
                <CharacterCounter count={value.length} />
                <CopyButton getValue={() => value} />
              </div>
            </div>
            <ReportTextarea
              value={value}
              onChange={(e) => onChangeField(f.key, e.target.value)}
              rows={4}
              className="leading-relaxed"
            />
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onRegenerate}
          style={{ height: "32px", padding: "0 16px" }}
          className="rounded-lg border border-[#D0D5DD] text-[14px] font-medium text-[#667085] hover:border-[#2563EB] hover:text-[#2563EB] focus:outline-none"
        >
          Generate ulang
        </button>
        <CopyButton getValue={copyAll} label="Salin semua" />
        <button
          type="button"
          onClick={onReset}
          className="ml-auto text-[14px] font-medium text-[#98A2B3] hover:text-[#667085]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}