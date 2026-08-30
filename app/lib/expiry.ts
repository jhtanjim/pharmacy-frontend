export type ExpiryGroup = 'expired' | 'expiring_30' | 'expiring_90' | 'safe';

const startOfUtcDay = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

/** Whole days until expiry, floored to midnight UTC on both sides — mirrors the backend's classify(). */
export function daysUntilExpiry(expiryDate: string | Date, now: Date) {
  return Math.round((startOfUtcDay(new Date(expiryDate)) - startOfUtcDay(now)) / 86400000);
}

export function classifyExpiry(expiryDate: string | Date, now: Date): ExpiryGroup {
  const daysLeft = daysUntilExpiry(expiryDate, now);
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 30) return 'expiring_30';
  if (daysLeft <= 90) return 'expiring_90';
  return 'safe';
}

/** "Expired 16 days ago" / "Expires today" / "19 days left". */
export function expiryPhrase(expiryDate: string | Date, now: Date) {
  const daysLeft = daysUntilExpiry(expiryDate, now);
  if (daysLeft < 0) return `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} ago`;
  if (daysLeft === 0) return 'Expires today';
  return `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`;
}

export function formatExpiryDate(expiryDate: string | Date) {
  return new Date(expiryDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Short form for narrow rows — drops the year, which the phrase already implies. */
export function formatExpiryDateShort(expiryDate: string | Date) {
  return new Date(expiryDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });
}
