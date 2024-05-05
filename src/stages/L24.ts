import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray, near4 } from '@/ts/Tools';
import _ from 'lodash';

export default class extends Grid {
  tag: boolean[];
  constructor(page: Page) {
    super({ n: 6, m: 6, page });
    this.tag = genArray(this.size, () => false);
    this.header.message = '数间';
    this.footer.load([
      [0, 12, Task.ge],
      [1, 1, Task.eq]
    ]);
    this.update();
  }
  update() {
    let start = -1;
    for (let i of _.range(this.size)) {
      if (start == -1 && !this.tag[i]) {
        start = i;
      }
      this.get(i).value.set('');
      this.get(i).background = this.tag[i] ? Color.blue : Color.grey;
      this.get(i).clickable = _.sumBy(
        near4(this.getVec(i)),
        v => +(this.inArea(v) && this.tag[this.getId(v)])
      ) === 0;
    }
    const queue = [start];
    const vis = genArray(this.size, () => false);
    vis[start] = true;
    while (queue.length > 0) {
      const x = this.getVec(queue[0]);
      queue.shift();
      for (let p of near4(x)) {
        const pid = this.getId(p);
        if (this.inArea(p) && !vis[pid] && !this.tag[pid]) {
          vis[pid] = true;
          queue.push(pid);
        }
      }
    }
    let flag = _.sumBy(_.range(this.size), i => +(!vis[i] && !this.tag[i])) === 0;
    if (!flag) {
      for (let i of _.range(this.size)) {
        if (vis[i]) {
          this.get(i).value.set('×');
        }
      }
    }
    this.footer.tasks[1].set(+flag);
    this.footer.tasks[0].set(_.sumBy(this.tag, x => +x));
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    this.tag[id] = !this.tag[id];
    this.update();
  }
}
