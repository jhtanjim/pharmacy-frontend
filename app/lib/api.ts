const API_URL = 'http://localhost:3000';

export async function getActiveMedicines() {
  const res = await fetch(`${API_URL}/medicines`, { cache: 'no-store' });
  return res.json();
}

export async function getReturnedMedicines() {
  const res = await fetch(`${API_URL}/medicines/returned`, { cache: 'no-store' });
  return res.json();
}

export async function markReturned(id: string) {
  const res = await fetch(`${API_URL}/medicines/${id}/return`, { method: 'PATCH' });
  return res.json();
}