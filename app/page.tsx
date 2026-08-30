'use client';

import { useEffect, useState } from 'react';
import { getActiveMedicines, getReturnedMedicines, markReturned } from './lib/api';

type Medicine = {
  id: string;
  name: string;
  company: string;
  batch: string;
  quantity: number;
  unitPriceBdt: string;
  expiryDate: string;
  isReturned: boolean;
};

type DashboardData = {
  counts: { expired: number; expiring_30: number; expiring_90: number; safe: number };
  expiredValue: number;
  expiringSoonValue: number;
  groups: {
    expired: Medicine[];
    expiring_30: Medicine[];
    expiring_90: Medicine[];
    safe: Medicine[];
  };
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [returned, setReturned] = useState<Medicine[]>([]);
  const [activeTab, setActiveTab] = useState<'expired' | 'expiring_30' | 'expiring_90' | 'safe'>('expired');
  const [showReturned, setShowReturned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', company: '', batch: '', quantity: '', unitPriceBdt: '', expiryDate: '' });

  async function loadData() {
    setLoading(true);
    const [active, ret] = await Promise.all([getActiveMedicines(), getReturnedMedicines()]);
    setData(active);
    setReturned(ret);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch('http://localhost:3000/medicines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        quantity: Number(form.quantity),
        unitPriceBdt: Number(form.unitPriceBdt),
      }),
    });
    setForm({ name: '', company: '', batch: '', quantity: '', unitPriceBdt: '', expiryDate: '' });
    loadData();
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleReturn(id: string) {
    await markReturned(id);
    loadData();
  }

  if (loading || !data) {
    return <div style={{ padding: 40, fontFamily: 'sans-serif' }}>Loading dashboard...</div>;
  }

  const groupLabels: Record<string, string> = {
    expired: 'Expired',
    expiring_30: 'Expiring in 30 Days',
    expiring_90: 'Expiring in 31–90 Days',
    safe: 'Safe',
  };

  const groupColors: Record<string, string> = {
    expired: '#dc2626',
    expiring_30: '#f97316',
    expiring_90: '#eab308',
    safe: '#16a34a',
  };

  const currentList = showReturned ? returned : data.groups[activeTab];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Pharmacy Expiry Shelf Check</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Pharmacist Dashboard</p>

      {data.counts.expired > 0 && (
        <div style={{
          background: '#fee2e2', border: '1px solid #dc2626', color: '#991b1b',
          padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontWeight: 600
        }}>
          ⚠ {data.counts.expired} medicine{data.counts.expired > 1 ? 's' : ''} expired — ৳{data.expiredValue.toLocaleString()} at risk
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {(['expired', 'expiring_30', 'expiring_90', 'safe'] as const).map((key) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setShowReturned(false); }}
            style={{
              padding: 16, borderRadius: 10, border: `2px solid ${groupColors[key]}`,
              background: activeTab === key && !showReturned ? groupColors[key] : 'white',
              color: activeTab === key && !showReturned ? 'white' : groupColors[key],
              cursor: 'pointer', textAlign: 'left'
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700 }}>{data.counts[key]}</div>
            <div style={{ fontSize: 13 }}>{groupLabels[key]}</div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1, padding: 16, background: '#fef2f2', borderRadius: 8 }}>
          <div style={{ fontSize: 13, color: '#666' }}>Expired Value at Risk</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#dc2626' }}>৳{data.expiredValue.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, padding: 16, background: '#fff7ed', borderRadius: 8 }}>
          <div style={{ fontSize: 13, color: '#666' }}>Expiring Soon (30d) Value</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#f97316' }}>৳{data.expiringSoonValue.toLocaleString()}</div>
        </div>
      </div>

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{padding: 8}} />
        <input placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} required style={{padding: 8}} />
        <input placeholder="Batch" value={form.batch} onChange={e => setForm({...form, batch: e.target.value})} required style={{padding: 8}} />
        <input placeholder="Qty" type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required style={{padding: 8, width: 70}} />
        <input placeholder="Unit Price" type="number" value={form.unitPriceBdt} onChange={e => setForm({...form, unitPriceBdt: e.target.value})} required style={{padding: 8, width: 90}} />
        <input type="date" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} required style={{padding: 8}} />
        <button type="submit" style={{padding: '8px 16px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer'}}>Add Medicine</button>
      </form>

      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => setShowReturned(!showReturned)}
          style={{
            padding: '8px 16px', borderRadius: 6, border: '1px solid #ccc',
            background: showReturned ? '#333' : 'white', color: showReturned ? 'white' : '#333',
            cursor: 'pointer'
          }}
        >
          {showReturned ? 'Showing Returned List' : 'View Returned List'}
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Company</th>
            <th style={{ padding: 8 }}>Batch</th>
            <th style={{ padding: 8 }}>Qty</th>
            <th style={{ padding: 8 }}>Unit Price</th>
            <th style={{ padding: 8 }}>Expiry Date</th>
            {!showReturned && <th style={{ padding: 8 }}>Action</th>}
          </tr>
        </thead>
        <tbody>
          {currentList.map((m) => (
            <tr key={m.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: 8 }}>{m.name}</td>
              <td style={{ padding: 8 }}>{m.company}</td>
              <td style={{ padding: 8 }}>{m.batch}</td>
              <td style={{ padding: 8 }}>{m.quantity}</td>
              <td style={{ padding: 8 }}>৳{Number(m.unitPriceBdt).toFixed(2)}</td>
              <td style={{ padding: 8 }}>{new Date(m.expiryDate).toLocaleDateString()}</td>
              {!showReturned && (
                <td style={{ padding: 8 }}>
                  <button
                    onClick={() => handleReturn(m.id)}
                    style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#333', color: 'white', cursor: 'pointer', fontSize: 12 }}
                  >
                    Mark Returned
                  </button>
                </td>
              )}
            </tr>
          ))}
          {currentList.length === 0 && (
            <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#999' }}>No items</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}