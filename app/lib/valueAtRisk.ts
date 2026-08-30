type Medicine = { unitPriceBdt: string; quantity: number; expiryDate: string; isReturned: boolean };

/**
 * Value at risk for each of the next six calendar months (this month included),
 * bucketed by the month an active item expires in. An item expiring last month
 * (already expired) is out of range and excluded — this chart is about what's
 * coming, not what's already gone.
 */
export function monthlyValueAtRisk(medicines: Medicine[], now: Date) {
  const buckets = Array.from({ length: 6 }, (_, i) => {
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1));
    return { key: `${monthStart.getUTCFullYear()}-${monthStart.getUTCMonth()}`, monthStart, value: 0 };
  });
  const byKey = new Map(buckets.map((b) => [b.key, b]));

  const todayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  for (const m of medicines) {
    if (m.isReturned) continue;
    const expiry = new Date(m.expiryDate);
    // Already expired: the header reports it separately, so counting it here
    // would double-report value the pharmacist has already lost.
    const expiryStart = Date.UTC(expiry.getUTCFullYear(), expiry.getUTCMonth(), expiry.getUTCDate());
    if (expiryStart < todayStart) continue;

    const key = `${expiry.getUTCFullYear()}-${expiry.getUTCMonth()}`;
    const bucket = byKey.get(key);
    if (!bucket) continue;
    bucket.value += Number(m.unitPriceBdt) * m.quantity;
  }

  return buckets.map((b) => ({
    label: b.monthStart.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' }),
    value: b.value,
  }));
}
