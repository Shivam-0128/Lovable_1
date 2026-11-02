export function formatDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Last 7 days including today, newest first, as YYYY-MM-DD. */
export function lastSevenDays(today: Date = new Date()): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    return formatDay(d);
  });
}

export function daysDone(days: string[]): number {
  return new Set(days).size;
}

/** Consecutive completed days counting back from the most recent completed day. */
export function currentStreak(days: string[]): number {
  const sorted = [...new Set(days)].sort().reverse();
  if (sorted.length === 0) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const [y, m, d] = sorted[i - 1].split("-").map(Number);
    const expected = formatDay(new Date(y, m - 1, d - 1));
    if (sorted[i] === expected) streak++;
    else break;
  }
  return streak;
}
