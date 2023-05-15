export class Vec {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  static add(v1: Vec, v2: Vec): Vec {
    return new Vec(v1.x + v2.x, v1.y + v2.y);
  }
  static sub(v1: Vec, v2: Vec): Vec {
    return new Vec(v1.x - v2.x, v1.y - v2.y);
  }
  static mul(v: Vec, k: number): Vec {
    return new Vec(v.x * k, v.y * k);
  }
  sum(): number {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  max(): number {
    return Math.max(this.x, this.y);
  }
  min(): number {
    return Math.min(this.x, this.y);
  }
  static equal(v1: Vec, v2: Vec): boolean {
    return v1.x == v2.x && v1.y == v2.y;
  }
  static isVec(x: any): boolean {
    return x instanceof Vec;
  }
  clone(): Vec {
    return new Vec(this.x, this.y);
  }
  static readonly zero = new Vec(0, 0);
}