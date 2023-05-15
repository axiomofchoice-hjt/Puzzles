import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { enumerate, genArray } from '@/ts/Tools';
import _ from 'lodash';

export default class extends Grid {
  tag: boolean[];
  constructor(page: Page) {
    super({ n: 8, m: 11, page });
    this.tag = genArray(this.size, () => true);
    this.header.message = '直径';
    this.footer.load([
      [0, 54, Task.ge],
    ]);
    for (let i of _.range(this.size)) {
      this.get(i).clickable = true;
      this.get(i).background = Color.grey;
    }
    for (let i of [0, 1, 11, 76, 86, 87]) {
      this.get(i).clickable = false;
      this.get(i).opacity = 0;
      this.tag[i] = false;
    }
    this.update();
  }
  getLongestFrom(start: number): number[] {
    let queue = [start];
    let dis = genArray(this.size, () => -1);
    let last = genArray(this.size, () => -1);
    dis[start] = 0;
    while (queue.length > 0) {
      const id = queue[0];
      const {x, y} = this.getVec(id);
      queue.shift();
      for (let [px, py] of [[x, y + 1], [x + 1, y], [x, y - 1], [x - 1, y]]) {
        const pid = this.getId(px, py);
        if (this.inArea(px, py) && this.tag[pid] && dis[pid] === -1) {
          dis[pid] = dis[id] + 1;
          last[pid] = id;
          queue.push(pid);
        }
      }
    }
    let end = start;
    for (let i of _.range(this.size)) {
      if (dis[end] < dis[i]) {
        end = i;
      }
    }
    let res = [];
    while (end !== -1) {
      res.push(end);
      end = last[end];
    }
    res.reverse();
    return res;
  }
  update() {
    let longest: number[] = [];
    for (let i of _.range(this.size)) {
      if (this.tag[i]) {
        const now = this.getLongestFrom(i);
        if (now.length > longest.length) {
          longest = now;
        }
      }
    }
    for (let i of _.range(this.size)) {
      this.get(i).value.set('');
    }
    for (let [i, id] of enumerate(longest)) {
      this.get(id).value.set((i + 1).toString());
    }
    this.footer.tasks[0].set(longest.length);
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    this.tag[id] = !this.tag[id];
    this.get(id).background = this.tag[id] ? Color.grey : Color.green;
    this.update();
  }
}