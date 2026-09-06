import { useCallback, useEffect, useState } from "react";
import type { MouseEvent } from "react";
import type { LevelComponent } from "../types";

interface Marker {
  id: number;
  x: number;
  y: number;
}

const W = 800;
const H = 520;
const HIT_RADIUS = 48; // 命中宝藏的判定半径
const MARKER_R = 32; // 点击留下的圆半径
const CHANCE = 3; // 目标次数
const MIN_DIST = 240; // 宝藏与第一次点击的最小距离

const MARGIN_X = 120;
const MARGIN_Y = 120;
const TOP = MARGIN_Y;
const BOTTOM = H - MARGIN_Y;

/** 生成一个与 (fx,fy) 至少相距 minDist 的随机宝藏位置（在安全范围内）。 */
function randomTreasureAway(fx: number, fy: number, minDist: number): { x: number; y: number } {
  for (let i = 0; i < 400; i++) {
    const x = MARGIN_X + Math.random() * (W - MARGIN_X * 2);
    const y = TOP + Math.random() * (BOTTOM - TOP);
    if (Math.hypot(x - fx, y - fy) >= minDist) return { x, y };
  }
  // 兜底：取安全范围内距离最远的点。
  const corners = [
    { x: MARGIN_X, y: TOP },
    { x: W - MARGIN_X, y: TOP },
    { x: MARGIN_X, y: BOTTOM },
    { x: W - MARGIN_X, y: BOTTOM },
  ];
  let best = corners[0];
  let bestD = -Infinity;
  for (const c of corners) {
    const d = Math.hypot(c.x - fx, c.y - fy);
    if (d > bestD) {
      bestD = d;
      best = c;
    }
  }
  return best;
}

export const Level1Treasure: LevelComponent = ({ setHud, setDone }) => {
  const [treasure, setTreasure] = useState<{ x: number; y: number } | null>(null);
  const [clicks, setClicks] = useState(0);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [found, setFound] = useState(false);

  // 同步 HUD：显示点击次数（不封顶，超过 3 仍继续）。
  useEffect(() => {
    setHud(clicks, CHANCE);
  }, [clicks, setHud]);

  const handleClick = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (W / rect.width);
      const y = (e.clientY - rect.top) * (H / rect.height);

      // 点击落在已经出现的圆里 → 无效，直接忽略。
      if (markers.some((m) => Math.hypot(x - m.x, y - m.y) <= MARKER_R)) return;

      setClicks((c) => c + 1);

      // 第一次点击：延迟生成宝藏，确保不在这处附近。
      if (!treasure) {
        const t = randomTreasureAway(x, y, MIN_DIST);
        setTreasure(t);
        setMarkers((prev) => [...prev, { id: Date.now() + Math.random(), x, y }]);
        return;
      }

      // 未命中（或已找到后仍继续点）：留下圆 + 圆内指向宝藏的箭头。
      if (!found && Math.hypot(x - treasure.x, y - treasure.y) <= HIT_RADIUS) {
        setFound(true); // 命中宝藏 → 显现
        setDone(true);
        return;
      }

      setMarkers((prev) => [...prev, { id: Date.now() + Math.random(), x, y }]);
    },
    [found, treasure, markers],
  );

  return (
    <svg
      className="board"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      onClick={handleClick}
    >
      {/* 白色画布 */}
      <rect x={0} y={0} width={W} height={H} rx={14} fill="#ffffff" stroke="#e2e8f0" strokeWidth={2} />

      {/* 点击留下的圆 + 圆内指向宝藏的箭头 */}
      {treasure &&
        markers.map((m) => <MarkerGraphic key={m.id} marker={m} target={treasure} />)}

      {/* 找到后显现宝藏 */}
      {found && treasure && (
        <circle cx={treasure.x} cy={treasure.y} r={34} fill="#ffe08a" stroke="#e0a512" strokeWidth={4} />
      )}
    </svg>
  );
};

function MarkerGraphic({ marker, target }: { marker: Marker; target: { x: number; y: number } }) {
  const { x, y } = marker;
  const angle = Math.atan2(target.y - y, target.x - x);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // 实心三角形：尖端指向宝藏。
  const tipDist = MARKER_R - 8;
  const baseDist = tipDist - 12;
  const halfW = 6;
  const ax = x + tipDist * cos;
  const ay = y + tipDist * sin;
  const b1x = x + baseDist * cos - halfW * sin;
  const b1y = y + baseDist * sin + halfW * cos;
  const b2x = x + baseDist * cos + halfW * sin;
  const b2y = y + baseDist * sin - halfW * cos;

  return (
    <g>
      {/* 圆环 */}
      <circle cx={x} cy={y} r={MARKER_R} fill="#ffffff" fillOpacity={0.85} stroke="#4f6ef7" strokeWidth={3} />

      {/* 三角形 */}
      <polygon points={`${ax},${ay} ${b1x},${b1y} ${b2x},${b2y}`} fill="#4f6ef7" />
    </g>
  );
}
