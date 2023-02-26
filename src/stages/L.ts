import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray } from '@/ts/Tools';
import _ from 'lodash';

export default class extends Grid {
  tag: number[];
  constructor(page: Page) {
    super({ n: 5, m: 5, page });
    this.tag = genArray(this.size, () => 0);
    this.header.message = 'xxxx';
    this.footer.load([
      [0, 8, Task.eq],
    ]);
    for (let i of _.range(this.size)) {
      this.get(i).clickable = true;
      this.get(i).background = Color.grey;
    }
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
  }
}