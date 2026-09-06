import { useCallback, useEffect, useState } from "react";
import type { MouseEvent } from "react";
import type { LevelComponent } from "../types";

/** 数字范围 1..N（0..COUNT-1），外加最后一块空白格，共 COLS*ROWS 格。 */
const COUNT = 31;
const COLS = 8;
const ROWS = 4;
const TOTAL = COLS * ROWS; // 32

/** 最多允许的点击次数。 */
const LIMIT = 5;

const W = 800;
const H = 520;
const CELL = 72;
const GAP = Math.round(CELL * (8 / 92)); // inactive: BlockGap(8) 相对 BlockSize(92) 的比例
const FONT = CELL * 0.425; // inactive: 数字字号 = 块尺寸 * 0.425
const ARROW = CELL * 0.5;  // inactive: svgRelativeSize = 0.5

/** 网格水平/垂直居中于画布。 */
const GRID_W = COLS * CELL + (COLS - 1) * GAP;
const GRID_H = ROWS * CELL + (ROWS - 1) * GAP;
const START = { x: (W - GRID_W) / 2, y: (H - GRID_H) / 2 };

const cellXY = (i: number) => ({
  x: START.x + (i % COLS) * (CELL + GAP),
  y: START.y + Math.floor(i / COLS) * (CELL + GAP),
});

/** inactive 项目(Blockchallenge)的箭头图形，viewBox 1024x1024，默认朝上。 */
const ARROW_PATH =
  "M554.666667 268.8v601.6h-85.333334V268.8L337.066667 401.066667 277.333333 341.333333 512 106.666667 746.666667 341.333333l-59.733334 59.733334L554.666667 268.8z";

/* inactive 的 Color 取值 */
const GREY = "#d3d3d3";
const YELLOW = "#ffd700";
const BLUE = "#00bfff";
const RED = "#ff6347";
const WHITE = "#ffffff";
const TEXT = "#000000";

type Reveal = "high" | "low" | "found" | null;

export const Level2Guess: LevelComponent = ({ setHud, setDone }) => {
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(COUNT - 1);
  const [reveal, setReveal] = useState<Reveal[]>(() => Array(COUNT).fill(null));
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    setHud(clicks, LIMIT);
  }, [clicks, setHud]);

  const handleClick = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const p = {
        x: (e.clientX - rect.left) * (W / rect.width),
        y: (e.clientY - rect.top) * (H / rect.height),
      };
      // 命中某个还没被翻开的数字格（0..COUNT-1；最后一块空白格不可点）。
      let id = -1;
      for (let i = 0; i < COUNT; i++) {
        if (reveal[i]) continue;
        const { x, y } = cellXY(i);
        if (p.x >= x && p.x <= x + CELL && p.y >= y && p.y <= y + CELL) {
          id = i;
          break;
        }
      }
      if (id < 0) return;

      setClicks((c) => c + 1);
      const mark = (m: Exclude<Reveal, null>) =>
        setReveal((prev) => {
          const next = [...prev];
          next[id] = m;
          return next;
        });

      // 收敛到唯一一格：命中答案。
      if (id === lo && id === hi) {
        mark("found");
        setDone(true);
        return;
      }

      const mid = lo + hi;
      // 点得太低 → 答案更大（向右）；太高 → 答案更小（向左）。
      if ((id * 2 === mid && Math.random() < 0.5) || id * 2 < mid) {
        mark("high");
        if (id >= lo && id <= hi) setLo(id + 1);
      } else {
        mark("low");
        if (id >= lo && id <= hi) setHi(id - 1);
      }
    },
    [lo, hi, reveal, setDone],
  );

  return (
    <svg
      className="board"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      onClick={handleClick}
    >
      <rect x={0} y={0} width={W} height={H} fill={WHITE} />

      {Array.from({ length: TOTAL }, (_, i) => {
        const { x, y } = cellXY(i);
        const cx = x + CELL / 2;
        const cy = y + CELL / 2;
        // 最后一块空白格（不可点、无内容）。
        if (i === COUNT) {
          return <rect key={i} x={x} y={y} width={CELL} height={CELL} fill={WHITE} />;
        }
        const r = reveal[i];
        const arrowSize = ARROW;
        let fill = GREY;
        if (r === "high") fill = YELLOW;
        else if (r === "low") fill = BLUE;
        else if (r === "found") fill = RED;
        const spinning = r === "high" || r === "low";
        return (
          <g
            key={i}
            className={spinning ? "block-spin" : undefined}
            style={
              spinning
                ? ({
                    "--b": r === "high" ? "180deg" : "-180deg",
                    transform: "rotate(var(--b))",
                  } as React.CSSProperties)
                : undefined
            }
          >
            <rect x={x} y={y} width={CELL} height={CELL} fill={fill} />
            {spinning && (
              <svg
                x={x + (CELL - arrowSize) / 2}
                y={y + (CELL - arrowSize) / 2}
                width={arrowSize}
                height={arrowSize}
                viewBox="0 0 1024 1024"
              >
                <g
                  className="arrow-fixed"
                  style={{ "--a": r === "high" ? "270deg" : "90deg" } as React.CSSProperties}
                >
                  <path d={ARROW_PATH} fill={TEXT} />
                </g>
              </svg>
            )}
            {r === "found" && (
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={FONT} fontWeight={700} fill={TEXT}>
                ok
              </text>
            )}
            {!r && (
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={FONT} fill={TEXT}>
                {i + 1}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
