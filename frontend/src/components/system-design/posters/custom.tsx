const CLOCK_SEGMENTS = [
  { label: 'Clarify', from: 0, to: 5, detail: 'Users, core flows, what is explicitly out of scope' },
  { label: 'Estimate', from: 5, to: 10, detail: 'QPS, storage, payload size, peak multiplier' },
  { label: 'Design v1', from: 10, to: 25, detail: 'One request path end to end that actually works' },
  { label: 'Deep dive', from: 25, to: 40, detail: 'Two hard parts, chosen by the numbers' },
  { label: 'Close', from: 40, to: 45, detail: 'What fails first, how it degrades, what is next' },
];

const CLOCK_X = 30;
const CLOCK_W = 660;
const MINUTE = CLOCK_W / 45;

export function InterviewClockPoster() {
  const detailTop = 150;
  const height = detailTop + CLOCK_SEGMENTS.length * 19 + 16;

  return (
    <svg
      viewBox={`0 0 720 ${height}`}
      width="100%"
      style={{ maxWidth: 720, minWidth: 480 }}
      className="h-auto"
      role="img"
      aria-label="How the 45 minutes of a system design interview are spent"
    >
      <text x={CLOCK_X} y={22} className="fill-foreground text-[13px] font-semibold">
        Where the 45 minutes go
      </text>

      {CLOCK_SEGMENTS.map((segment, index) => {
        const x = CLOCK_X + segment.from * MINUTE;
        const w = (segment.to - segment.from) * MINUTE;
        return (
          <g key={segment.label}>
            <rect
              x={x}
              y={48}
              width={w}
              height={46}
              rx={8}
              className={index % 2 === 0 ? 'fill-primary/15 stroke-border' : 'fill-muted/60 stroke-border'}
              strokeWidth={1.5}
            />
            <text x={x + w / 2} y={70} textAnchor="middle" className="fill-foreground text-[11px] font-semibold">
              {segment.label}
            </text>
            <text x={x + w / 2} y={85} textAnchor="middle" className="fill-muted-foreground text-[9.5px]">
              {segment.to - segment.from} min
            </text>
            <text x={x} y={112} className="fill-muted-foreground text-[9.5px]">
              {segment.from}
            </text>
          </g>
        );
      })}
      <text x={CLOCK_X + CLOCK_W} y={112} textAnchor="end" className="fill-muted-foreground text-[9.5px]">
        45
      </text>

      <text x={CLOCK_X} y={136} className="fill-muted-foreground text-[9.5px]">
        Say the current phase out loud so the interviewer can redirect you early.
      </text>

      {CLOCK_SEGMENTS.map((segment, index) => (
        <g key={`${segment.label}-detail`}>
          <circle cx={CLOCK_X + 4} cy={detailTop + index * 19 - 4} r={3} className="fill-primary" />
          <text x={CLOCK_X + 15} y={detailTop + index * 19} className="fill-foreground text-[10.5px]">
            {`${segment.from}–${segment.to} ${segment.label}: `}
            <tspan className="fill-muted-foreground">{segment.detail}</tspan>
          </text>
        </g>
      ))}
    </svg>
  );
}

const SNOWFLAKE_FIELDS = [
  { label: 'unused', bits: 1, note: 'sign bit, always 0' },
  { label: 'timestamp', bits: 41, note: 'ms since a custom epoch — 69 years of ids' },
  { label: 'worker id', bits: 10, note: '1024 generators, assigned at boot' },
  { label: 'sequence', bits: 12, note: '4096 ids per worker per millisecond' },
];

export function SnowflakeBitsPoster() {
  const x0 = 30;
  const totalW = 660;
  const perBit = totalW / 64;
  let cursor = x0;

  const placed = SNOWFLAKE_FIELDS.map((field) => {
    const width = field.bits * perBit;
    const box = { ...field, x: cursor, width };
    cursor += width;
    return box;
  });

  const noteTop = 150;
  const height = noteTop + SNOWFLAKE_FIELDS.length * 19 + 16;

  return (
    <svg
      viewBox={`0 0 720 ${height}`}
      width="100%"
      style={{ maxWidth: 720, minWidth: 480 }}
      className="h-auto"
      role="img"
      aria-label="How 64 bits of a Snowflake id are divided"
    >
      <text x={x0} y={22} className="fill-foreground text-[13px] font-semibold">
        One 64-bit Snowflake id, sortable by time
      </text>

      {placed.map((field, index) => (
        <g key={field.label}>
          <rect
            x={field.x}
            y={48}
            width={field.width}
            height={46}
            rx={8}
            className={index % 2 === 0 ? 'fill-muted/60 stroke-border' : 'fill-primary/15 stroke-border'}
            strokeWidth={1.5}
          />
          {field.width > 44 && (
            <>
              <text
                x={field.x + field.width / 2}
                y={70}
                textAnchor="middle"
                className="fill-foreground text-[11px] font-semibold"
              >
                {field.label}
              </text>
              <text
                x={field.x + field.width / 2}
                y={85}
                textAnchor="middle"
                className="fill-muted-foreground text-[9.5px]"
              >
                {field.bits} bits
              </text>
            </>
          )}
        </g>
      ))}

      <text x={x0} y={114} className="fill-muted-foreground text-[9.5px]">
        63
      </text>
      <text x={x0 + totalW} y={114} textAnchor="end" className="fill-muted-foreground text-[9.5px]">
        0
      </text>

      <text x={x0} y={136} className="fill-muted-foreground text-[9.5px]">
        Ids rise with time, so a B-tree index appends instead of splitting pages at random.
      </text>

      {SNOWFLAKE_FIELDS.map((field, index) => (
        <g key={`${field.label}-note`}>
          <circle cx={x0 + 4} cy={noteTop + index * 19 - 4} r={3} className="fill-primary" />
          <text x={x0 + 15} y={noteTop + index * 19} className="fill-foreground text-[10.5px]">
            {`${field.label} (${field.bits} bits): `}
            <tspan className="fill-muted-foreground">{field.note}</tspan>
          </text>
        </g>
      ))}
    </svg>
  );
}

const BLOOM_BITS = 24;
const BLOOM_SET = [3, 7, 11, 16, 19];

export function BloomBitsPoster() {
  const x0 = 30;
  const cell = 26;
  const gridW = BLOOM_BITS * cell;

  return (
    <svg
      viewBox="0 0 720 250"
      width="100%"
      style={{ maxWidth: 720, minWidth: 480 }}
      className="h-auto"
      role="img"
      aria-label="A Bloom filter bit array with a true negative and a false positive"
    >
      <text x={x0} y={22} className="fill-foreground text-[13px] font-semibold">
        A Bloom filter never misses, but it does lie
      </text>

      <text x={x0} y={48} className="fill-muted-foreground text-[10px]">
        insert alice@example.com → h1=3, h2=11, h3=19
      </text>

      {Array.from({ length: BLOOM_BITS }, (_, index) => {
        const set = BLOOM_SET.includes(index);
        return (
          <g key={index}>
            <rect
              x={x0 + index * cell}
              y={60}
              width={cell - 3}
              height={30}
              rx={5}
              className={set ? 'fill-primary/25 stroke-border' : 'fill-card stroke-border'}
              strokeWidth={1.4}
            />
            <text
              x={x0 + index * cell + (cell - 3) / 2}
              y={80}
              textAnchor="middle"
              className={set ? 'fill-foreground text-[11px] font-semibold' : 'fill-muted-foreground text-[11px]'}
            >
              {set ? '1' : '0'}
            </text>
            <text
              x={x0 + index * cell + (cell - 3) / 2}
              y={104}
              textAnchor="middle"
              className="fill-muted-foreground text-[8px]"
            >
              {index}
            </text>
          </g>
        );
      })}

      <rect x={x0} y={126} width={gridW} height={44} rx={8} className="fill-muted/40 stroke-border" strokeWidth={1.25} />
      <circle cx={x0 + 16} cy={142} r={4} className="fill-muted-foreground" />
      <text x={x0 + 28} y={146} className="fill-foreground text-[10.5px]">
        query bob@example.com → h=3, 11, 22.
        <tspan className="fill-muted-foreground"> Bit 22 is 0, so bob is definitely absent. No disk read.</tspan>
      </text>
      <circle cx={x0 + 16} cy={162} r={4} className="fill-primary" />
      <text x={x0 + 28} y={166} className="fill-foreground text-[10.5px]">
        query carol@example.com → h=3, 11, 19.
        <tspan className="fill-muted-foreground"> All three bits are 1, so carol is maybe present: a false positive.</tspan>
      </text>

      <text x={x0} y={196} className="fill-muted-foreground text-[9.5px]">
        No false negatives — a set bit is never cleared, so anything inserted always answers &quot;maybe&quot;.
      </text>
      <text x={x0} y={214} className="fill-muted-foreground text-[9.5px]">
        Error rate ≈ (1 − e^(−kn/m))^k. Ten bits per key with k=7 gives roughly 1% false positives.
      </text>
      <text x={x0} y={232} className="fill-muted-foreground text-[9.5px]">
        Cassandra and Bigtable put one in front of every SSTable so a miss never touches the disk.
      </text>
    </svg>
  );
}
