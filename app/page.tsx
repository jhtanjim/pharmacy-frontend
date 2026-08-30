'use client';

import { useEffect, useRef, useState } from 'react';
import { createMedicine, getActiveMedicines, getReturnedMedicines, markReturned } from './lib/api';
import {
  classifyExpiry, expiryPhrase, formatExpiryDate, formatExpiryDateShort, type ExpiryGroup,
} from './lib/expiry';
import { formatTaka } from './lib/format';
import { monthlyValueAtRisk } from './lib/valueAtRisk';
import { CompanyBadge } from './components/CompanyBadge';
import {
  IconAlert, IconArchive, IconChevronRight, IconClose, IconCross, IconExpired,
  IconHome, IconLayers, IconPlus, IconReturn, IconSearch, IconShield, IconClock,
} from './components/icons';
import { pageCss } from './styles';

type Medicine = {
  id: string; name: string; company: string; batch: string;
  quantity: number; unitPriceBdt: string; expiryDate: string; isReturned: boolean;
};

type DashboardData = {
  counts: Record<ExpiryGroup, number>;
  expiredValue: number;
  expiringSoonValue: number;
  groups: Record<ExpiryGroup, Medicine[]>;
};

type Tab = 'home' | 'stock' | 'returned';

const GROUPS: ExpiryGroup[] = ['expired', 'expiring_30', 'expiring_90', 'safe'];

const GROUP_META: Record<ExpiryGroup, { name: string; note: string; short: string; dot: string; Icon: typeof IconExpired }> = {
  expired:     { name: 'Expired',        note: 'Past use — return these',   short: 'Expired', dot: 'var(--color-danger)',        Icon: IconExpired },
  expiring_30: { name: 'Within 30 days', note: 'Sell or return soon',       short: '0–30d',   dot: 'var(--amber-500)',           Icon: IconAlert },
  expiring_90: { name: '31–90 days',     note: 'Watch these next',          short: '31–90d',  dot: 'var(--color-border-strong)', Icon: IconClock },
  safe:        { name: 'Safe',           note: 'More than 90 days left',    short: 'Safe',    dot: 'var(--color-border-strong)', Icon: IconShield },
};

const DEFAULT_SHELF_LIFE_DAYS = 180;

const dateLabel = (d: Date) =>
  d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

function defaultExpiryInput(now: Date) {
  const d = new Date(now);
  d.setDate(d.getDate() + DEFAULT_SHELF_LIFE_DAYS);
  return d.toISOString().slice(0, 10);
}

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [returned, setReturned] = useState<Medicine[]>([]);
  const [tab, setTab] = useState<Tab>('home');
  const [filter, setFilter] = useState<ExpiryGroup | 'all'>('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Refreshed on every fetch. A frozen clock would drift from the server's,
  // which recomputes groups per request — leaving a tab open overnight could
  // otherwise show an expired item still sitting in the 0-30 bucket.
  const [now, setNow] = useState(() => new Date());

  const [form, setForm] = useState({
    name: '', company: '', batch: '', quantity: '', unitPriceBdt: '',
    expiryDate: defaultExpiryInput(now),
  });

  async function load() {
    setError(null);
    try {
      const [a, r] = await Promise.all([getActiveMedicines(), getReturnedMedicines()]);
      setNow(new Date());
      setData(a); setReturned(r);
    } catch {
      setError('Could not reach the server. Check the backend is running.');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  // Sheet is a modal dialog: lock the page behind it, move focus in, trap Tab
  // inside it, close on Esc, and hand focus back to whatever opened it.
  useEffect(() => {
    if (!sheetOpen) return;

    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const sheet = sheetRef.current;
    const focusables = () =>
      Array.from(
        sheet?.querySelectorAll<HTMLElement>(
          'button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => !el.hasAttribute('disabled'));

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSheetOpen(false); return; }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, [sheetOpen]);

  async function handleReturn(m: Medicine) {
    setPendingId(m.id);
    try {
      await markReturned(m.id);
      await load();
      setToast(`${m.name} moved to returned`);
    } catch { setToast('Could not mark that returned. Try again.'); }
    finally { setPendingId(null); }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createMedicine({
        name: form.name, company: form.company, batch: form.batch,
        quantity: Number(form.quantity), unitPriceBdt: Number(form.unitPriceBdt),
        expiryDate: form.expiryDate,
      });
      setForm({ name: '', company: '', batch: '', quantity: '', unitPriceBdt: '', expiryDate: defaultExpiryInput(now) });
      setSheetOpen(false);
      await load();
      setToast('Added to stock');
    } catch { setToast('Could not add that medicine. Check the details.'); }
    finally { setSubmitting(false); }
  }

  function openGroup(g: ExpiryGroup) {
    setFilter(g); setTab('stock'); setQuery('');
  }

  const active: Medicine[] = data
    ? [...data.groups.expired, ...data.groups.expiring_30, ...data.groups.expiring_90, ...data.groups.safe]
    : [];

  const q = query.trim().toLowerCase();
  const source = tab === 'returned' ? returned : active;
  const visible = source
    .filter((m) => !q || m.name.toLowerCase().includes(q) || m.company.toLowerCase().includes(q))
    .filter((m) => tab === 'returned' || filter === 'all' || classifyExpiry(m.expiryDate, now) === filter);

  return (
    <div className="app">
      <style>{pageCss}</style>

      {/* ── Header block ── */}
      <header className={`hero ${tab === 'home' ? '' : 'hero-compact'}`}>
        <div className="hero-inner">
          <div className="hero-top">
            <span className="hero-mark"><IconCross size={19} /></span>
            <div className="hero-titles">
              <p className="hero-name">Shelf check</p>
              <p className="hero-date">{dateLabel(now)}</p>
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <p className="hero-label"><span className="hero-dot dot-danger" /> Expired</p>
              <p className="hero-value">{data ? formatTaka(data.expiredValue) : '—'}</p>
              <p className="hero-sub">{data ? `${data.counts.expired} items at risk` : 'Loading'}</p>
            </div>
            <span className="hero-divider" aria-hidden />
            <div className="hero-stat">
              <p className="hero-label"><span className="hero-dot dot-warning" /> Next 30 days</p>
              <p className="hero-value">{data ? formatTaka(data.expiringSoonValue) : '—'}</p>
              <p className="hero-sub">{data ? `${data.counts.expiring_30} items to act on` : 'Loading'}</p>
            </div>
          </div>

          {tab !== 'home' && data && (
            <div className="hero-summary">
              <span className="hero-sum-item">
                <span className="hero-dot dot-danger" /> <strong>{formatTaka(data.expiredValue)}</strong> expired
              </span>
              <span className="hero-sum-item">
                <span className="hero-dot dot-warning" /> <strong>{formatTaka(data.expiringSoonValue)}</strong> soon
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Desktop shows nav under the header; phone pins it to the bottom. */}
      {/* Navigation, not an ARIA tablist — these switch screens rather than
          panels, so aria-current is the honest semantic and arrow-key roving
          isn't expected. */}
      <nav className="tabbar" aria-label="Sections">
        {([
          { id: 'home', label: 'Home', Icon: IconHome },
          { id: 'stock', label: 'Stock', Icon: IconLayers },
          { id: 'returned', label: 'Returned', Icon: IconArchive },
        ] as const).map(({ id, label, Icon }) => (
          <button
            key={id}
            aria-current={tab === id ? 'page' : undefined}
            className={`tabitem ${tab === id ? 'tabitem-on' : ''}`}
            onClick={() => { setTab(id); if (id !== 'stock') setFilter('all'); }}
          >
            <span className="tabitem-icon"><Icon size={20} /></span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <main className="screen">
        {loading && (
          <>
            <div className="skel skel-row" /><div className="skel skel-row" /><div className="skel skel-row" />
            <span className="sr-only" role="status">Loading</span>
          </>
        )}

        {!loading && error && (
          <div className="empty card">
            <span className="empty-icon"><IconAlert size={24} /></span>
            <p className="empty-title">Can&rsquo;t load your stock</p>
            <p className="empty-body">{error}</p>
            <button className="btn btn-primary" onClick={() => { setLoading(true); load(); }}>Try again</button>
          </div>
        )}

        {!loading && !error && data && (
          <>
            {/* ── HOME ── */}
            {tab === 'home' && (
              <div className="two-col">
                <section>
                  <div className="section-head">
                    <h2 className="section-title">Stock by expiry</h2>
                    <span className="section-sub">{active.length} active</span>
                  </div>
                  <div className="card breakdown">
                    {GROUPS.map((g) => {
                      const { name, note, Icon } = GROUP_META[g];
                      return (
                        <button key={g} className="brk-row" onClick={() => openGroup(g)}>
                          <span className={`brk-icon brk-${g}`}><Icon size={18} /></span>
                          <span className="brk-text">
                            <span className="brk-name" style={{ display: 'block' }}>{name}</span>
                            <span className="brk-meta" style={{ display: 'block' }}>{note}</span>
                          </span>
                          <span className="brk-count">{data.counts[g]}</span>
                          <span className="brk-chev"><IconChevronRight size={16} /></span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section style={{ marginTop: 22 }}>
                  <div className="section-head">
                    <h2 className="section-title">Value at risk</h2>
                    <span className="section-sub">Next 6 months</span>
                  </div>
                  <div className="card chart-card">
                    <Chart data={monthlyValueAtRisk(active, now)} />
                  </div>
                </section>
              </div>
            )}

            {/* ── STOCK / RETURNED ── */}
            {tab !== 'home' && (
              <section>
                <div className="search">
                  <span className="search-icon"><IconSearch size={17} /></span>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={tab === 'stock' ? 'Search stock' : 'Search returned'}
                    aria-label="Search by medicine or company"
                  />
                  {query && (
                    <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
                      <IconClose size={14} />
                    </button>
                  )}
                </div>

                {tab === 'stock' && (
                  <div className="filters" role="group" aria-label="Filter by expiry">
                    <button
                      className={`fpill ${filter === 'all' ? 'fpill-on' : ''}`}
                      aria-pressed={filter === 'all'}
                      onClick={() => setFilter('all')}
                    >
                      All <strong>{active.length}</strong>
                    </button>
                    {GROUPS.map((g) => (
                      <button
                        key={g}
                        className={`fpill ${filter === g ? 'fpill-on' : ''}`}
                        aria-pressed={filter === g}
                        onClick={() => setFilter(filter === g ? 'all' : g)}
                      >
                        <span className="fpill-dot" style={{ background: GROUP_META[g].dot }} />
                        {GROUP_META[g].short} <strong>{data.counts[g]}</strong>
                      </button>
                    ))}
                  </div>
                )}

                <ul className="rows">
                  {visible.map((m) => {
                    const g = classifyExpiry(m.expiryDate, now);
                    const value = Number(m.unitPriceBdt) * m.quantity;
                    return (
                      <li key={m.id} className={`row row-${g}`}>
                        <div className="row-main">
                          <CompanyBadge company={m.company} size={36} />
                          <div className="row-id">
                            <p className="row-name">{m.name}</p>
                            <p className="row-meta">{m.company} · {m.batch} · {m.quantity} units</p>
                          </div>
                          <p className="row-value">{formatTaka(value)}</p>
                        </div>
                        <div className="row-foot">
                          <span className={`pill pill-${g}`}>{expiryPhrase(m.expiryDate, now)}</span>
                          <span className="row-date">
                            <span className="date-short">{formatExpiryDateShort(m.expiryDate)}</span>
                            <span className="date-full">{formatExpiryDate(m.expiryDate)}</span>
                          </span>
                          {tab === 'stock' && (
                            <button
                              className="btn btn-return"
                              onClick={() => handleReturn(m)}
                              disabled={pendingId === m.id}
                              aria-label={`Mark ${m.name} batch ${m.batch} as returned`}
                            >
                              <IconReturn size={14} />
                              {pendingId === m.id ? 'Saving…' : 'Return'}
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {visible.length === 0 && (
                  <div className="empty card">
                    <span className="empty-icon">{tab === 'returned' ? <IconArchive size={24} /> : <IconLayers size={24} />}</span>
                    <p className="empty-title">
                      {q || filter !== 'all' ? 'Nothing matches' : tab === 'returned' ? 'Nothing returned yet' : 'No stock'}
                    </p>
                    <p className="empty-body">
                      {q || filter !== 'all'
                        ? 'Try a different search or clear the filter.'
                        : tab === 'returned'
                          ? 'Items you send back to the distributor collect here.'
                          : 'Add your first medicine to start tracking.'}
                    </p>
                    {(q || filter !== 'all') && (
                      <button className="btn btn-quiet" onClick={() => { setQuery(''); setFilter('all'); }}>
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>

      {tab !== 'returned' && !loading && !error && (
        <button className="fab" onClick={() => setSheetOpen(true)} aria-label="Add medicine">
          <IconPlus size={22} />
        </button>
      )}

      {sheetOpen && (
        <>
          <div className="sheet-backdrop" onClick={() => setSheetOpen(false)} />
          <div className="sheet" ref={sheetRef} role="dialog" aria-modal="true" aria-labelledby="sheet-title">
            <div className="sheet-grab" />
            <div className="sheet-head">
              <h2 className="sheet-title" id="sheet-title">Add medicine</h2>
              <button className="sheet-close" onClick={() => setSheetOpen(false)} aria-label="Close">
                <IconClose size={16} />
              </button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="fields">
                <label className="field field-wide">
                  <span>Medicine name</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Napa 500" />
                </label>
                <label className="field field-wide">
                  <span>Company</span>
                  <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Beximco" />
                </label>
                <label className="field">
                  <span>Batch</span>
                  <input required value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} placeholder="F7868" />
                </label>
                <label className="field">
                  <span>Quantity</span>
                  <input required type="number" min={1} inputMode="numeric" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="100" />
                </label>
                <label className="field">
                  <span>Unit price ৳</span>
                  <input required type="number" min={0} step="0.01" inputMode="decimal" value={form.unitPriceBdt} onChange={(e) => setForm({ ...form, unitPriceBdt: e.target.value })} placeholder="1.50" />
                </label>
                <label className="field field-wide">
                  <span>Expiry date</span>
                  <input required type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
                  <small>Defaults to {DEFAULT_SHELF_LIFE_DAYS} days out, which lands in Safe</small>
                </label>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? 'Adding…' : 'Add to stock'}
              </button>
            </form>
          </div>
        </>
      )}

      <div className="toast-region" role="status" aria-live="polite">
        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
}

/**
 * Real stock is very unevenly distributed — one month can hold 30x another,
 * which on a plain linear scale flattens every other month into an invisible
 * sliver. Bars stay linear and proportional, but a nonzero month never renders
 * below MIN_BAR so it remains readable and tappable.
 */
const MIN_BAR = 14;

function Chart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((b) => b.value), 1);
  return (
    <div className="chart">
      {data.map((b, i) => {
        const pct = (b.value / max) * 100;
        const height = b.value > 0 ? Math.max(pct, MIN_BAR) : 2;
        return (
          <div key={b.label} className="bar-col">
            <span className="bar-value">{b.value > 0 ? formatTaka(b.value) : '—'}</span>
            <div className="bar-track">
              <div
                className={`bar-fill ${i === 0 ? 'bar-now' : ''}`}
                style={{ height: `${height}%` }}
                title={`${b.label}: ${formatTaka(b.value)}`}
              />
            </div>
            <span className={`bar-label ${i === 0 ? 'bar-label-now' : ''}`}>{b.label}</span>
          </div>
        );
      })}
    </div>
  );
}
