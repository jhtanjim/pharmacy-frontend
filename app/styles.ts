/**
 * Mobile-first. Base rules are the phone; one `min-width: 768px` block widens
 * it. Depth comes from layered low-opacity shadows and tonal surfaces, never
 * from hard gradients.
 */
export const pageCss = `
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.app {
  min-height: 100dvh;
  /* Clears the fixed nav and the FAB that floats above it. */
  padding-bottom: calc(150px + env(safe-area-inset-bottom));
  background: var(--color-background);
}

/* ── Header block ────────────────────────────────── */
.hero {
  background: var(--grad-header);
  color: var(--header-fg);
  padding: calc(14px + env(safe-area-inset-top)) 18px 20px;
  border-radius: 0 0 26px 26px;
}
.hero-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
.hero-mark {
  width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
  background: var(--header-inset); color: var(--header-fg);
  display: grid; place-items: center;
}
.hero-titles { flex: 1; min-width: 0; }
.hero-name {
  margin: 0; font-size: 17px; font-weight: 600; letter-spacing: -0.01em;
  color: var(--header-fg);
}
.hero-date { margin: 2px 0 0; font-size: 12.5px; color: var(--header-dim); }

/* Two figures side by side inside the block — the reference's stat pair. */
.hero-stats {
  display: grid; grid-template-columns: 1fr 1px 1fr;
  align-items: center; gap: 14px; margin-top: 20px;
}
.hero-divider { width: 1px; height: 42px; background: var(--header-line); }
.hero-stat { min-width: 0; }
.hero-label {
  display: flex; align-items: center; gap: 5px; margin: 0 0 5px;
  font-size: 11px; font-weight: 500; letter-spacing: 0.03em;
  text-transform: uppercase; color: var(--header-dim);
}
.hero-value {
  margin: 0; font-size: 25px; font-weight: 700; line-height: 1;
  letter-spacing: -0.03em; color: var(--header-fg);
}
.hero-sub { margin: 4px 0 0; font-size: 11.5px; color: var(--header-dim); }

/* On list screens the figures collapse to a single summary line. */
.hero-compact { padding-bottom: 16px; }
.hero-compact .hero-stats { display: none; }
.hero-summary {
  display: flex; align-items: center; gap: 14px; margin-top: 14px;
  padding: 10px 14px; border-radius: 14px; background: var(--header-inset);
}
.hero-sum-item { display: flex; align-items: center; gap: 7px; font-size: 12.5px; color: var(--header-dim); }
.hero-sum-item strong { color: var(--header-fg); font-weight: 600; }
.hero-dot { width: 6px; height: 6px; border-radius: 999px; flex-shrink: 0; }
.dot-danger { background: #FF8A80; }
.dot-warning { background: #FFCF6B; }

/* ── Screen shell ────────────────────────────────── */
.screen { padding: 18px 16px 24px; max-width: 1180px; margin: 0 auto; width: 100%; }
.section-head {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 12px; margin: 0 0 12px;
}
.section-title {
  margin: 0; font-size: 15px; font-weight: 600;
  letter-spacing: -0.01em; color: var(--color-text-primary);
}
.section-sub { font-size: 12px; color: var(--color-text-tertiary); }

.card {
  background: var(--grad-surface);
  border-radius: 18px;
  box-shadow: var(--shadow-sm);
}

/* ── Breakdown rows ──────────────────────────────── */
.breakdown { padding: 6px 4px; }
.brk-row {
  display: flex; align-items: center; gap: 12px;
  width: 100%; padding: 12px 14px; min-height: 60px;
  background: none; border: none; border-radius: 14px;
  cursor: pointer; text-align: left;
  transition: background .16s ease;
}
.brk-row + .brk-row { box-shadow: inset 0 1px 0 var(--color-border); }
.brk-row:active { background: var(--color-muted); }
.brk-icon {
  width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
  display: grid; place-items: center;
}
.brk-expired { background: var(--grad-danger-soft); color: var(--color-danger); }
.brk-expiring_30 { background: var(--grad-warning-soft); color: var(--amber-700); }
.brk-expiring_90 { background: var(--grad-muted-soft); color: var(--color-text-secondary); }
.brk-safe { background: var(--grad-muted-soft); color: var(--color-text-secondary); }
.brk-text { flex: 1; min-width: 0; }
.brk-name { margin: 0; font-size: 14px; font-weight: 500; color: var(--color-text-primary); }
.brk-meta { margin: 2px 0 0; font-size: 12px; color: var(--color-text-tertiary); }
.brk-count { font-size: 17px; font-weight: 700; color: var(--color-text-primary); }
.brk-chev { color: var(--color-text-tertiary); flex-shrink: 0; }

/* ── Chart ───────────────────────────────────────── */
.chart-card { padding: 16px 14px 12px; }
.chart { display: flex; align-items: flex-end; gap: 6px; height: 128px; }
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; }
.bar-value { font-size: 9.5px; font-weight: 500; color: var(--color-text-tertiary); white-space: nowrap; }
.bar-track { flex: 1; width: 100%; display: flex; align-items: flex-end; justify-content: center; }
.bar-fill {
  width: 100%; max-width: 26px; border-radius: 999px;
  background: var(--color-border-strong);
  transition: height .45s cubic-bezier(.4,0,.2,1);
}
.bar-now { background: var(--teal-600); }
.bar-label { font-size: 11px; color: var(--color-text-tertiary); }
.bar-label-now { color: var(--teal-700); font-weight: 600; }

/* ── Search ──────────────────────────────────────── */
.search { position: relative; display: flex; align-items: center; margin-bottom: 12px; }
.search-icon { position: absolute; left: 14px; line-height: 0; color: var(--color-text-tertiary); pointer-events: none; }
.search input {
  width: 100%; min-height: 46px; padding: 0 46px;
  border: none; border-radius: 14px;
  background: var(--color-surface); color: var(--color-text-primary);
  box-shadow: var(--shadow-xs);
}
.search input::placeholder { color: var(--color-text-tertiary); }
.search input::-webkit-search-cancel-button { display: none; }
.search-clear {
  position: absolute; right: 3px; width: 44px; height: 44px;
  display: grid; place-items: center; border: none; background: none;
  color: var(--color-text-secondary); cursor: pointer;
}
.search-clear svg { padding: 6px; box-sizing: content-box; border-radius: 999px; background: var(--color-muted); }

/* ── Filter pills ────────────────────────────────── */
.filters { display: flex; gap: 7px; overflow-x: auto; padding-bottom: 12px; scrollbar-width: none; }
.filters::-webkit-scrollbar { display: none; }
.fpill {
  flex-shrink: 0; min-height: 44px; padding: 0 15px;
  display: inline-flex; align-items: center; gap: 6px;
  border: none; border-radius: 999px;
  background: var(--color-surface); color: var(--color-text-secondary);
  font-size: 12.5px; font-weight: 500; cursor: pointer;
  box-shadow: var(--shadow-xs); transition: background .16s ease, color .16s ease;
}
.fpill-on {
  background: var(--grad-primary); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 1px 2px rgba(11,79,73,.20);
}
.fpill-dot { width: 6px; height: 6px; border-radius: 999px; flex-shrink: 0; }
.fpill-on .fpill-dot { background: rgba(255,255,255,.8) !important; }

/* ── Stock rows ──────────────────────────────────── */
.rows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
.row {
  background: var(--grad-surface); border-radius: 16px;
  box-shadow: var(--shadow-sm); padding: 13px 14px;
  position: relative; overflow: hidden;
  transition: box-shadow .18s ease;
}
@media (hover: hover) {
  .row:hover { box-shadow: var(--shadow-md); }
}
.row::before {
  content: ''; position: absolute; left: 0; top: 14px; bottom: 14px;
  width: 3px; border-radius: 0 3px 3px 0;
}
/* Red = expired, amber = 0-30. The other two stay neutral: teal is the brand
   action color, so using it here would read as an affirmative status. */
.row-expired::before { background: var(--color-danger); }
.row-expiring_30::before { background: var(--amber-500); }
.row-expiring_90::before { background: var(--color-border-strong); }
.row-safe::before { background: var(--color-border-strong); }

.row-main { display: flex; align-items: center; gap: 11px; }
.row-id { flex: 1; min-width: 0; }
.row-name {
  margin: 0; font-size: 14.5px; font-weight: 600; letter-spacing: -0.01em;
  color: var(--color-text-primary);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.row-meta {
  margin: 2px 0 0; font-size: 12px; color: var(--color-text-tertiary);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.row-value { margin: 0; font-size: 15px; font-weight: 700; color: var(--color-text-primary); white-space: nowrap; }
.row-foot { display: flex; align-items: center; gap: 8px; margin-top: 11px; flex-wrap: wrap; }
.pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 999px;
  font-size: 11.5px; font-weight: 600; white-space: nowrap; flex-shrink: 0;
}
.pill-expired { background: var(--grad-danger-soft); color: var(--color-danger); }
.pill-expiring_30 { background: var(--grad-warning-soft); color: var(--amber-700); }
.pill-expiring_90 { background: var(--grad-muted-soft); color: var(--color-text-secondary); }
.pill-safe { background: var(--grad-muted-soft); color: var(--color-text-secondary); }
.row-date { font-size: 11.5px; color: var(--color-text-tertiary); white-space: nowrap; }
.date-full { display: none; }

/* ── Buttons ─────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  min-height: 44px; padding: 0 18px; border-radius: 999px;
  border: none; font-size: 14px; font-weight: 600; cursor: pointer;
  transition: transform .14s ease, background .14s ease;
}
.btn:active { transform: scale(.97); }
.btn:disabled { opacity: .55; cursor: default; transform: none; }
.btn-primary {
  background: var(--grad-primary); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 1px 2px rgba(11,79,73,.24);
}
.btn-quiet { background: var(--color-muted); color: var(--color-text-primary); }
.btn-return {
  margin-left: auto; min-height: 44px; padding: 0 15px;
  font-size: 12.5px; background: var(--color-muted); color: var(--color-text-primary);
}
.btn-block { width: 100%; }

/* ── FAB ─────────────────────────────────────────── */
.fab {
  position: fixed; right: 18px;
  bottom: calc(84px + env(safe-area-inset-bottom));
  width: 54px; height: 54px; border-radius: 18px; border: none;
  background: var(--grad-primary); color: #fff;
  display: grid; place-items: center; cursor: pointer; z-index: 30;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .16),
    0 2px 6px rgba(11, 79, 73, .22),
    0 10px 24px -8px rgba(11, 79, 73, .40);
  transition: transform .16s ease;
}
.fab:active { transform: scale(.94); }

/* ── Bottom nav ──────────────────────────────────── */
.tabbar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 40;
  display: flex; align-items: stretch;
  padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
  background: rgba(255,255,255,.92); backdrop-filter: blur(14px);
  box-shadow: var(--shadow-nav);
}
.tabitem {
  flex: 1; min-height: 54px; padding: 6px 4px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
  border: none; background: none; cursor: pointer;
  color: var(--color-text-tertiary); font-size: 10.5px; font-weight: 500;
  transition: color .16s ease;
}
.tabitem-on { color: var(--teal-700); font-weight: 600; }
.tabitem-icon {
  width: 46px; height: 26px; border-radius: 999px;
  display: grid; place-items: center;
  transition: background .18s ease;
}
.tabitem-on .tabitem-icon { background: var(--teal-50); }

/* ── Sheet (add form) ────────────────────────────── */
.sheet-backdrop {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(16, 32, 29, .38);
  animation: fade .2s ease;
}
@keyframes fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes rise { from { transform: translateY(100%) } to { transform: none } }
.sheet {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 51;
  max-height: 88dvh; overflow-y: auto;
  background: var(--color-surface);
  border-radius: 24px 24px 0 0;
  padding: 8px 18px calc(20px + env(safe-area-inset-bottom));
  animation: rise .26s cubic-bezier(.32,.72,0,1);
}
.sheet-grab { width: 38px; height: 4px; border-radius: 999px; background: var(--color-border-strong); margin: 0 auto 14px; }
.sheet-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.sheet-title { margin: 0; font-size: 17px; font-weight: 600; letter-spacing: -0.01em; }
.sheet-close {
  width: 34px; height: 34px; border-radius: 999px; border: none;
  background: var(--color-muted); color: var(--color-text-secondary);
  display: grid; place-items: center; cursor: pointer;
}
.fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.field input { min-width: 0; width: 100%; }
.field-wide { grid-column: 1 / -1; }
.field > span { font-size: 12px; font-weight: 500; color: var(--color-text-secondary); }
.field input {
  min-height: 46px; padding: 0 13px;
  border: 1px solid var(--color-border); border-radius: 13px;
  background: var(--color-surface); color: var(--color-text-primary);
}
.field input:focus { border-color: var(--teal-600); }
.field small { font-size: 11px; color: var(--color-text-tertiary); }
.sheet .btn-block { margin-top: 18px; }

/* ── Empty / loading ─────────────────────────────── */
.empty {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 44px 24px; text-align: center;
}
.empty-icon {
  width: 52px; height: 52px; display: grid; place-items: center;
  border-radius: 17px; background: var(--teal-50); color: var(--teal-700); margin-bottom: 4px;
}
.empty-title { margin: 0; font-size: 15px; font-weight: 600; color: var(--color-text-primary); }
.empty-body { margin: 0; font-size: 13px; color: var(--color-text-secondary); max-width: 30ch; }
.empty .btn { margin-top: 10px; }

@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .5 } }
.skel { border-radius: 16px; background: var(--color-border); animation: pulse 1.5s ease-in-out infinite; }
.skel-row { height: 74px; margin-bottom: 9px; }

/* ── Toast ───────────────────────────────────────── */
.toast-region {
  position: fixed; left: 0; right: 0; z-index: 60;
  bottom: calc(84px + env(safe-area-inset-bottom));
  display: grid; place-items: center; pointer-events: none;
}
@keyframes toast-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
.toast {
  max-width: calc(100vw - 32px);
  padding: 11px 18px; border-radius: 999px;
  background: var(--gray-900); color: #fff;
  font-size: 13.5px; font-weight: 500;
  box-shadow: var(--shadow-lg);
  animation: toast-in .22s ease-out both;
}

/* ── Narrow phones ───────────────────────────────── */
@media (max-width: 359px) {
  .screen { padding-left: 12px; padding-right: 12px; }
  .hero { padding-left: 14px; padding-right: 14px; }
  .hero-value { font-size: 22px; }
  .row-foot { gap: 6px; }
}

/* ── Desktop ─────────────────────────────────────── */
@media (min-width: 768px) {
  .app { padding-bottom: 40px; }

  /* Desktop header is a single band: identity left, figures right. */
  .hero { border-radius: 0; padding: 18px 28px; }
  .hero-inner {
    max-width: 1180px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between; gap: 32px;
  }
  .hero-name { font-size: 18px; }
  .hero-stats {
    grid-template-columns: auto 1px auto;
    justify-content: end; gap: 30px; margin-top: 0;
  }
  .hero-divider { height: 36px; }
  .hero-value { font-size: 24px; }
  /* There's room for the full figures on every screen at this width. */
  .hero-compact .hero-stats { display: grid; }
  .hero-summary { display: none; }
  .hero-compact { padding-bottom: 18px; }

  .screen { padding: 26px 28px 40px; }

  /* Nav moves to a top row of pills on desktop. */
  .tabbar {
    position: static; background: none; backdrop-filter: none; box-shadow: none;
    max-width: 1180px; margin: 0 auto; padding: 20px 28px 0;
    gap: 8px; justify-content: flex-start;
  }
  .tabitem {
    flex: 0 0 auto; flex-direction: row; gap: 8px;
    min-height: 44px; padding: 0 18px; border-radius: 999px;
    font-size: 13.5px; background: var(--color-surface); box-shadow: var(--shadow-xs);
  }
  .tabitem-on {
    background: var(--grad-primary); color: #fff;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 1px 2px rgba(11,79,73,.20);
  }
  .tabitem-icon { width: auto; height: auto; background: none !important; }

  .toast-region { bottom: 28px; }

  .two-col { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 20px; align-items: start; }
  .chart { height: 190px; gap: 14px; }
  .bar-fill { max-width: 40px; }
  .bar-value { font-size: 11px; }

  .search { max-width: 460px; }

  .row { padding: 15px 18px; display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: center; gap: 20px; }
  .row-foot { margin-top: 0; }
  .row-name { font-size: 15px; }
  .date-short { display: none; }
  .date-full { display: inline; }

  .sheet {
    left: 50%; right: auto; bottom: auto; top: 50%;
    transform: translate(-50%, -50%); width: min(560px, calc(100vw - 48px));
    border-radius: 22px; animation: fade .2s ease;
    max-height: 86dvh;
  }
  .sheet-grab { display: none; }
  .fields { grid-template-columns: repeat(3, 1fr); }
  .field-wide { grid-column: auto; }
}
`;
