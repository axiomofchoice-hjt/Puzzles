import { BlockValue } from '@/ts/Block';
import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Key } from '@/ts/KeyPress';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray, near4 } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _ from 'lodash';

const DIR_ID = [71, 83, 82, 81];
const RESULT = [19, 34, 47];

export default class extends Grid {
  moves: number[];
  constructor(page: Page) {
    super({ n: 8, m: 11, page });
    this.moves = [];
    page.buttons.setTip("可以用方向键");
    this.header.message = '指令循环';
    this.footer.load([
      [0, 3, Task.eq],
      [0, 5, Task.le],
    ]);
    for (let i of _.range(66, this.size)) {
      this.get(i).background = Color.white;
    }
    for (let i of _.range(4)) {
      this.get(DIR_ID[i]).value.set(BlockValue.Arrow, i * 90);
    }
    for (let i of RESULT) {
      this.get(i).value.set('+');
    }
    this.update();
  }
  update() {
    for (let i of _.range(4)) {
      this.get(DIR_ID[i]).background = this.moves.length < 5 ? Color.yellow : Color.grey;
      this.get(DIR_ID[i]).clickable = this.moves.length < 5;
    }
    for (let i of _.range(66)) {
      this.get(i).background = Color.grey;
    }
    let p = new Vec(5, 0);
    this.get(p).background = Color.blue;
    for (let i = 0; i < 20 * this.moves.length; i++) {
      p = near4(p)[this.moves[i % this.moves.length]];
      if (this.inArea(p) && p.x < 6) {
        this.get(p).background = Color.blue;
      }
    }
    this.footer.tasks[0].set(_.sumBy(RESULT, x => +(this.get(x).background.b === 255)));
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    id = DIR_ID.findIndex(x => x === id);
    this.moves.push(id);
    this.footer.tasks[1].add(1);
    this.update();
  }
  keyPress(key: Key): void {
    if (this.moves.length < 5) {
      if (key.isDirection()) {
        this.click(DIR_ID[key.directionId()]);
      }
    }
  }
}