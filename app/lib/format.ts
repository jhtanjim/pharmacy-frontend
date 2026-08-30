const taka = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

/** "৳1,240" — whole taka, thousands separated. */
export function formatTaka(amount: number) {
  return `৳${taka.format(Math.round(amount))}`;
}
