import { Color } from '@/ts/Color';
import { Config } from '@/ts/Config';
import { Grid } from '@/ts/Grid';
import { Line } from '@/ts/Line';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _ from 'lodash';

export default class extends Grid {
  tag: number[];
  constructor(page: Page) {
    super({ n: 7, m: 7, page });
    this.tag = genArray(this.size, () => 0);
    this.header.message = '对称';
    this.footer.load([
      [0, 12, Task.ge],
    ]);
    for (let i of _.range(1, 6)) {
      this.tag[this.getId(0, i)] = -1;
      this.tag[this.getId(i, 0)] = -1;
      this.tag[this.getId(6, i)] = -1;
      this.tag[this.getId(i, 6)] = -1;
    }
    this.tag[this.getId(3, 3)] = -1;
    this.update();
  }
  dfs(id: number, vis: boolean[], rec: number[], nextTag: number[]) {
    let [x, y] = this.getXY(id);
    if (vis[id]) return false;
    vis[id] = true; rec.push(id);
    let flag = false;
    for (let [px, py] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (this.inArea(px, py)) {
        let ptr = this.getId(px, py);
        if (nextTag[ptr] === 0) {
          flag = true;
        }
        if (nextTag[ptr] === nextTag[id] && this.dfs(ptr, vis, rec, nextTag)) {
          flag = true;
        }
      }
    }
    return flag;
  };
  kill(label: number, nextTag: number[]) {
    let vis = genArray(this.size, () => false);
    for (let id of _.range(this.size)) {
      let rec: number[] = [];
      if (nextTag[id] === label && !vis[id] && !this.dfs(id, vis, rec, nextTag)) {
        for (let r of rec) {
          nextTag[r] = 0;
        }
      }
    }
  };
  update() {
    for (let i of _.range(this.size)) {
      this.get(i).background = this.tag[i] === 0 ? Color.grey : this.tag[i] === 1 ? Color.black : Color.blue;
      if (this.tag[i] === 0) {
        let nextTag = genArray(this.size, (x) => this.tag[x]);
        nextTag[i] = 1;
        this.kill(-1, nextTag);
        this.kill(1, nextTag);
        this.get(i).clickable = nextTag[i] !== 0;
      } else {
        this.get(i).clickable = false;
      }
    }
    this.footer.tasks[0].set(_.sumBy(this.tag, x => +(x == 1)));
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    this.tag[id] = 1;
    this.kill(-1, this.tag);
    this.kill(1, this.tag);
    if (this.tag[this.size - 1 - id] === 0) {
      this.tag[this.size - 1 - id] = -1;
      this.kill(1, this.tag);
      this.kill(-1, this.tag);
    }
    this.update();
  }
}
