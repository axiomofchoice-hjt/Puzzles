import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray } from '@/ts/Tools';
import _ from 'lodash';

export default class extends Grid {
  tag: boolean[];
  constructor(page: Page) {
    super({ n: 7, m: 7, page });
    this.tag = genArray(this.size, () => false);
    this.header.message = '光';
    this.footer.load([
      [0, 13, Task.ge],
      [0, 13, Task.ge],
      [49, 13, Task.ge]
    ]);
    for (let i of _.range(this.size)) {
      this.get(i).clickable = true;
      this.get(i).background = Color.yellow;
    }
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    this.tag[id] = !this.tag[id];
    this.footer.tasks[0].set(0);
    this.footer.tasks[1].set(0);
    this.footer.tasks[2].set(0);

    let vis = genArray(this.size, () => false);

    for (let j of _.range(this.m)) {
      for (let i of _.range(this.n)) {
        let ptr = this.getId(i, j);
        if (this.tag[ptr]) { break; }
        if (!vis[ptr]) {
          vis[ptr] = true;
          this.get(ptr).background = Color.yellow;
          this.footer.tasks[2].add(1);
        }
      }
    }
    for (let i of _.range(this.n)) {
      for (let j of _.range(this.m)) {
        let ptr = this.getId(i, j);
        if (this.tag[ptr]) { break; }
        if (!vis[ptr]) {
          vis[ptr] = true;
          this.get(ptr).background = Color.blue;
          this.footer.tasks[1].add(1);
        }
      }
    }
    for (let i of _.range(this.size)) {
      if (!vis[i]) {
        this.get(i).background = this.tag[i] ? Color.black : Color.grey;
        this.footer.tasks[0].add(+!this.tag[i]);
      }
    }
  }
}