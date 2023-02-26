import { BlockValue } from '@/ts/Block';
import { Color } from '@/ts/Color';
import { Config } from '@/ts/Config';
import { Grid } from '@/ts/Grid';
import type { Key } from '@/ts/KeyPress';
import { Line } from '@/ts/Line';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _ from 'lodash';

const RESULT = [8, 5, 7, 5, 8];

export default class extends Grid {
  pos: number[];
  locked: boolean[];
  constructor(page: Page) {
    super({ n: 6, m: 9, page });
    this.pos = genArray(5, () => 0);
    this.locked = genArray(5, () => false);
    this.header.message = '赛车';
    this.footer.load([
      [0, 5, Task.eq],
    ]);
    for (let i of _.range(this.size - this.m)) {
      this.get(i).background = Color.grey;
    }
    for (let i of _.range(this.m)) {
      this.get(5, i).opacity = 0;
    }
    for (let i of _.range(5)) {
      this.get(i, RESULT[i]).value.set('+');
    }
    this.get(5, 4).opacity = 1;
    this.get(5, 4).clickable = true;
    this.get(5, 4).background = Color.blue;
    this.get(5, 4).value.set(BlockValue.Arrow, 90);
    this.puzzle.lines.push(new Line(this.puzzle.lines.length, {
      pos: [Config.grid.getGapMid(new Vec(0, 5)), Config.grid.getGapMid(new Vec(5, 5))],
      width: 2,
      color: Color.red
    }));
    for (let i of _.range(5)) {
      this.puzzle.addBlock({
        background: Color.yellow
      });
    }
    this.update();
  }
  update() {
    for (let i of _.range(5)) {
      if (this.pos[i] < this.m) {
        this.get(this.size + i).pos = new Vec(i, this.pos[i]);
        this.get(this.size + i).clickable = this.pos[i] < 5;
        this.get(this.size + i).opacity = 1;
        this.get(this.size + i).value.set(this.locked[i] ? '/' : '');
        this.get(i, this.pos[i]).opacity = 0;
      } else {
        this.get(this.size + i).opacity = 0;
      }
    }
    this.footer.tasks[0].set(
      _.sumBy(_.range(5), i => +(this.pos[i] == RESULT[i]))
    );
  }
  click(id: number) {
    if (id >= this.size) {
      this.locked[id - this.size] = !this.locked[id - this.size];
    }
    for (let i of _.range(5)) {
      if (!this.locked[i]) {
        this.pos[i]++;
      }
    }
    this.update();
  }
  keyPress(key: Key): void {
    if (key.isRight()) {
      this.click(this.getId(5, 4));
    }
  }
}