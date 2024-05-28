import { BlockValue } from '@/ts/Block';
import { Color } from '@/ts/Color';
import { Config } from '@/ts/Config';
import { Grid } from '@/ts/Grid';
import type { Key } from '@/ts/KeyPress';
import { drawRect } from '@/ts/Line';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray, near4, near8 } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _ from 'lodash';

const AREA = [
  0, 0, 1, 2, 2, 2,
  0, 0, 1, 2, 3, 2,
  0, 0, 3, 3, 3, 2,
  4, 0, 3, 3, 2, 2,
  4, 0, 3, 3, 2, 5,
  4, 4, 4, 3, 3, 5,
];

const LINES = [
  [0, 0, 6, 0], [0, 0, 0, 6], [0, 6, 6, 6], [6, 0, 6, 6],
  [3, 0, 3, 1], [3, 1, 5, 1], [5, 1, 5, 3], [5, 3, 6, 3],
  [0, 2, 5, 2], [2, 2, 2, 4], [0, 3, 2, 3], [2, 4, 1, 4],
  [1, 4, 1, 5], [1, 5, 3, 5], [3, 5, 3, 4], [3, 4, 5, 4],
  [5, 4, 5, 5], [4, 6, 4, 5], [4, 5, 6, 5],
];

export default class extends Grid {
  tag: boolean[];
  constructor(page: Page) {
    super({ n: 6, m: 6, page, blockInnerSize: Config.blockSize });
    this.tag = genArray(this.size, () => false);
    this.header.message = '星之战';
    this.footer.load([
      [0, 6, Task.eq],
    ]);
    for (let i of _.range(this.size)) {
      this.get(i).background = Color.white;
    }
    for (let line of LINES) {
      const { x: x1, y: y1 } = Config.grid.getGapMid(new Vec(line[0], line[1]));
      const { x: x2, y: y2 } = Config.grid.getGapMid(new Vec(line[2], line[3]));
      drawRect(this.puzzle.lines, x1, y1, x2, y2, {
        width: 2,
        color: Color.rgb(0, 100, 150),
      });
    }
    this.update();
  }
  update() {
    let starNum = 0;
    for (let i of _.range(this.size)) {
      if (this.tag[i]) {
        starNum++;
        this.get(i).value.set(BlockValue.Star);
        this.get(i).color = Color.black;
      } else {
        this.get(i).value.set('');
      }
      this.get(i).clickable = true;
    }
    for (let i of _.range(this.size)) {
      let v = this.getVec(i);
      if (this.tag[i]) {
        for (let near of near8(v)) {
          if (this.inArea(near)) {
            let block = this.get(near);
            block.value.set('×');
            block.color = Color.rgb(255, 0, 0);
            block.clickable = false;
          }
        }
        for (let x of _.range(this.n)) {
          if (x != v.x) {
            let block = this.get(x, v.y);
            block.value.set('×');
            block.color = Color.rgb(255, 0, 0);
            block.clickable = false;
          }
        }
        for (let y of _.range(this.n)) {
          if (y != v.y) {
            let block = this.get(v.x, y);
            block.value.set('×');
            block.color = Color.rgb(255, 0, 0);
            block.clickable = false;
          }
        }
        for (let j of _.range(this.size)) {
          if (AREA[i] == AREA[j] && i != j) {
            let block = this.get(j);
            block.value.set('×');
            block.color = Color.rgb(255, 0, 0);
            block.clickable = false;
          }
        }
      }
    }
    this.footer.tasks[0].set(starNum);
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    this.tag[id] = !this.tag[id];
    this.update();
  }
}
