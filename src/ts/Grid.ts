import type { Block } from './Block';
import type { Puzzle } from './Puzzle';
import { Config } from './Config';
import { Vec } from './Vec';
import type { Stage } from './Stage';
import type { Footer } from './Footer';
import type { Header } from './Header';
import type { Page } from './Page';
import type { Key } from './KeyPress';
import _ from 'lodash';
import type { Bonus } from './Bonus';

export class Grid implements Stage {
  readonly n: number;
  readonly m: number;
  readonly puzzle: Puzzle;
  readonly header: Header;
  readonly footer: Footer;
  readonly bonus: Bonus;
  constructor(props: {
    n: number, m: number, page: Page, noBlock?: boolean, blockInnerSize?: number;
  }) {
    this.n = props.n;
    this.m = props.m;
    this.puzzle = props.page.puzzle;
    this.header = props.page.header;
    this.footer = props.page.footer;
    this.bonus = props.page.bonus;

    this.puzzle.width = Config.blockSize * this.m + Config.blockGap;
    this.puzzle.height = Config.blockSize * this.n + Config.blockGap;

    this.puzzle.blocks.splice(0);
    if (!props.noBlock) {
      for (let i of _.range(this.size)) {
        this.puzzle.addBlock({
          size: props.blockInnerSize,
          pos: this.getVec(i)
        });
      }
    }
  }
  get size(): number {
    return this.n * this.m;
  }
  get(x: number | Vec, y?: number): Block {
    return this.puzzle.blocks[this.getId(x, y)];
  }
  getId(x: number | Vec, y?: number): number {
    if (_.isNumber(x) && _.isUndefined(y)) {
      return x;
    } else if (typeof x === 'number' && typeof y === 'number') {
      return x * this.m + y;
    } else if (x instanceof Vec && typeof y === 'undefined') {
      return x.x * this.m + x.y;
    } else {
      throw 'getId error';
    }
  }
  getXY(id: number): [number, number] {
    return [Math.floor(id / this.m), id % this.m];
  }
  getVec(id: number): Vec {
    return new Vec(Math.floor(id / this.m), id % this.m);
  }
  click(id: number) {
    throw "no click impl";
  }
  keyPress(key: Key) {
    // do nothing
  }
  inArea(x: number | Vec, y?: number): boolean {
    if (typeof x === 'number' && typeof y === 'number') {
      return _.inRange(x, 0, this.n) && _.inRange(y, 0, this.m);
    } else if (x instanceof Vec && typeof y === 'undefined') {
      return _.inRange(x.x, 0, this.n) && _.inRange(x.y, 0, this.m);
    } else {
      throw "inArea error";
    }
  }
}
