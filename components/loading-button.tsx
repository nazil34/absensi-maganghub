type LoadingButtonProps = {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  idleLabel: string;
  loadingLabel: string;
};

export function LoadingButton({
  loading,
  disabled,
  onClick,
  idleLabel,
  loadingLabel,
}: LoadingButtonProps) {
  const canSubmit = !disabled && !loading;

  return (
    <button
      type="button"
      disabled={!canSubmit}
      onClick={onClick}
      style={{ height: "48px" }}
      className={`mt-6 w-full rounded-lg text-[15px] font-medium transition-colors focus:outline-none ${
        canSubmit
          ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
          : "cursor-not-allowed bg-[#EAECF0] text-[#98A2B3]"
      }`}
    >
      {loading ? loadingLabel : idleLabel}
    </button>
  );
}