import { companyColor, companyMonogram } from '../lib/companies';

/**
 * Monogram badge standing in for a company logo. The company name is exposed to
 * assistive tech; the badge itself is decorative since the name is always
 * rendered alongside it.
 */
export function CompanyBadge({ company, size = 34 }: { company: string; size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: companyColor(company),
        color: '#fff',
        fontSize: size * 0.36,
        fontWeight: 600,
        letterSpacing: '0.01em',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {companyMonogram(company)}
    </span>
  );
}
