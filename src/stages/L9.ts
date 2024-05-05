import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray } from '@/ts/Tools';
import _ from 'lodash';

export default class extends Grid {
  tag: number[];
  constructor(page: Page) {
    super({ n: 3, m: 4, page });
    this.tag = genArray(this.size, () => 2);
    this.header.message = '点灯';
    this.footer.load([
      [0, 12, Task.eq],
    ]);
    for (let id of _.range(this.size)) {
      let [x, y] = this.getXY(id);
      this.get(id).value.set((x + y) % 2 !== 0 ? '+' : '-');
      this.get(id).clickable = true;
      this.get(id).background = Color.yellow;
    }
  }
  click(id: number) {
    const {x, y} = this.getVec(id);
    this.footer.tasks[0].add(1);

    this.tag[id] = 0;
    this.get(id).clickable = false;
    this.get(id).opacity = 0;

    for (let ptr of _.range(this.size)) {
      let [i, j] = this.getXY(ptr);
      if (Math.abs(i - x) <= 1 && Math.abs(j - y) <= 1 && this.tag[ptr] !== 0) {
        if ((x + y) % 2 !== 0) {
          this.tag[ptr] = 2;
          this.get(ptr).background = Color.yellow;
          this.get(ptr).clickable = true;
        } else {
          this.tag[ptr] = 1;
          this.get(ptr).background = Color.grey;
          this.get(ptr).clickable = false;
        }
      }
    }
  }
}
