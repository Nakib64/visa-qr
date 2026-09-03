const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

/**
 * Automatically calculates the "Enter before" date by adding 150 days to the "Date of issue".
 * Supports formats like "2026 MAY 27", "2026-05-27", "2026/05/27", "27 MAY 2026", etc.
 * Returns output in official Mongolian standard format: "YYYY MMM DD" (e.g. "2026 OCT 24").
 */
export function calculateEnterBefore(issueDateStr: string): string {
  if (!issueDateStr || !issueDateStr.trim()) return '';

  const clean = issueDateStr.trim().toUpperCase();
  const parts = clean.split(/[\s\-\/\.]+/);
  let parsedDate: Date | null = null;

  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // Format: YYYY [MMM/MM] DD (e.g. 2026 MAY 27 or 2026 05 27)
      const year = parseInt(parts[0], 10);
      let month = MONTH_NAMES.indexOf(parts[1]);
      if (month === -1) {
        month = parseInt(parts[1], 10) - 1;
      }
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && month >= 0 && month <= 11 && !isNaN(day) && day >= 1 && day <= 31) {
        parsedDate = new Date(Date.UTC(year, month, day));
      }
    } else if (parts[2].length === 4) {
      // Format: DD [MMM/MM] YYYY (e.g. 27 MAY 2026)
      const year = parseInt(parts[2], 10);
      let month = MONTH_NAMES.indexOf(parts[1]);
      if (month === -1) {
        month = parseInt(parts[1], 10) - 1;
      }
      const day = parseInt(parts[0], 10);
      if (!isNaN(year) && month >= 0 && month <= 11 && !isNaN(day) && day >= 1 && day <= 31) {
        parsedDate = new Date(Date.UTC(year, month, day));
      }
    }
  }

  // Fallback to standard JavaScript Date parser if custom format parsing did not match
  if (!parsedDate || isNaN(parsedDate.getTime())) {
    const fallback = new Date(issueDateStr);
    if (!isNaN(fallback.getTime())) {
      parsedDate = fallback;
    }
  }

  if (!parsedDate || isNaN(parsedDate.getTime())) {
    return '';
  }

  // Add exactly 150 days (150 * 24 * 60 * 60 * 1000 ms)
  const expiryTime = parsedDate.getTime() + 150 * 24 * 60 * 60 * 1000;
  const expiryDate = new Date(expiryTime);

  const expYear = expiryDate.getUTCFullYear();
  const expMonth = MONTH_NAMES[expiryDate.getUTCMonth()];
  const expDay = String(expiryDate.getUTCDate()).padStart(2, '0');

  return `${expYear} ${expMonth} ${expDay}`;
}
