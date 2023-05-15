import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray } from '@/ts/Tools';
import _ from 'lodash';

export default class extends Grid {
  tag: number[];
  constructor(page: Page) {
    super({ n: 4, m: 5, page });
    this.tag = genArray(this.size, () => 0);
    page.buttons.setTip("点击蓝色方块会发生什么？");
    page.header.message = '填充';
    page.footer.load([
      [0, 20, Task.ge],
      [0, 3, Task.leIncreasing]
    ]);
    for (let i of _.range(this.size)) {
      this.get(i).clickable = true;
      this.get(i).background = Color.grey;
    }
  }
  click(id: number) {
    const { x, y } = this.getVec(id);
    this.footer.tasks[1].add(1);
    const tag = this.tag[id];
    for (let p of _.range(this.size)) {
      let { x: px, y: py } = this.getVec(p);
      if (tag === 0 && (px === x || py === y)) {
        this.get(p).background = Color.blue;
        this.get(p).clickable = true;
        this.tag[p] = 1;
      } else if (tag === 1 && Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1) {
        this.get(p).background = Color.yellow;
        this.get(p).clickable = false;
        this.tag[p] = 2;
      }
    }
    this.footer.tasks[0].set(
      _.sumBy(this.tag, (x) => +(x !== 0))
    );
  }
}