import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray, random } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _ from 'lodash';

export default class extends Grid {
  t1: number;
  t2: number;
  constructor(page: Page) {
    super({ n: 7, m: 11, page });
    this.header.message = '寻宝';
    this.footer.load([
      [0, 2, Task.eq],
      [0, 12, Task.leIncreasing],
    ]);
    for (let i of _.range(this.size)) {
      this.get(i).clickable = true;
      this.get(i).background = Color.grey;
    }
    this.t1 = random(this.size);
    this.t2 = random(this.size);
    while (Vec.sub(this.getVec(this.t1), this.getVec(this.t2)).min() <= 3) {
      this.t1 = random(this.size);
      this.t2 = random(this.size);
    }
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    this.get(id).clickable = false;
    this.footer.tasks[1].add(1);
    if (id == this.t1 || id == this.t2) {
      this.get(id).background = Color.yellow;
      this.get(id).value.set('★');
      this.footer.tasks[0].add(1);
    } else {
      this.get(id).background = Color.green;
      this.get(id).value.set(
        Vec.sub(this.getVec(this.t1), this.getVec(id)).sum()
        + Vec.sub(this.getVec(this.t2), this.getVec(id)).sum()
      );
    }
  }
}