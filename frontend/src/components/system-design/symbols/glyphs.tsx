import type { ReactNode } from 'react';

export type SymbolType =
  | 'user'
  | 'mobile'
  | 'server'
  | 'worker'
  | 'apiGateway'
  | 'loadBalancerL4'
  | 'loadBalancerL7'
  | 'cache'
  | 'sql'
  | 'document'
  | 'kv'
  | 'wideColumn'
  | 'graph'
  | 'search'
  | 'timeSeries'
  | 'columnar'
  | 's3'
  | 'blockVolume'
  | 'nfs'
  | 'queue'
  | 'log'
  | 'cdn'
  | 'dns'
  | 'lock'
  | 'ring'
  | 'mapCell'
  | 'wsGateway'
  | 'push'
  | 'idp'
  | 'trace';

const solid = { fill: 'currentColor', stroke: 'none' } as const;

export const SYMBOL_GLYPHS: Record<SymbolType, ReactNode> = {
  user: (
    <>
      <circle cx="24" cy="16" r="7" />
      <path d="M10 39c0-7.7 6.3-12 14-12s14 4.3 14 12" />
    </>
  ),
  mobile: (
    <>
      <rect x="14" y="6" width="20" height="36" rx="4" />
      <path d="M20 11h8" />
      <circle cx="24" cy="36" r="1.6" {...solid} />
    </>
  ),
  server: (
    <>
      <rect x="9" y="10" width="30" height="11" rx="2.5" />
      <rect x="9" y="27" width="30" height="11" rx="2.5" />
      <circle cx="14.5" cy="15.5" r="1.5" {...solid} />
      <circle cx="14.5" cy="32.5" r="1.5" {...solid} />
      <path d="M20 15.5h13M20 32.5h13" />
    </>
  ),
  worker: (
    <>
      <circle cx="24" cy="24" r="7" />
      <path d="M24 8v5M24 35v5M8 24h5M35 24h5M12.7 12.7l3.5 3.5M31.8 31.8l3.5 3.5M35.3 12.7l-3.5 3.5M16.2 31.8l-3.5 3.5" />
    </>
  ),
  apiGateway: (
    <>
      <path d="M9 39V23a15 15 0 0 1 30 0v16" />
      <path d="M6 39h36" />
      <path d="M17 30h11" />
      <path d="M24.5 26.5 28 30l-3.5 3.5" />
    </>
  ),
  loadBalancerL4: (
    <>
      <rect x="15" y="7" width="18" height="11" rx="2.5" />
      <circle cx="24" cy="12.5" r="1.6" {...solid} />
      <path d="M24 18v11" />
      <path d="M11 29h26" />
      <path d="M11 29v4M37 29v4" />
      <circle cx="11" cy="37" r="3.5" />
      <circle cx="24" cy="37" r="3.5" />
      <circle cx="37" cy="37" r="3.5" />
    </>
  ),
  loadBalancerL7: (
    <>
      <rect x="15" y="7" width="18" height="11" rx="2.5" />
      <path d="M19 10.5h10M19 14.5h6" />
      <path d="M24 18v11" />
      <path d="M11 29h26" />
      <path d="M11 29v4M37 29v4" />
      <circle cx="11" cy="37" r="3.5" />
      <circle cx="24" cy="37" r="3.5" />
      <circle cx="37" cy="37" r="3.5" />
    </>
  ),
  cache: (
    <>
      <rect x="8" y="12" width="32" height="24" rx="5" />
      <path d="M26 17l-7 9h5l-2 5 7-9h-5z" />
    </>
  ),
  sql: (
    <>
      <ellipse cx="24" cy="13" rx="14" ry="5" />
      <path d="M10 13v22c0 2.8 6.3 5 14 5s14-2.2 14-5V13" />
      <path d="M38 22c0 2.8-6.3 5-14 5s-14-2.2-14-5" />
      <path d="M38 29c0 2.8-6.3 5-14 5s-14-2.2-14-5" />
    </>
  ),
  document: (
    <>
      <path d="M13 7h14l8 8v26H13z" />
      <path d="M27 7v8h8" />
      <path d="M18 24h12M18 30h12M18 36h8" />
    </>
  ),
  kv: (
    <>
      <rect x="8" y="12" width="13" height="10" rx="2.5" />
      <rect x="27" y="12" width="13" height="10" rx="2.5" />
      <path d="M21 17h6" />
      <rect x="8" y="27" width="13" height="10" rx="2.5" />
      <rect x="27" y="27" width="13" height="10" rx="2.5" />
      <path d="M21 32h6" />
    </>
  ),
  wideColumn: (
    <>
      <rect x="8" y="10" width="10" height="28" opacity="0.14" {...solid} />
      <rect x="8" y="10" width="32" height="28" rx="3" />
      <path d="M18 10v28M29 10v28" />
      <path d="M8 19h32M8 29h32" />
    </>
  ),
  graph: (
    <>
      <circle cx="13" cy="15" r="5" />
      <circle cx="35" cy="13" r="5" />
      <circle cx="24" cy="35" r="5" />
      <path d="M17.5 17.5 20.5 30.5M30.5 16.5 27.5 30.5M18 14.5 30 13.6" />
    </>
  ),
  search: (
    <>
      <circle cx="21" cy="21" r="10" />
      <path d="M28.5 28.5 39 39" />
      <path d="M16 19h10M16 24h7" />
    </>
  ),
  timeSeries: (
    <>
      <path d="M9 9v30h30" />
      <path d="M13 31l6-8 5 5 6-11 6 7" />
    </>
  ),
  columnar: (
    <>
      <path d="M9 39h30" />
      <rect x="12" y="20" width="6" height="19" rx="1.5" />
      <rect x="21" y="12" width="6" height="27" rx="1.5" />
      <rect x="30" y="26" width="6" height="13" rx="1.5" />
    </>
  ),
  s3: (
    <>
      <ellipse cx="24" cy="13" rx="14" ry="5" />
      <path d="M10 13l3.5 24c.3 2 4.9 3.5 10.5 3.5s10.2-1.5 10.5-3.5L38 13" />
      <path d="M11.8 26c3 1.6 7.4 2.5 12.2 2.5s9.2-.9 12.2-2.5" />
    </>
  ),
  blockVolume: (
    <>
      <rect x="10" y="13" width="28" height="22" rx="4" />
      <path d="M10 20h28" />
      <path d="M16 27.5h10" />
      <circle cx="32" cy="27.5" r="2" />
    </>
  ),
  nfs: (
    <>
      <path d="M8 37V13h12l3 5h17v19z" />
      <circle cx="17" cy="30" r="2" />
      <circle cx="31" cy="30" r="2" />
      <circle cx="24" cy="24" r="2" />
      <path d="M18.7 28.6 22.3 25.4M29.3 28.6 25.7 25.4" />
    </>
  ),
  queue: (
    <>
      <rect x="7" y="17" width="30" height="14" rx="3" />
      <path d="M14 17v14M21 17v14M28 17v14" />
      <path d="M37 24h5" />
      <path d="M39 21l3 3-3 3" />
    </>
  ),
  log: (
    <>
      <rect x="7" y="19" width="34" height="12" rx="2.5" />
      <path d="M15 19v12M23 19v12M31 19v12" />
      <path d="M27 9v5" />
      <path d="M24.5 12 27 14.5 29.5 12" />
    </>
  ),
  cdn: (
    <>
      <circle cx="24" cy="24" r="14" />
      <path d="M10 24h28" />
      <ellipse cx="24" cy="24" rx="6" ry="14" />
      <circle cx="33.9" cy="14.1" r="2.4" {...solid} />
      <circle cx="14.1" cy="33.9" r="2.4" {...solid} />
    </>
  ),
  dns: (
    <>
      <rect x="18" y="8" width="12" height="8" rx="2" />
      <path d="M24 16v5" />
      <path d="M12 21h24" />
      <path d="M12 21v6M24 21v6M36 21v6" />
      <rect x="6" y="27" width="12" height="9" rx="2" />
      <rect x="18" y="27" width="12" height="9" rx="2" />
      <rect x="30" y="27" width="12" height="9" rx="2" />
    </>
  ),
  lock: (
    <>
      <rect x="11" y="21" width="26" height="19" rx="4" />
      <path d="M17 21v-5a7 7 0 0 1 14 0v5" />
      <circle cx="24" cy="29" r="2.5" />
      <path d="M24 31.5V34" />
    </>
  ),
  ring: (
    <>
      <circle cx="24" cy="24" r="14" />
      <circle cx="24" cy="10" r="3" {...solid} />
      <circle cx="36.1" cy="31" r="3" {...solid} />
      <circle cx="11.9" cy="31" r="3" {...solid} />
      <circle cx="35" cy="15" r="1.8" opacity="0.5" {...solid} />
      <circle cx="13" cy="15" r="1.8" opacity="0.5" {...solid} />
    </>
  ),
  mapCell: (
    <>
      <rect x="19" y="19" width="10" height="10" opacity="0.16" {...solid} />
      <rect x="8" y="8" width="32" height="32" rx="3" />
      <path d="M8 19h32M8 29h32M19 8v32M29 8v32" />
      <circle cx="24" cy="24" r="2.4" {...solid} />
    </>
  ),
  wsGateway: (
    <>
      <rect x="8" y="14" width="32" height="20" rx="4" />
      <path d="M14 21h20" />
      <path d="M31 18l3 3-3 3" />
      <path d="M34 27H14" />
      <path d="M17 24l-3 3 3 3" />
    </>
  ),
  push: (
    <>
      <path d="M15 32V22a9 9 0 0 1 18 0v10l3 4H12z" />
      <path d="M20.5 36a3.5 3.5 0 0 0 7 0" />
      <path d="M24 13v-3" />
    </>
  ),
  idp: (
    <>
      <path d="M24 7l13 5v11c0 8-5.5 14.4-13 17-7.5-2.6-13-9-13-17V12z" />
      <circle cx="24" cy="21" r="4" />
      <path d="M17 32c1.4-3.4 4-5 7-5s5.6 1.6 7 5" />
    </>
  ),
  trace: (
    <>
      <rect x="8" y="11" width="26" height="6" rx="3" />
      <rect x="14" y="21" width="22" height="6" rx="3" />
      <rect x="20" y="31" width="14" height="6" rx="3" />
    </>
  ),
};
