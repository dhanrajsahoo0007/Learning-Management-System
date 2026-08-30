import { useId } from 'react';
import { useIsNarrow } from '@/hooks/useIsNarrow';
import { SYMBOL_GLYPHS, type SymbolType } from './glyphs';

export interface PosterNode {
  id: string;
  symbol: SymbolType;
  label: string;
  cluster: string;
}

export interface PosterEdge {
  from: string;
  to: string;
  label?: string;
  step?: number;
  dashed?: boolean;
}

export interface PosterSpec {
  title: string;
  legend?: string[];
  clusters: { id: string; label: string }[];
  nodes: PosterNode[];
  edges: PosterEdge[];
}

const PAD = 18;
// The poster frame renders the title above the canvas, so no space is reserved for one here.
const TITLE_H = 0;
const SYMBOL_PX = 38;
const LABEL_LINE = 12;
const NODE_PAD_Y = 10;
const NODE_GAP = 14;
const CLUSTER_PAD_X = 12;
const CLUSTER_LABEL_H = 22;
const CLUSTER_PAD_BOTTOM = 12;

const LR_NODE_W = 148;
const LR_CLUSTER_GAP = 78;

const TB_WIDTH = 348;
const TB_NODE_W = 140;
const TB_NODE_GAP_X = 12;
const TB_CLUSTER_GAP = 52;
const TB_COLS = 2;

const LEGEND_H = 26;

type Point = { x: number; y: number };

type PlacedNode = PosterNode & {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: string[];
  clusterIndex: number;
};

type PlacedCluster = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

function wrapLabel(label: string, maxChars: number, maxLines: number): string[] {
  const words = label.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] = `${kept[maxLines - 1].slice(0, maxChars - 1)}…`;
  return kept;
}

function bezierPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t;
  const a = mt * mt * mt;
  const b = 3 * mt * mt * t;
  const c = 3 * mt * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

function layoutHorizontal(spec: PosterSpec) {
  const maxChars = 20;
  const maxLines = Math.max(
    1,
    ...spec.nodes.map((node) => wrapLabel(node.label, maxChars, 3).length)
  );
  const nodeH = NODE_PAD_Y * 2 + SYMBOL_PX + 5 + maxLines * LABEL_LINE;
  const clusterW = LR_NODE_W + CLUSTER_PAD_X * 2;

  const grouped = spec.clusters.map((cluster) => ({
    cluster,
    nodes: spec.nodes.filter((node) => node.cluster === cluster.id),
  }));

  const clusterHeights = grouped.map(
    ({ nodes }) =>
      CLUSTER_LABEL_H +
      nodes.length * nodeH +
      Math.max(0, nodes.length - 1) * NODE_GAP +
      CLUSTER_PAD_BOTTOM
  );
  const bandH = Math.max(...clusterHeights, nodeH + CLUSTER_LABEL_H + CLUSTER_PAD_BOTTOM);
  const bandTop = TITLE_H + PAD;

  const clusters: PlacedCluster[] = [];
  const nodes: PlacedNode[] = [];

  grouped.forEach(({ cluster, nodes: clusterNodes }, clusterIndex) => {
    const x = PAD + clusterIndex * (clusterW + LR_CLUSTER_GAP);
    const h = clusterHeights[clusterIndex];
    const y = bandTop + (bandH - h) / 2;
    clusters.push({ id: cluster.id, label: cluster.label, x, y, w: clusterW, h });

    clusterNodes.forEach((node, nodeIndex) => {
      nodes.push({
        ...node,
        clusterIndex,
        x: x + CLUSTER_PAD_X,
        y: y + CLUSTER_LABEL_H + nodeIndex * (nodeH + NODE_GAP),
        w: LR_NODE_W,
        h: nodeH,
        lines: wrapLabel(node.label, maxChars, maxLines),
      });
    });
  });

  const width = PAD * 2 + grouped.length * clusterW + Math.max(0, grouped.length - 1) * LR_CLUSTER_GAP;
  const height = bandTop + bandH + PAD + (spec.legend?.length ? LEGEND_H : 0);

  return { clusters, nodes, width, height, nodeH };
}

function layoutVertical(spec: PosterSpec) {
  const maxChars = 18;
  const maxLines = Math.max(
    1,
    ...spec.nodes.map((node) => wrapLabel(node.label, maxChars, 3).length)
  );
  const nodeH = NODE_PAD_Y * 2 + SYMBOL_PX + 5 + maxLines * LABEL_LINE;
  const clusterW = TB_WIDTH - PAD * 2;

  const grouped = spec.clusters.map((cluster) => ({
    cluster,
    nodes: spec.nodes.filter((node) => node.cluster === cluster.id),
  }));

  const clusters: PlacedCluster[] = [];
  const nodes: PlacedNode[] = [];
  let cursorY = TITLE_H + PAD;

  grouped.forEach(({ cluster, nodes: clusterNodes }, clusterIndex) => {
    const rows = Math.max(1, Math.ceil(clusterNodes.length / TB_COLS));
    const h = CLUSTER_LABEL_H + rows * nodeH + (rows - 1) * NODE_GAP + CLUSTER_PAD_BOTTOM;
    clusters.push({ id: cluster.id, label: cluster.label, x: PAD, y: cursorY, w: clusterW, h });

    clusterNodes.forEach((node, nodeIndex) => {
      const row = Math.floor(nodeIndex / TB_COLS);
      const colCount = Math.min(TB_COLS, clusterNodes.length - row * TB_COLS);
      const col = nodeIndex % TB_COLS;
      const rowWidth = colCount * TB_NODE_W + (colCount - 1) * TB_NODE_GAP_X;
      const rowStart = PAD + (clusterW - rowWidth) / 2;
      nodes.push({
        ...node,
        clusterIndex,
        x: rowStart + col * (TB_NODE_W + TB_NODE_GAP_X),
        y: cursorY + CLUSTER_LABEL_H + row * (nodeH + NODE_GAP),
        w: TB_NODE_W,
        h: nodeH,
        lines: wrapLabel(node.label, maxChars, maxLines),
      });
    });

    cursorY += h + TB_CLUSTER_GAP;
  });

  const height = cursorY - TB_CLUSTER_GAP + PAD + (spec.legend?.length ? LEGEND_H : 0);
  return { clusters, nodes, width: TB_WIDTH, height, nodeH };
}

function edgeGeometry(source: PlacedNode, target: PlacedNode, vertical: boolean) {
  const sameCluster = source.clusterIndex === target.clusterIndex;
  const forward = target.clusterIndex > source.clusterIndex;

  let p0: Point;
  let p3: Point;
  let p1: Point;
  let p2: Point;

  if (vertical) {
    if (sameCluster) {
      const leftToRight = target.x >= source.x;
      p0 = { x: leftToRight ? source.x + source.w : source.x, y: source.y + source.h / 2 };
      p3 = { x: leftToRight ? target.x : target.x + target.w, y: target.y + target.h / 2 };
      const dx = (p3.x - p0.x) / 2;
      p1 = { x: p0.x + dx, y: p0.y };
      p2 = { x: p3.x - dx, y: p3.y };
    } else if (forward) {
      p0 = { x: source.x + source.w / 2, y: source.y + source.h };
      p3 = { x: target.x + target.w / 2, y: target.y };
      const dy = Math.max(18, (p3.y - p0.y) * 0.45);
      p1 = { x: p0.x, y: p0.y + dy };
      p2 = { x: p3.x, y: p3.y - dy };
    } else {
      p0 = { x: source.x + source.w, y: source.y + source.h / 2 };
      p3 = { x: target.x + target.w, y: target.y + target.h / 2 };
      const bulge = 46;
      p1 = { x: p0.x + bulge, y: p0.y };
      p2 = { x: p3.x + bulge, y: p3.y };
    }
  } else if (sameCluster) {
    const topToBottom = target.y >= source.y;
    p0 = { x: source.x + source.w / 2, y: topToBottom ? source.y + source.h : source.y };
    p3 = { x: target.x + target.w / 2, y: topToBottom ? target.y : target.y + target.h };
    const dy = (p3.y - p0.y) / 2;
    p1 = { x: p0.x, y: p0.y + dy };
    p2 = { x: p3.x, y: p3.y - dy };
  } else if (forward) {
    p0 = { x: source.x + source.w, y: source.y + source.h / 2 };
    p3 = { x: target.x, y: target.y + target.h / 2 };
    const dx = Math.max(24, (p3.x - p0.x) * 0.45);
    p1 = { x: p0.x + dx, y: p0.y };
    p2 = { x: p3.x - dx, y: p3.y };
  } else {
    p0 = { x: source.x + source.w / 2, y: source.y + source.h };
    p3 = { x: target.x + target.w / 2, y: target.y + target.h };
    const bulge = 44;
    p1 = { x: p0.x, y: p0.y + bulge };
    p2 = { x: p3.x, y: p3.y + bulge };
  }

  return {
    d: `M${p0.x} ${p0.y} C${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`,
    mid: bezierPoint(p0, p1, p2, p3, 0.5),
    quarter: bezierPoint(p0, p1, p2, p3, 0.24),
  };
}

export function ArchitectureCanvas({ spec }: { spec: PosterSpec }) {
  const narrow = useIsNarrow();
  const markerId = useId().replace(/:/g, '');
  const { clusters, nodes, width, height } = narrow ? layoutVertical(spec) : layoutHorizontal(spec);
  const byId = new Map(nodes.map((node) => [node.id, node]));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{ maxWidth: width, minWidth: narrow ? undefined : Math.min(width, 560) }}
      className="h-auto"
      role="img"
      aria-label={spec.title}
    >
      <defs>
        <marker
          id={`arrow-${markerId}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 1.5 9 5 0 8.5z" className="fill-muted-foreground" />
        </marker>
      </defs>

      {clusters.map((cluster) => (
        <g key={cluster.id}>
          <rect
            x={cluster.x}
            y={cluster.y}
            width={cluster.w}
            height={cluster.h}
            rx={12}
            className="fill-muted/40 stroke-border"
            strokeWidth={1.25}
            strokeDasharray="4 4"
          />
          <text
            x={cluster.x + CLUSTER_PAD_X}
            y={cluster.y + 15}
            className="fill-muted-foreground text-[9.5px] font-semibold tracking-wider uppercase"
          >
            {cluster.label}
          </text>
        </g>
      ))}

      {spec.edges.map((edge) => {
        const source = byId.get(edge.from);
        const target = byId.get(edge.to);
        if (!source || !target) return null;
        const { d, mid, quarter } = edgeGeometry(source, target, narrow);
        const labelW = edge.label ? edge.label.length * 5.3 + 12 : 0;

        return (
          <g key={`${edge.from}-${edge.to}-${edge.label ?? ''}`}>
            <path
              d={d}
              fill="none"
              className="stroke-muted-foreground/70"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray={edge.dashed ? '5 4' : undefined}
              markerEnd={`url(#arrow-${markerId})`}
            />
            {edge.label && (
              <>
                <rect
                  x={mid.x - labelW / 2}
                  y={mid.y - 8}
                  width={labelW}
                  height={16}
                  rx={8}
                  className="fill-card stroke-border"
                  strokeWidth={1}
                />
                <text
                  x={mid.x}
                  y={mid.y + 3.5}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[9.5px]"
                >
                  {edge.label}
                </text>
              </>
            )}
            {edge.step !== undefined && (
              <>
                <circle cx={quarter.x} cy={quarter.y} r={8} className="fill-primary" />
                <text
                  x={quarter.x}
                  y={quarter.y + 3.2}
                  textAnchor="middle"
                  className="fill-primary-foreground text-[9.5px] font-semibold"
                >
                  {edge.step}
                </text>
              </>
            )}
          </g>
        );
      })}

      {nodes.map((node) => (
        <g key={node.id}>
          <rect
            x={node.x}
            y={node.y}
            width={node.w}
            height={node.h}
            rx={10}
            className="fill-card stroke-border"
            strokeWidth={1.5}
          />
          <g
            transform={`translate(${node.x + node.w / 2 - SYMBOL_PX / 2} ${node.y + NODE_PAD_Y}) scale(${SYMBOL_PX / 48})`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            {SYMBOL_GLYPHS[node.symbol]}
          </g>
          {node.lines.map((line, index) => (
            <text
              key={line + index}
              x={node.x + node.w / 2}
              y={node.y + NODE_PAD_Y + SYMBOL_PX + 14 + index * LABEL_LINE}
              textAnchor="middle"
              className="fill-foreground text-[10.5px]"
            >
              {line}
            </text>
          ))}
        </g>
      ))}

      {spec.legend?.length ? (
        <text x={PAD} y={height - 9} className="fill-muted-foreground text-[9.5px]">
          {spec.legend.join('   ·   ')}
        </text>
      ) : null}
    </svg>
  );
}
