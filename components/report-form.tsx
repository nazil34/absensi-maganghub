import { ReportTextarea } from "./report-textarea";

type ReportFormProps = {
  activity: string;
  learning: string;
  obstacle: string;
  activityError?: string;
  onChangeActivity: (value: string) => void;
  onChangeLearning: (value: string) => void;
  onChangeObstacle: (value: string) => void;
};

export function ReportForm({
  activity,
  learning,
  obstacle,
  activityError,
  onChangeActivity,
  onChangeLearning,
  onChangeObstacle,
}: ReportFormProps) {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <label className="mb-1.5 block text-[15px] font-medium text-[#344054]">
          Kegiatan hari ini
        </label>
        <ReportTextarea
          value={activity}
          onChange={(e) => onChangeActivity(e.target.value)}
          rows={4}
          hasError={!!activityError}
          placeholder="mis. ikut rapat pemetaan KI, bantu rekap peserta, dokumentasi"
        />
        {activityError && (
          <p className="mt-1.5 text-[14px] text-red-600">{activityError}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-[15px] font-medium text-[#344054]">
          Pembelajaran <span className="text-[14px] text-[#98A2B3]">(opsional)</span>
        </label>
        <ReportTextarea
          value={learning}
          onChange={(e) => onChangeLearning(e.target.value)}
          rows={2}
          placeholder="mis. belajar alur pelaksanaan rapat"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[15px] font-medium text-[#344054]">
          Kendala <span className="text-[14px] text-[#98A2B3]">(opsional)</span>
        </label>
        <ReportTextarea
          value={obstacle}
          onChange={(e) => onChangeObstacle(e.target.value)}
          rows={2}
          placeholder="mis. tidak ada"
        />
      </div>
    </div>
  );
}