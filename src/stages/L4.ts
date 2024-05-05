import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Key } from '@/ts/KeyPress';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { enumerate, genArray } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _ from 'lodash';
import { drawRect } from '@/ts/Line';
import { Config } from '@/ts/Config';
import { BlockValue } from '@/ts/Block';

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

class Frac {
  f: number;
  u: number;
  d: number;
  constructor(u: number, d: number, f: number) {
    this.u = u;
    this.d = d;
    this.f = f;
    this.init();
  }
  init() {
    this.f *= (this.u < 0) !== (this.d < 0) ? -1 : 1;
    this.u = Math.abs(this.u);
    this.d = Math.abs(this.d);
    if (this.u === 0 && this.d === 0) { return; }
    if (this.u === 0) { this.d = 1; }
    if (this.d === 0) { this.u = 1; }
    if (this.u !== 0 && this.d !== 0) {
      const x = gcd(this.u, this.d);
      this.u /= x;
      this.d /= x;
    }
  }
  static add(a: Frac, b: Frac): Frac {
    return new Frac(a.f * a.u * b.d + b.f * b.u * a.d, a.d * b.d, 1);
  }
  static sub(a: Frac, b: Frac): Frac {
    return new Frac(a.f * a.u * b.d - b.f * b.u * a.d, a.d * b.d, 1);
  }
  static mul(a: Frac, b: Frac): Frac {
    return new Frac(a.u * b.u, a.d * b.d, a.f * b.f);
  }
  static div(a: Frac, b: Frac): Frac {
    return new Frac(a.u * b.d, a.d * b.u, a.f * b.f);
  }
  static compare(a: Frac, b: Frac): number {
    return a.u * a.f * b.d - b.u * b.f * a.d;
  }
  toString(): string {
    let res = '';
    if (this.u === 0 && this.d === 0) {
      res = '★';
    } else if (this.d === 0) {
      res = (this.f === 1 ? '+' : '-') + '∞';
    } else {
      if (this.f === -1) { res += '-'; }
      res += this.u.toString();
      if (this.d !== 1) { res += '/' + this.d.toString(); }
    }
    return res;
  }
}

export default class extends Grid {
  tag: boolean[];
  arrow: number;
  nums: number[];
  opts: number[];
  lhs: [number | null, number | null, number | null];
  rhs: number;
  fracs: (Frac | undefined)[];

  update() {
    const arrowAvailable = _.every(this.lhs, (x) => (x !== null));
    this.nums.sort((x, y) => Frac.compare(this.fracs[x] as Frac, this.fracs[y] as Frac));
    this.opts = _.sortBy(this.opts, (x) => x);

    for (let [i, num] of enumerate(this.nums)) {
      this.get(num).pos = new Vec(1, i + (5 - this.nums.length) / 2);
      this.get(num).value.set(this.fracs[num]?.toString() ?? '');
      this.get(num).clickable = (this.lhs[0] === null || this.lhs[2] === null);
    }
    for (let [i, opt] of enumerate(this.opts)) {
      this.get(opt).pos = new Vec(2, i + (5 - this.opts.length) / 2);
      this.get(opt).clickable = (this.lhs[1] === null);
    }
    for (let [i, item] of enumerate(this.lhs)) {
      if (item !== null) {
        this.get(item).pos = new Vec(0, i);
        this.get(item).clickable = true;
        if (i !== 1) {
          this.get(item).value.set(this.fracs[item]?.toString() ?? '');
        }
      }
    }

    this.get(this.rhs).pos = new Vec(0, 4);
    this.get(this.rhs).opacity = +arrowAvailable;
    this.get(this.rhs).clickable = arrowAvailable;
    if (arrowAvailable) {
      let opt = Frac.div;
      const optStr = this.get(this.lhs[1] as number).value.value;
      if (optStr === '+') {
        opt = Frac.add;
      } else if (optStr === '-') {
        opt = Frac.sub;
      } else if (optStr === '×') {
        opt = Frac.mul;
      }
      this.fracs[this.rhs] = opt(
        this.fracs[this.lhs[0] as number] as Frac,
        this.fracs[this.lhs[2] as number] as Frac
      );
      this.get(this.rhs).value.set(this.fracs[this.rhs]?.toString() ?? '');
    } else {
      this.fracs[this.rhs] = undefined;
      this.get(this.rhs).value.set('');
    }
    if (this.nums.length === 1 && this.get(this.nums[0]).value.value === '24' && _.every(this.lhs, (x) => x === null)) {
      this.footer.tasks[0].set(1);
    }
  }
  constructor(page: Page) {
    super({ n: 3, m: 5, page, noBlock: true });
    this.tag = genArray(this.size, () => false);
    this.header.message = '24 点';
    this.footer.load([
      [0, 1, Task.eq],
    ]);
    this.nums = [];
    this.opts = [];
    this.lhs = [null, null, null];
    this.fracs = [];
    const initNums = (Math.random() < 0.5 ? [1, 5, 5, 5] : [3, 3, 7, 7]);
    for (let i of _.range(4)) {
      const id = this.puzzle.addBlock({
        background: Color.grey,
      }).id;
      this.nums.push(id);
      this.fracs[id] = new Frac(initNums[i], 1, 1);
    }
    for (let i of _.range(4)) {
      this.opts.push(this.puzzle.addBlock({
        background: Color.grey,
        value: new BlockValue(['+', '-', '×', '÷'][i])
      }).id);
    }
    this.arrow = this.puzzle.addBlock({
      background: Color.white,
      value: new BlockValue('='),
      pos: new Vec(0, 3)
    }).id;
    this.rhs = this.puzzle.addBlock({
      background: Color.grey,
      opacity: 0
    }).id;

    for (let i of _.range(3)) {
      drawRect(this.puzzle.lines,
        Config.blockGap + 1,
        Config.blockGap + i * Config.blockSize + 1,
        Config.blockSize - 1,
        Config.blockSize * (i + 1) - 1,
        {
          width: 2,
          color: Color.blue
        });
    }

    this.update();
  }
  do_click_rhs() {
    if (this.fracs[this.rhs]?.toString() === '★') {
      this.bonus.do_show("这不是一个数");
    }
    this.get(this.lhs[0] as number).opacity = 0;
    this.get(this.lhs[2] as number).opacity = 0;
    this.opts.push(this.lhs[1] as number);
    this.nums.push(this.rhs);
    this.rhs = this.puzzle.addBlock({
      background: Color.grey,
      opacity: 0
    }).id;
    this.lhs = [null, null, null];
  }
  do_click(id: number) {
    const { x, y } = this.getVec(id);
    if (this.lhs[0] === null || this.lhs[2] === null) {
      const index = this.nums.findIndex((x) => x === id);
      if (index !== -1) {
        if (this.lhs[0] === null) {
          this.lhs[0] = this.nums[index];
        } else {
          this.lhs[2] = this.nums[index];
        }
        this.nums.splice(index, 1);
        return;
      }
    }
    if (this.lhs[1] === null) {
      const index = this.opts.findIndex((x) => x === id);
      if (index !== -1) {
        this.lhs[1] = this.opts[index];
        this.opts.splice(index, 1);
        return;
      }
    }
    {
      const index = this.lhs.findIndex((x) => x === id);
      if (index !== -1) {
        if (index % 2 === 0) {
          this.nums.push(this.lhs[index] as number);
        } else {
          this.opts.push(this.lhs[index] as number);
        }
        this.lhs[index] = null;
        return;
      }
    }
    if (this.rhs === id) {
      this.do_click_rhs();
      return;
    }
  }
  click(id: number) {
    this.do_click(id);
    this.update();
  }
  keyPress(key: Key) {
    const work = (optStr: string) => {
      if (this.lhs[1] !== null) {
        this.opts.push(this.lhs[1] as number);
        this.lhs[1] = null;
      }
      for (let i of _.range(this.opts.length)) {
        if (this.get(this.opts[i]).value.value === optStr) {
          this.lhs[1] = this.opts[i];
          this.opts.splice(i, 1);
          break;
        }
      }
    };
    if (key.isAdd()) { work('+'); }
    if (key.isSub()) { work('-'); }
    if (key.isMul()) { work('×'); }
    if (key.isDiv()) { work('÷'); }
    if (key.isEnter() || key.isEqual()) {
      const arrowAvailable = _.every(this.lhs, (x) => (x !== null));
      if (arrowAvailable) {
        this.do_click_rhs();
      }
    }
    this.update();
  }
}
