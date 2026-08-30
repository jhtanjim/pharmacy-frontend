/**
 * Hand-drawn icon set. All share a 24px viewBox, 1.75 stroke, round caps/joins
 * so they sit consistently beside Inter Tight at label sizes. Color comes from
 * `currentColor`; size from the `size` prop.
 */
type IconProps = { size?: number; className?: string; strokeWidth?: number };

function base(size: number, strokeWidth: number) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
  };
}

export function IconExpired({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}

export function IconClock({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function IconCalendar({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 10h17M8.5 3v4M15.5 3v4" />
    </svg>
  );
}

export function IconShield({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M12 3l7 3v5.5c0 4.2-2.9 7.9-7 9-4.1-1.1-7-4.8-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconSearch({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M15.8 15.8L20 20" />
    </svg>
  );
}

export function IconPlus({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconClose({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconReturn({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M9 14L4.5 9.5 9 5" />
      <path d="M4.5 9.5h10a5 5 0 0 1 0 10H8" />
    </svg>
  );
}

export function IconBox({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M3.5 8l8.5-4.5L20.5 8v8L12 20.5 3.5 16V8z" />
      <path d="M3.5 8l8.5 4.5L20.5 8M12 12.5v8" />
    </svg>
  );
}

export function IconTrendUp({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M3 16.5l5.5-5.5 3.5 3.5L21 6" />
      <path d="M15.5 6H21v5.5" />
    </svg>
  );
}

export function IconAlert({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M12 4.5L21 19H3l9-14.5z" />
      <path d="M12 10v4M12 16.5v.01" />
    </svg>
  );
}

export function IconPill({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <rect x="2.5" y="8" width="19" height="8" rx="4" transform="rotate(-45 12 12)" />
      <path d="M8.7 8.7l6.6 6.6" />
    </svg>
  );
}

export function IconChevronDown({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  );
}

export function IconChevronRight({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M9.5 6l6 6-6 6" />
    </svg>
  );
}

export function IconHome({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M4 10.5L12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8.5z" />
      <path d="M9.5 20.5v-6h5v6" />
    </svg>
  );
}

export function IconLayers({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8l8.5-4.5z" />
      <path d="M3.5 12.5L12 17l8.5-4.5" />
      <path d="M3.5 16.5L12 21l8.5-4.5" />
    </svg>
  );
}

export function IconArchive({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <rect x="3.5" y="4.5" width="17" height="4.5" rx="1.5" />
      <path d="M5.5 9v9.5A1.5 1.5 0 0 0 7 20h10a1.5 1.5 0 0 0 1.5-1.5V9" />
      <path d="M10 13h4" />
    </svg>
  );
}

export function IconCross({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6v-6z" />
    </svg>
  );
}
