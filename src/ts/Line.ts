import { Color } from '@/ts/Color';
import { Vec } from '@/ts/Vec';

export class Line {
  id: number;
  pos: [Vec, Vec];
  color: Color;
  width: number;
  opacity: number;
  show: boolean;
  constructor(id: number, options?: {
    pos?: [Vec, Vec],
    color?: Color;
    width?: number,
    opacity?: number,
    show?: boolean,
  }) {
    this.id = id;
    this.pos = options?.pos ?? [new Vec(0, 0), new Vec(0, 0)];
    this.color = options?.color ?? Color.black;
    this.width = options?.width ?? 1;
    this.opacity = options?.opacity ?? 1;
    this.show = options?.show ?? true;
  }
}

export function drawRect(lines: Line[],
  x1: number, y1: number, x2: number, y2: number,
  options?: {
    color?: Color;
    width?: number,
    opacity?: number,
    show?: boolean;
  }) {
  for (let [i, j] of [[0, 1], [1, 3], [3, 2], [2, 0]]) {
    lines.push(new Line(lines.length, {
      pos: [
        new Vec([x1, x2][i >> 1], [y1, y2][i & 1]),
        new Vec([x1, x2][j >> 1], [y1, y2][j & 1])
      ],
      ...options
    }));
  }
};
