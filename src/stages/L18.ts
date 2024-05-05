import { BlockValue } from '@/ts/Block';
import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Key } from '@/ts/KeyPress';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray, random } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _ from 'lodash';

export default class extends Grid {
  tag: number[];
  used: boolean[];
  whoLastMove: number[]; // 0 未赋值 1 玩家 -1 电脑
  constructor(page: Page) {
    super({ n: 7, m: 5, page, noBlock: true });
    this.tag = [4, 5, 3, 2, 4];
    this.used = genArray(5, () => false);
    this.whoLastMove = genArray(5, () => 0);
    this.header.message = '博弈';
    this.footer.load([
      [0, 5, Task.ge],
    ]);
    for (let i of _.range(5)) {
      this.puzzle.addBlock();
    }
    this.puzzle.addBlock({
      pos: new Vec(6, 2),
      value: new BlockValue(BlockValue.Arrow, 90),
    });
    for (let i of _.range(5)) {
      for (let j of _.range(this.tag[i])) {
        this.puzzle.addBlock({
          pos: new Vec(5 - j, i),
          background: Color.grey
        });
      }
    }
    this.update();
  }
  hasUsed() {
    return _.sumBy(this.used, x => +x) !== 0;
  }
  update() {
    for (let i of _.range(5)) {
      this.get(i).pos = new Vec(5 - this.tag[i], i);
      if (this.used[i]) {
        this.get(i).background = Color.blue;
        this.get(i).clickable = true;
      } else if (this.tag[i] === 0) {
        this.get(i).background = Color.grey;
        this.get(i).clickable = false;
      } else {
        this.get(i).background = Color.yellow;
        this.get(i).clickable = true;
      }
      this.get(i).value.set(this.whoLastMove[i] == 1 ? 'ok' : '');
    }
    this.get(5).clickable = this.hasUsed();
    this.get(5).background = this.hasUsed() ? Color.yellow : Color.grey;
    for (let i of _.range(6, this.puzzle.blocks.length)) {
      this.get(i).opacity = +(5 - this.get(i).pos.x < this.tag[this.get(i).pos.y]);
    }
  }
  click(id: number) {
    // const { x, y } = this.getVec(id);
    if (id === 5) {
      for (let i of _.range(5)) {
        if (this.whoLastMove[i] === 0 && this.tag[i] === 0) {
          this.whoLastMove[i] = 1;
          this.footer.tasks[0].add(1);
        }
      }
      this.used = genArray(5, () => false);
      if (_.sum(this.tag) !== 0) {
        if (_.sumBy(this.tag, x => x % 2)) { // AI win state
          for (let i of _.range(5)) {
            if (this.tag[i] % 2) {
              this.tag[i]--;
            }
          }
        } else { // Player win state
          let ok = false;
          while (!ok) {
            for (let i of _.range(5)) {
              if (this.tag[i] !== 0 && random(2)) {
                ok = true;
                this.tag[i]--;
              }
            }
          }
        }
      }
      for (let i of _.range(5)) {
        if (this.whoLastMove[i] === 0 && this.tag[i] === 0) {
          this.whoLastMove[i] = -1;
        }
      }
    } else {
      if (!this.used[id]) {
        this.tag[id]--;
      } else {
        this.tag[id]++;
      }
      this.used[id] = !this.used[id];
    }
    this.update();
  }
  keyPress(key: Key): void {
    if (this.hasUsed()) {
      this.click(5);
    }
  }
}
