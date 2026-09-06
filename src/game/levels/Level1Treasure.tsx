import { useCallback, useEffect, useState } from "react";
import type { MouseEvent } from "react";
import type { LevelComponent } from "../types";

type Point = { x: number; y: number };

interface Marker extends Point {
  id: number;
}

const W = 800;
const H = 520;
const MARGIN = 120; // 宝藏生成的安全边距
const HIT_RADIUS = 48; // 命中宝藏的判定半径
const MARKER_R = 32; // 点击留下的圆半径
const COIN_R = 34; // 找到后宝藏圆半径
const CHANCE = 3; // 目标次数
const MIN_DIST = 240; // 宝藏与第一次点击的最小距离

const dist = (ax: number, ay: number, b: Point) => Math.hypot(ax - b.x, ay - b.y);
const insideCircle = (p: Point, center: Point, r: number) => dist(p.x, p.y, center) <= r;

/** 生成一个与 (fx,fy) 至少相距 minDist 的随机宝藏位置。 */
function randomTreasureAway(fx: number, fy: number, minDist: number): Point {
  const farEnough = (p: Point) => dist(fx, fy, p) >= minDist;
  for (let i = 0; i < 400; i++) {
    const p: Point = {
      x: MARGIN + Math.random() * (W - MARGIN * 2),
      y: MARGIN + Math.random() * (H - MARGIN * 2),
    };
    if (farEnough(p)) return p;
  }
  // 兜底：取安全范围内距离最远的角点。
  const corners: Point[] = [
    { x: MARGIN, y: MARGIN },
    { x: W - MARGIN, y: MARGIN },
    { x: MARGIN, y: H - MARGIN },
    { x: W - MARGIN, y: H - MARGIN },
  ];
  return corners.reduce((best, c) => (dist(fx, fy, c) > dist(fx, fy, best) ? c : best));
}

export const Level1Treasure: LevelComponent = ({ setHud, setDone }) => {
  const [treasure, setTreasure] = useState<Point | null>(null);
  const [clicks, setClicks] = useState(0);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [found, setFound] = useState(false);

  // 同步 HUD：显示点击次数（不封顶，超过 3 仍继续）。
  useEffect(() => {
    setHud(clicks, CHANCE);
  }, [clicks, setHud]);

  const addMarker = useCallback((x: number, y: number) => {
    setMarkers((prev) => [...prev, { id: Date.now() + Math.random(), x, y }]);
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const p: Point = {
        x: (e.clientX - rect.left) * (W / rect.width),
        y: (e.clientY - rect.top) * (H / rect.height),
      };

      // 点击落在已出现的圆里 → 无效（含各处点击圆与找到后的宝藏圆）。
      if (markers.some((m) => insideCircle(p, m, MARKER_R))) return;
      if (treasure && found && insideCircle(p, treasure, COIN_R)) return;

      setClicks((c) => c + 1);

      // 第一次点击：延迟生成宝藏，确保不在这处附近。
      if (!treasure) {
        setTreasure(randomTreasureAway(p.x, p.y, MIN_DIST));
        addMarker(p.x, p.y);
        return;
      }

      // 命中宝藏 → 显现。
      if (!found && insideCircle(p, treasure, HIT_RADIUS)) {
        setFound(true);
        setDone(true);
        return;
      }

      // 未命中（或已找到后仍继续点）：留下指向宝藏的圆。
      addMarker(p.x, p.y);
    },
    [treasure, found, markers, addMarker],
  );

  return (
    <svg
      className="board"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      onClick={handleClick}
    >
      {/* 白色画布 */}
      <rect x={0} y={0} width={W} height={H} fill="#ffffff" />

      {treasure && markers.map((m) => <MarkerGraphic key={m.id} marker={m} target={treasure} />)}

      {found && treasure && (
        <circle cx={treasure.x} cy={treasure.y} r={COIN_R} fill="#ffe08a" stroke="#e0a512" strokeWidth={4} />
      )}
    </svg>
  );
};

function MarkerGraphic({ marker, target }: { marker: Marker; target: Point }) {
  const angle = Math.atan2(target.y - marker.y, target.x - marker.x);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // 实心三角形：尖端指向宝藏。
  const tipDist = MARKER_R - 8;
  const baseDist = tipDist - 12;
  const halfW = 6;
  const tip = { x: marker.x + tipDist * cos, y: marker.y + tipDist * sin };
  const b1 = { x: marker.x + baseDist * cos - halfW * sin, y: marker.y + baseDist * sin + halfW * cos };
  const b2 = { x: marker.x + baseDist * cos + halfW * sin, y: marker.y + baseDist * sin - halfW * cos };

  return (
    <g>
      <circle cx={marker.x} cy={marker.y} r={MARKER_R} fill="#ffffff" fillOpacity={0.85} stroke="#4f6ef7" strokeWidth={3} />
      <polygon points={`${tip.x},${tip.y} ${b1.x},${b1.y} ${b2.x},${b2.y}`} fill="#4f6ef7" />
    </g>
  );
}
