/**
 * Fixed identity color per company, from design/tokens.json's categorical
 * palette. Assignments are hardcoded (not hashed) so a company's color never
 * shifts if the roster order changes.
 */
export const COMPANY_COLORS: Record<string, string> = {
  ACI: 'var(--cat-indigo)',
  Aristopharma: 'var(--cat-teal)',
  Beximco: 'var(--cat-violet)',
  Eskayef: 'var(--cat-cyan)',
  Healthcare: 'var(--cat-rose)',
  Incepta: 'var(--cat-lime)',
  Opsonin: 'var(--cat-fuchsia)',
  Popular: 'var(--cat-sky)',
  Renata: 'var(--cat-orange)',
  Square: 'var(--cat-slate)',
};

const FALLBACK_COLOR = 'var(--gray-500)';

export function companyColor(company: string) {
  return COMPANY_COLORS[company] ?? FALLBACK_COLOR;
}

/** "Aristopharma" -> "AR"; a two-word name -> the initial of each word. */
export function companyMonogram(company: string) {
  const words = company.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return ((words[0][0] ?? '') + (words[1][0] ?? '')).toUpperCase();
  }
  return (words[0] ?? '').slice(0, 2).toUpperCase();
}
