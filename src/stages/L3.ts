import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray } from '@/ts/Tools';
import _ from 'lodash';

export default class extends Grid {
  tag: boolean[];
  constructor(page: Page) {
    super({ n: 5, m: 5, page });
    this.tag = genArray(this.size, () => false);
    this.header.message = '扫雷';
    this.footer.load([
      [0, 8, Task.eq],
    ]);
    for (let i of _.range(this.size)) {
      this.get(i).clickable = true;
      this.get(i).background = Color.grey;
    }
  }
  click(id: number) {
    const {x, y} = this.getVec(id);
    this.tag[id] = !this.tag[id];
    this.get(id).background = (this.tag[id] ? Color.green : Color.grey);
    let appear = genArray(8, () => false);

    for (let p of _.range(this.size)) {
      let [i, j] = this.getXY(p);
      if (this.tag[p]) {
        this.get(p).value.set('');
      } else {
        let cnt = 0;
        for (let s of _.range(this.size)) {
          let [si, sj] = this.getXY(s);
          if (Math.abs(si - i) <= 1 && Math.abs(sj - j) <= 1 && this.tag[s]) {
            cnt++;
          }
        }
        if (cnt === 0) {
          this.get(p).value.set('');
        } else {
          this.get(p).value.set(cnt.toString());
          appear[cnt - 1] = true;
        }
      }
    }
    this.footer.tasks[0].set(_.sumBy(appear, (x) => +x));
  }
}