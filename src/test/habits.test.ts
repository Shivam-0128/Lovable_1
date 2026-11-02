import { describe, expect, it } from "vitest";
import { currentStreak, daysDone, lastSevenDays } from "@/lib/habits";

describe("habit progress", () => {
  it("lists the last seven days including today in YYYY-MM-DD", () => {
    const days = lastSevenDays(new Date(2026, 9, 20));
    expect(days).toEqual([
      "2026-10-20", "2026-10-19", "2026-10-18", "2026-10-17",
      "2026-10-16", "2026-10-15", "2026-10-14",
    ]);
  });

  it("counts days done", () => {
    expect(daysDone(["2026-10-20", "2026-10-18", "2026-10-01"])).toBe(3);
  });

  it("counts streak backwards from most recent done day", () => {
    expect(currentStreak(["2026-10-18", "2026-10-17", "2026-10-16", "2026-10-14"])).toBe(3);
    expect(currentStreak(["2026-10-20", "2026-10-18"])).toBe(1);
    expect(currentStreak([])).toBe(0);
  });

  it("streak crosses month boundaries", () => {
    expect(currentStreak(["2026-11-01", "2026-10-31", "2026-10-30"])).toBe(3);
  });
});
