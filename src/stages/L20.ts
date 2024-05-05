import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray, near8 } from '@/ts/Tools';
import _ from 'lodash';

const RESULT = [
  0, 0, 0, 1, 0, 0,
  0, 0, 1, 1, 0, 0,
  1, 1, 1, 1, 1, 0,
  0, 1, 1, 1, 1, 1,
  0, 0, 1, 1, 0, 0,
  0, 0, 1, 0, 0, 0
];

export default class extends Grid {
  tag: number[];
  constructor(page: Page) {
    super({ n: 6, m: 6, page });
    this.tag = genArray(this.size, () => 0);
    this.header.message = '刷子';
    this.footer.load([
      [0, 36, Task.eq],
    ]);
    for (let i of _.range(this.size)) {
      const { x, y } = this.getVec(i);
      this.get(i).clickable = true;
      this.get(i).background = Color.grey;
      this.get(i).value.set(RESULT[i] ? '+' : '');
    }
    this.update();
  }
  update() {
    for (let i of _.range(this.size)) {
      this.get(i).background = this.tag[i] ? Color.blue : Color.grey;
    }
    this.footer.tasks[0].set(
      _.sumBy(_.range(this.size), i => +(this.tag[i] == RESULT[i])));
    if (this.footer.tasks[0].now === 0) {
      this.bonus.do_show("反向刷子");
    }
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    let t = this.tag[id] ^ 1;
    this.tag[id] = t;
    for (let v of near8(this.getVec(id))) {
      if (this.inArea(v)) {
        this.tag[this.getId(v)] = t;
      }
    }
    this.update();
  }
}
