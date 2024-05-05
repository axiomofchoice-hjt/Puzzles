import { BlockValue } from '@/ts/Block';
import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray } from '@/ts/Tools';
import _, { sumBy } from 'lodash';

const L_IDS = [0, 1, 2, 3, 12, 21, 30, 39, 48, 57, 56, 55, 54, 45, 36, 27, 18, 9];
const R_IDS = L_IDS.map((x) => x + 5);
const R_TAG = [1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1];

export default class extends Grid {
  tag: number[];
  constructor(page: Page) {
    super({ n: 7, m: 9, page });
    this.tag = genArray(this.size, () => 0);
    this.tag[0] = 1;
    this.header.message = '找不同';
    this.footer.load([
      [10, 18, Task.eq],
    ]);
    for (let i of _.range(this.size)) {
      this.get(i).clickable = false;
      this.get(i).background = Color.white;
    }
    for (let i of _.range(18)) {
      this.get(R_IDS[i]).background = R_TAG[i] ? Color.yellow : Color.grey;
    }
    this.get(31).value.set(BlockValue.Arrow, 90);
    this.update();
  }
  update() {
    for (let i of _.range(18)) {
      this.get(L_IDS[i]).clickable = this.tag[i] == 0;
      this.get(L_IDS[i]).background = this.tag[i] ? Color.yellow : Color.grey;
    }
    this.footer.tasks[0].set(sumBy(_.range(18), x => +(this.tag[x] == R_TAG[x])));
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    let index = L_IDS.findIndex((x) => x == id);
    this.tag[index] = 1;
    if (_.sumBy(this.tag) !== 18) {
      for (let i of _.range(3)) {
        index = (index + 1) % 18;
        while (this.tag[index]) {
          index = (index + 1) % 18;
        }
      }
      this.tag[index] = 1;
    }
    this.update();
  }
}
