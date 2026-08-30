export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

/** A hung backend should surface the error state, not leave the UI on skeletons forever. */
const TIMEOUT_MS = 10_000;

async function request(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(TIMEOUT_MS),
    ...init,
  });
  if (!res.ok) {
    throw new Error(`${init.method ?? 'GET'} ${path} failed: ${res.status}`);
  }
  return res.json();
}

export function getActiveMedicines() {
  return request('/medicines');
}

export function getReturnedMedicines() {
  return request('/medicines/returned');
}

export function markReturned(id: string) {
  return request(`/medicines/${encodeURIComponent(id)}/return`, { method: 'PATCH' });
}

export function createMedicine(input: {
  name: string;
  company: string;
  batch: string;
  quantity: number;
  unitPriceBdt: number;
  expiryDate: string;
}) {
  return request('/medicines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}
