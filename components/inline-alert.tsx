type InlineAlertProps = {
  message: string;
  onRetry?: () => void;
};

export function InlineAlert({ message, onRetry }: InlineAlertProps) {
  return (
    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
      {message}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="ml-2 font-semibold underline underline-offset-2"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}