export function normalizeText(value: string | undefined | null): string {
  if (!value) return "";
  return value.trim();
}

export function isBlank(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0;
}

export function charCount(value: string): number {
  return value.trim().length;
}