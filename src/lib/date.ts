const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

export function parseMonthYear(dateStr: string): Date {
  const parts = dateStr.replace('-', ' ').split(' ');
  return new Date(parseInt(parts[1] || '0', 10), MONTHS[parts[0]] ?? 0);
}
