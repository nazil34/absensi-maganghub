type CharacterCounterProps = {
  count: number;
  minimum?: number;
};

export function CharacterCounter({ count, minimum = 100 }: CharacterCounterProps) {
  const ok = count >= minimum;
  return (
    <span
      className={`text-[14px] font-medium tabular-nums ${
        ok ? "text-[#12B76A]" : "text-amber-600"
      }`}
    >
      {count} karakter{!ok && ` · minimal ${minimum}`}
    </span>
  );
}