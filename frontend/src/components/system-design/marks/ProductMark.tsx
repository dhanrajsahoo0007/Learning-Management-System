import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const SIZES = { sm: 16, md: 24, lg: 40 } as const;

/**
 * Original geometry only. These are course marks that suggest each product's
 * shape language; none of them reproduce an official brand logo.
 */
const MARKS: Record<string, ReactNode> = {
  tinder: (
    <>
      <rect x="6" y="8" width="10" height="13" rx="2.5" transform="rotate(-10 11 14.5)" />
      <rect x="10" y="6" width="11" height="14" rx="2.5" />
      <circle cx="17" cy="18" r="3.5" opacity="0.55" />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 8v8M8 12h8" opacity="0.5" />
    </>
  ),
  linkedin: (
    <>
      <circle cx="6.5" cy="8" r="2.5" />
      <circle cx="17.5" cy="6.5" r="2.5" />
      <circle cx="12" cy="17.5" r="2.5" />
      <path d="M8.6 9.6 10.6 15.4M15.9 8.7 13.4 15.4M9 7.4 15 6.8" />
    </>
  ),
  uber: (
    <>
      <path d="M3 18c4-7 10-9 18-11" opacity="0.6" />
      <path d="M12 21c3.2-4.4 5-7 5-9.4A5 5 0 0 0 7 11.6C7 14 8.8 16.6 12 21z" />
      <circle cx="12" cy="11.4" r="1.9" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 10a5 5 0 0 1 5-5h4a5 5 0 0 1 0 10H9l-4 3z" />
      <path d="M12 15.5a4.5 4.5 0 0 0 4.5 4.5H19l1.6 1.2-.4-1.6A4.5 4.5 0 0 0 18 15.6" opacity="0.6" />
    </>
  ),
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M10.5 9.2 15 12l-4.5 2.8z" />
    </>
  ),
  netflix: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M5 7h3M5 11h3M5 15h3M16 7h3M16 11h3M16 15h3" opacity="0.55" />
      <path d="M10 8v8l4-8v8" />
    </>
  ),
  spotify: (
    <>
      <path d="M6 15V9M10 18V6M14 16V8M18 13v-2" />
    </>
  ),
  zoom: (
    <>
      <circle cx="9.5" cy="12" r="6" />
      <circle cx="15.5" cy="12" r="6" opacity="0.55" />
    </>
  ),
  slack: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <path d="M14.5 8 9.5 16" />
    </>
  ),
  gmail: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2.5" />
      <path d="M3.5 7.5 12 13.5l8.5-6" />
      <path d="M12 13.5v4" opacity="0.5" />
    </>
  ),
  'google-search': (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
      <path d="M18.5 3v3M17 4.5h3" opacity="0.7" />
    </>
  ),
  paytm: (
    <>
      <rect x="3" y="7" width="14" height="9" rx="2" transform="rotate(-6 10 11.5)" />
      <rect x="6" y="10" width="14" height="9" rx="2" />
      <path d="M9.5 14.5 11.5 16.5 15.5 12.5" />
    </>
  ),
  zomato: (
    <>
      <path d="M4 12h16a8 8 0 0 1-8 8 8 8 0 0 1-8-8z" />
      <path d="M9 7c0-1.2 1-1.8 1-3M13 7c0-1.2 1-1.8 1-3" opacity="0.6" />
    </>
  ),
  bookmyshow: (
    <>
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4 2 2 0 0 1 0-4z" />
      <path d="M12 7v1.5M12 11v2M12 15.5V17" opacity="0.6" strokeDasharray="1 2" />
    </>
  ),
  airbnb: (
    <>
      <path d="M12 3c2.4 4 6 9.2 6 12a6 6 0 0 1-12 0c0-2.8 3.6-8 6-12z" />
      <path d="M9 15h6" opacity="0.55" />
    </>
  ),
  skyscanner: (
    <>
      <path d="M3 14 21 5l-6 15-3-6z" />
      <path d="M12 14 8.5 17.5" opacity="0.6" />
    </>
  ),
  'url-shortener': (
    <>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M8 12 6 14a3.2 3.2 0 0 0 4.5 4.5l2-2" />
      <path d="M16 12l2-2a3.2 3.2 0 0 0-4.5-4.5l-2 2" />
    </>
  ),
  'news-feed': (
    <>
      <rect x="4" y="4" width="16" height="7" rx="2" />
      <rect x="4" y="14" width="16" height="6" rx="2" opacity="0.6" />
      <path d="M7 17h6" opacity="0.7" />
    </>
  ),
};

export function hasProductMark(id: string) {
  return id in MARKS;
}

export function ProductMark({
  id,
  size = 'md',
  className,
}: {
  id: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const glyph = MARKS[id];
  if (!glyph) return null;
  const px = SIZES[size];

  return (
    <svg
      viewBox="0 0 24 24"
      width={px}
      height={px}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      {glyph}
    </svg>
  );
}
