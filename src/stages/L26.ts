import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Key } from '@/ts/KeyPress';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray, near4 } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _ from 'lodash';

export default class extends Grid {
  player: Vec;
  num: number;
  constructor(page: Page) {
    super({ n: 6, m: 6, page });
    this.num = 1;
    this.player = new Vec(0, 0);
    page.buttons.setTip("可以用方向键");
    this.header.message = '运算';
    this.footer.load([
      [0, 1, Task.eq],
      [0, 4, () => 1],
    ]);
    for (let i of _.range(this.size)) {
      this.get(i).background = Color.grey;
    }
    this.get(5, 5).background = Color.yellow;
    this.puzzle.addBlock({
      background: Color.blue
    });
    this.update();
  }
  clickable(dirId: number) {
    const op = [_.divide, _.add, _.multiply, _.subtract][dirId];
    const nextNum = op(this.num, 2);
    const nextVec = near4(this.player)[dirId];
    return (
      !(dirId == 0 && this.num % 2 != 0)
      && this.inArea(nextVec)
      && nextNum >= 0
      && nextNum <= 4
    );
  }
  update() {
    for (let i of _.range(this.size)) {
      this.get(i).value.set('');
      this.get(i).clickable = false;
    }
    for (let dirId of _.range(4)) {
      if (this.clickable(dirId)) {
        const p = near4(this.player)[dirId];
        this.get(p).clickable = true;
        this.get(p).value.set(['÷', '+', '×', '-'][dirId]);
      }
    }
    this.get(this.size).value.set(this.num);
    this.get(this.size).pos = this.player;
    this.footer.tasks[0].set(+Vec.equal(this.player, new Vec(5, 5)));
    this.footer.tasks[1].set(this.num);
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    const dirId = near4(this.player).findIndex(v => Vec.equal(this.getVec(id), v));
    const op = [_.divide, _.add, _.multiply, _.subtract][dirId];
    this.num = op(this.num, 2);
    this.player = near4(this.player)[dirId];
    this.update();
  }
  keyPress(key: Key): void {
    if (key.isDirection() && this.clickable(key.directionId())) {
      this.click(this.getId(near4(this.player)[key.directionId()]));
    }
  }
}
