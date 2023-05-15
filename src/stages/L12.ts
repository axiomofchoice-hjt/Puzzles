import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Key } from '@/ts/KeyPress';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray, rangeMatrix } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _ from 'lodash';

export default class extends Grid {
  tag: boolean[];
  constructor(page: Page) {
    super({ n: 7, m: 8, page });
    this.tag = genArray(this.size, () => false);
    this.header.message = '十字';
    this.footer.load([
      [0, 1, Task.eq],
      [0, 8, Task.le],
    ]);
    for (let i of _.range(this.size)) {
      this.get(i).clickable = true;
    }
    this.update();
  }
  update() {
    for (let i of _.range(this.size)) {
      this.get(i).background = (this.tag[i]
        ? Color.green
        : Color.grey);
    }
    this.footer.tasks[1].set(_.sumBy(this.tag, (x) => +x));
    this.footer.tasks[0].set(1);
    for (let [x, y] of rangeMatrix(this.n, this.m)) {
      let flag = true;
      for (let [px, py] of [[x, y], [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (!this.inArea(px, py) || this.tag[this.getId(px, py)]) {
          flag = false;
        }
      }
      if (flag) {
        for (let [px, py] of [[x, y], [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
          this.get(px, py).background = Color.yellow;
        }
        this.footer.tasks[0].set(0);
        break;
      }
    }
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    this.tag[id] = !this.tag[id];
    this.update();
  }
}
/**
 * answer:
 * ........
 * ..x..x..
 * ....x...
 * .x....x.
 * ...x....
 * ..x..x..
 * ........
 */