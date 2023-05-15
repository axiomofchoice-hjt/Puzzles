import { BlockValue } from '@/ts/Block';
import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import _ from 'lodash';

export default class extends Grid {
  L: number;
  R: number;
  constructor(page: Page) {
    super({ n: 4, m: 8, page });
    this.L = 0;
    this.R = this.size - 2;
    this.header.message = '猜数';
    this.footer.load([
      [0, 1, Task.ge],
      [0, 5, Task.leIncreasing]
    ]);
    for (let i of _.range(this.size - 1)) {
      this.get(i).value.set(i + 1);
      this.get(i).clickable = true;
      this.get(i).background = Color.grey;
    }
    this.get(this.size - 1).clickable = false;
    this.get(this.size - 1).background = Color.white;
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    this.get(id).clickable = false;
    this.footer.tasks[1].add(1);
    if (id === this.L && id === this.R) {
      this.get(id).imm_value = new BlockValue();
      this.get(id).value.set('ok');
      this.get(id).background = Color.red;
      this.footer.tasks[0].set(1);
    } else if ((id * 2 === this.L + this.R && Math.random() < 0.5) || id * 2 < this.L + this.R) {
      this.get(id).imm_value = new BlockValue();
      this.get(id).value.set(BlockValue.Arrow, 270);
      this.get(id).background = Color.yellow;
      this.get(id).rotate += 180;
      if (this.L <= id && id <= this.R) {
        this.L = id + 1;
      }
    } else {
      this.get(id).imm_value = new BlockValue();
      this.get(id).value.set(BlockValue.Arrow, 90);
      this.get(id).background = Color.blue;
      this.get(id).rotate -= 180;
      if (this.L <= id && id <= this.R) {
        this.R = id - 1;
      }
    }
  }
}