import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _, { takeRight } from 'lodash';

export default class extends Grid {
  tag: number[];
  constructor(page: Page) {
    super({ n: 1, m: 7, page });
    this.tag = [0, 1, 2, 3, 4, 5, 6];
    this.header.message = '交换';
    this.footer.load([
      [0, 1, Task.eq],
      [0, 1, Task.eq],
      [0, 1, Task.eq],
      [0, 1, Task.eq],
      [0, 1, Task.eq],
      [0, 1, Task.eq],
      [0, 1, Task.eq],
    ]);

    while (_.sumBy(_.range(this.size - 1),
      (i) => +(Math.abs(this.tag[i] - this.tag[i + 1]) === 1))) {
      this.tag = _.shuffle(this.tag);
    }

    for (let i of _.range(this.size)) {
      this.get(i).clickable = true;
      this.get(i).background = Color.grey;
      this.get(i).value.set(i + 1);
    }
    this.update();
  }
  update() {
    for (let i of _.range(this.size)) {
      this.get(this.tag[i]).pos = new Vec(0, i);
      this.footer.tasks[i].set(+(this.tag[i] === i));
    }
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    const pos = this.tag.findIndex(x => x === id);
    this.tag = this.tag.slice(pos + 1).concat(this.tag.slice(pos, pos + 1).concat(this.tag.slice(0, pos)));
    this.update();
  }
}