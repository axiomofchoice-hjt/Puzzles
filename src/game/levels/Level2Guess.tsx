import { useCallback, useEffect, useState, type CSSProperties } from "react";
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
const STAR = CELL * 0.32;  // 命中五角星尺寸

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

/** inactive 项目(Blockchallenge)的五角星图形，viewBox 1024x1024。 */
const STAR_PATH =
  "M781.186088 616.031873q17.338645 80.573705 30.59761 145.848606 6.119522 27.537849 11.219124 55.075697t9.689243 49.976096 7.649402 38.247012 4.079681 19.888446q3.059761 20.398406-9.179283 27.027888t-27.537849 6.629482q-5.099602 0-14.788845-3.569721t-14.788845-5.609562l-266.199203-155.027888q-72.414343 42.836653-131.569721 76.494024-25.498008 14.278884-50.486056 28.557769t-45.386454 26.517928-35.187251 20.398406-19.888446 10.199203q-10.199203 5.099602-20.908367 3.569721t-19.378486-7.649402-12.749004-14.788845-2.039841-17.848606q1.01992-4.079681 5.099602-19.888446t9.179283-37.737052 11.729084-48.446215 13.768924-54.055777q15.298805-63.23506 34.677291-142.788845-60.175299-52.015936-108.111554-92.812749-20.398406-17.338645-40.286853-34.167331t-35.697211-30.59761-26.007968-22.438247-11.219124-9.689243q-12.239044-11.219124-20.908367-24.988048t-6.629482-28.047809 11.219124-22.438247 20.398406-10.199203l315.155378-28.557769 117.290837-273.338645q6.119522-16.318725 17.338645-28.047809t30.59761-11.729084q10.199203 0 17.848606 4.589641t12.749004 10.709163 8.669323 12.239044 5.609562 10.199203l114.231076 273.338645 315.155378 29.577689q20.398406 5.099602 28.557769 12.239044t8.159363 22.438247q0 14.278884-8.669323 24.988048t-21.928287 26.007968z";

/* inactive 的 Color 取值 */
const GREY = "#d3d3d3";
const BLUE = "#00bfff";
const YELLOW = "#ffd700";
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
        let fill = GREY;
        if (r === "high" || r === "low") fill = BLUE;
        else if (r === "found") fill = YELLOW;
        const spinning = r === "high" || r === "low";
        const spinStyle = spinning
          ? ({
              "--b": r === "high" ? "180deg" : "-180deg",
              transform: "rotate(var(--b))",
            } as CSSProperties)
          : undefined;
        return (
          <g key={i} className={spinning ? "block-spin" : undefined} style={spinStyle}>
            <rect
              x={x}
              y={y}
              width={CELL}
              height={CELL}
              fill={fill}
              className={!r ? "block-hover" : undefined}
            />
            {spinning && (
              <svg
                x={x + (CELL - ARROW) / 2}
                y={y + (CELL - ARROW) / 2}
                width={ARROW}
                height={ARROW}
                viewBox="0 0 1024 1024"
              >
                <g
                  className="arrow-fixed"
                  style={{ "--a": r === "high" ? "270deg" : "90deg" } as CSSProperties}
                >
                  <path d={ARROW_PATH} fill={TEXT} />
                </g>
              </svg>
            )}
            {r === "found" && (
              <svg
                x={x + (CELL - STAR) / 2}
                y={y + (CELL - STAR) / 2}
                width={STAR}
                height={STAR}
                viewBox="0 0 1024 1024"
              >
                <path d={STAR_PATH} fill={TEXT} />
              </svg>
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
