import { BlockValue } from '@/ts/Block';
import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray, random, rangeMatrix } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _ from 'lodash';

export default class extends Grid {
  tag: boolean[][];
  constructor(page: Page) {
    super({ n: 4, m: 7, page });
    this.tag = genArray(this.n, () => genArray(this.m, () => false));
    this.header.message = '开关';
    this.footer.load([
      [7, 12, Task.eq],
    ]);

    const find = (check: (x: number, y: number) => boolean) => {
      let x = random(4), y = random(3);
      while (!check(x, y)) {
        x = random(4), y = random(3);
      }
      return [x, y];
    };
    for (let i of _.range(this.size)) {
      this.get(i).clickable = false;
      this.get(i).background = Color.grey;
    }
    for (let i of _.range(6)) {
      let [x, y] = find((x, y) => (!this.tag[x][y]));
      this.tag[x][y] = this.tag[x][y + 4] = true;
    }
    for (let i of _.range(5)) {
      let [x, y] = find((x, y) => (this.tag[x][y] === this.tag[x][y + 4]));
      this.tag[x][y] = !this.tag[x][y];
    }
    for (let i of _.range(this.n)) {
      this.get(i, 3).opacity = 0;
    }
    this.get(2, 3).opacity = 1;
    this.get(2, 3).value.set(BlockValue.Arrow, 90);
    this.get(2, 3).background = Color.white;
    this.get(2, 3).pos = new Vec(1.5, 3);

    for (let [i, j] of rangeMatrix(this.n, this.m)) {
      if (j < 3) {
        this.get(i, j).clickable = true;
      }
      if (j != 3) {
        this.get(i, j).background = (this.tag[i][j] ? Color.grey : Color.green);
      }
    }
  }
  click(id: number) {
    const {x, y} = this.getVec(id);

    for (let [i, j] of rangeMatrix(4, 3)) {
      if (this.getId(i, j) !== id) {
        this.tag[i][j] = !this.tag[i][j];
        this.get(i, j).background = (this.tag[i][j] ? Color.grey : Color.green);
      }
    }
    let cnt = 0;
    for (let [i, j] of rangeMatrix(4, 3)) {
      if (this.tag[i][j] === this.tag[i][j + 4]) {
        cnt++;
      }
    }
    this.footer.tasks[0].set(cnt);
  }
}
