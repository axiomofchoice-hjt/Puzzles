export class Task {
  now: number;
  readonly max: number;
  readonly check: (now: number, max: number) => number;
  constructor(now: number, max: number, check: (now: number, max: number) => number) {
    this.now = now;
    this.max = max;
    this.check = check;
  }
  add(k: number) {
    this.now += k;
  }
  set(k: number) {
    this.now = k;
  }
  ok(): boolean {
    return this.check(this.now, this.max) === 1;
  }
  fail(): boolean {
    return this.check(this.now, this.max) === -1;
  }
  static readonly eq = (x: number, n: number) => (x === n ? 1 : 0);
  static readonly ge = (x: number, n: number) => (x >= n ? 1 : 0);
  static readonly le = (x: number, n: number) => (x <= n ? 1 : 0);
  static readonly leIncreasing = (x: number, n: number) => (x <= n ? 1 : -1);
}
