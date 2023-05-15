import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray, near4 } from '@/ts/Tools';
import _ from 'lodash';

export default class extends Grid {
  tag: number[];
  constructor(page: Page) {
    super({ n: 4, m: 6, page });
    this.tag = [
      -1, -1, 2, -1, -1, -1,
      2, 2, 2, 2, 2, 2,
      -1, 2, 2, -1, 2, 2,
      -1, -1, 2, -1, -1, -1
    ];
    this.header.message = '水滴';
    this.footer.load([
      [0, 12, Task.eq],
    ]);
    this.update();
  }
  update() {
    for (let i of _.range(this.size)) {
      if (this.tag[i] === -1) {
        this.get(i).opacity = 0;
      } else if (this.tag[i] === 0) {
        this.get(i).background = Color.grey;
        this.get(i).value.set(this.tag[i]);
        this.get(i).clickable = false;
      } else {
        this.get(i).background = Color.yellow;
        this.get(i).value.set(this.tag[i]);
        this.get(i).clickable = true;
      }
    }
    this.footer.tasks[0].set(_.sumBy(this.tag, x => +(x == 0)));
  }
  click(id: number) {
    // const { x, y } = this.getVec(id);
    if (this.tag[id] === 1) {
      this.tag[id] = 2;
    } else if (this.tag[id] === 4) {
      this.tag[id] = 0;
    } else {
      this.tag[id] = 0;
      for (let p of near4(this.getVec(id))) {
        if (this.inArea(p) && this.tag[this.getId(p)] !== -1) {
          this.tag[this.getId(p)] = Math.min(4, this.tag[this.getId(p)] + 1);
        }
      }
    }
    this.update();
  }
}