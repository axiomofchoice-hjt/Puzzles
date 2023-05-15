import { BlockValue } from '@/ts/Block';
import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Key } from '@/ts/KeyPress';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray, near4 } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _ from 'lodash';

const Init = {
  player: [new Vec(6, 6), new Vec(6, 5), new Vec(6, 4)],
  walls: [new Vec(0, 0), new Vec(0, 5), new Vec(5, 1), new Vec(5, 2),
  new Vec(5, 3), new Vec(5, 4), new Vec(5, 6), new Vec(3, 3)],
  foods: [
    new Vec(6, 2), new Vec(6, 1), new Vec(5, 0),
    new Vec(5, 5), new Vec(0, 1), new Vec(0, 4), new Vec(0, 6),
    new Vec(4, 1), new Vec(1, 5), new Vec(2, 5), new Vec(1, 4), new Vec(1, 1),
    new Vec(3, 4), new Vec(3, 6), new Vec(3, 2), new Vec(4, 2)
  ]
};

export default class extends Grid {
  player: Vec[];
  foods: Vec[];
  constructor(page: Page) {
    super({ n: 7, m: 7, page });
    this.player = genArray(Init.player.length, i => Init.player[i]);
    this.foods = genArray(Init.foods.length, i => Init.foods[i]);
    page.buttons.setTip("可以用方向键");
    this.header.message = '贪吃蛇';
    this.footer.load([
      [0, 16, Task.eq],
    ]);
    this.update();
  }
  get head() {
    return this.player[this.player.length - 1];
  }
  update() {
    for (let i of _.range(this.size)) {
      this.get(i).clickable = false;
      this.get(i).background = Color.grey;
      this.get(i).color = Color.black;
      this.get(i).value.set('');
    }
    for (let i of this.player) {
      this.get(i).background = Color.blue;
    }
    this.get(this.player[this.player.length - 2]).imm_value = new BlockValue('');
    this.get(this.head).imm_value = new BlockValue('P');
    this.get(this.head).value = new BlockValue('P');
    for (let i of Init.walls) {
      this.get(i).background = Color.black;
      this.get(i).color = Color.white;
      this.get(i).value.set('×');
    }
    for (let i of this.foods) {
      this.get(i).background = Color.yellow;
    }
    for (let i of near4(this.head)) {
      if (this.clickable(i)) {
        this.get(i).clickable = true;
      }
    }
  }
  clickable(i: Vec) {
    return (this.inArea(i)
      && Init.walls.findIndex(j => Vec.equal(i, j)) == -1
      && this.player.findIndex(j => Vec.equal(i, j)) == -1);
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    const food = this.foods.findIndex(x => this.getId(x) == id);
    if (food !== -1) {
      this.foods.splice(food, 1);
      this.player.shift();
      this.footer.tasks[0].add(1);
    }
    this.player.push(this.getVec(id));
    this.update();
  }
  keyPress(key: Key): void {
    const to = Vec.add(key.direction(), this.head);
    if (key.isDirection() && this.clickable(to)) {
      this.click(this.getId(to));
    }
  }
}