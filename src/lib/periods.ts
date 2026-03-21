export const PERIODS = [
  { value: "morning", label: "Morning", hour: 8 },
  { value: "noon", label: "Noon", hour: 12 },
  { value: "afternoon", label: "Afternoon", hour: 15 },
  { value: "evening", label: "Evening", hour: 18 },
  { value: "night", label: "Night", hour: 21 },
] as const;

export type PeriodValue = (typeof PERIODS)[number]["value"];

export const RATINGS = [
  { value: 1, label: "As dumb as a rock" },
  { value: 2, label: "Terrible" },
  { value: 3, label: "Fair" },
  { value: 4, label: "Great!" },
  { value: 5, label: "It is over" },
] as const;

/**
 * Build a timestamp from today's date and a period.
 * Uses midnight of today (local time) + the period's hour offset.
 */
export function periodToTimestamp(period: PeriodValue): number {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const p = PERIODS.find((p) => p.value === period)!;
  date.setHours(p.hour);
  return date.getTime();
}

/**
 * Returns which periods are available based on the current hour.
 * Users can rate all periods whose hour is <= the current hour.
 */
export function getAvailablePeriods() {
  const currentHour = new Date().getHours();
  return PERIODS.filter((p) => p.hour <= currentHour);
}

/** Returns today's date string for localStorage key */
export function getTodayKey(): string {
  const now = new Date();
  return `rated-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}
