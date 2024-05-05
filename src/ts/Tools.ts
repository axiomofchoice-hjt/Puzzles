import { Vec } from './Vec';

export function genArray<T>(n: number, el: (id: number) => T): T[] {
  const res: T[] = [];
  for (let i = 0; i < n; i++) {
    res.push(el(i));
  }
  return res;
}

export function random(n: number): number {
  return Math.floor(Math.random() * n);
}

export function rangeMatrix(n: number, m: number): Iterable<[number, number]> {
  return {
    *[Symbol.iterator]() {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
          yield [i, j];
        }
      }
    }
  };
}

export function enumerate<T>(it: Iterable<T>): Iterable<[number, T]> {
  return {
    *[Symbol.iterator]() {
      let index = 0;
      for (let item of it) {
        yield [index, item];
        index++;
      }
    }
  };
}

export function near4(v: Vec): Vec[] {
  return [
    new Vec(v.x - 1, v.y),
    new Vec(v.x, v.y + 1),
    new Vec(v.x + 1, v.y),
    new Vec(v.x, v.y - 1),
  ];
}

export function near8(v: Vec): Vec[] {
  return [
    new Vec(v.x - 1, v.y),
    new Vec(v.x - 1, v.y + 1),
    new Vec(v.x, v.y + 1),
    new Vec(v.x + 1, v.y + 1),
    new Vec(v.x + 1, v.y),
    new Vec(v.x + 1, v.y - 1),
    new Vec(v.x, v.y - 1),
    new Vec(v.x - 1, v.y - 1),
  ];
}
