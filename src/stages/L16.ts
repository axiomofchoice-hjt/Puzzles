import { BlockValue } from '@/ts/Block';
import { Color } from '@/ts/Color';
import { Config } from '@/ts/Config';
import { Grid } from '@/ts/Grid';
import { drawRect } from '@/ts/Line';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _ from 'lodash';

const COMPOSITION: {
  from: [number, number, number];
  to: [number, number, number];
  score: number;
}[] = [
    {
      from: [0, 0, -1],
      to: [1, 1, 1],
      score: 0
    },
    {
      from: [0, 1, -1],
      to: [2, 2, -1],
      score: 0
    },
    {
      from: [1, 2, -1],
      to: [0, 0, 1],
      score: 0
    },
    {
      from: [2, 2, -1],
      to: [-1, -1, -1],
      score: 1
    },
    {
      from: [2, 2, 2],
      to: [2, 2, -1],
      score: 1
    }
  ];

export default class extends Grid {
  tag: number[];
  constructor(page: Page) {
    super({ n: 4, m: 7, page });
    this.tag = genArray(this.size, () => -1);
    this.header.message = '化学';
    this.footer.load([
      [0, 4, Task.ge],
    ]);
    for (let i of _.range(this.size)) {
      this.get(i).clickable = true;
      this.get(i).opacity = 0;
    }
    this.get(0, 3).value.set(BlockValue.Arrow, 90);
    this.get(0, 3).background = Color.yellow;
    {
      const { x: x1, y: y1 } = Config.grid.getGapMid(new Vec(0, 0));
      const { x: x2, y: y2 } = Config.grid.getGapMid(new Vec(1, 3));
      drawRect(this.puzzle.lines, x1, y1, x2, y2, {
        width: 2,
        color: Color.blue
      });
    }
    {
      const { x: x1, y: y1 } = Config.grid.getGapMid(new Vec(0, 4));
      const { x: x2, y: y2 } = Config.grid.getGapMid(new Vec(1, 7));
      drawRect(this.puzzle.lines, x1, y1, x2, y2, {
        width: 2,
        color: Color.blue
      });
    }
    for (let i of _.range(3)) {
      this.tag[i + 7] = 0;
      this.get(1, i).opacity = 1;
      this.get(1, i).background = Color.green;
    }
  }
  getSize(l: number, r: number) {
    let res = 0;
    for (let i = l; i <= r; i++) {
      if (this.tag[i] !== -1) {
        res++;
      }
    }
    return res;
  };
  leftSize() { return this.getSize(0, 2); };
  rightSize() { return this.getSize(4, 6); };
  bagSize() { return this.getSize(7, this.size - 1); };
  swap(id1: number, id2: number) {
    this.get(id1).pos = this.getVec(id2);
    this.get(id2).pos = this.getVec(id1);
    [this.puzzle.blocks[id1], this.puzzle.blocks[id2]] = [this.get(id2), this.get(id1)];
    [this.tag[id1], this.tag[id2]] = [this.tag[id2], this.tag[id1]];
  };
  move(from: number, to: number) {
    if (from < to) {
      for (let i = from; i <= to - 1; i++) {
        this.swap(i, i + 1);
      }
    } else if (from > to) {
      for (let i = from; i >= to + 1; i--) {
        this.swap(i, i - 1);
      }
    }
  };
  update() {
    for (let i of _.range(this.size)) {
      this.get(i).clickable = this.tag[i] !== -1;
    }
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    id = _.range(this.size).findIndex(x => this.get(x).id == id);
    if (id >= 0 && id < this.leftSize() && this.bagSize() < 21) {
      let pos = this.bagSize();
      while (pos > 0 && this.tag[pos - 1 + 7] > this.tag[id]) {
        pos--;
      }
      this.move(this.bagSize() + 7, pos + 7);
      this.swap(pos + 7, id);
      this.move(id, this.leftSize());
    }
    if (id >= 4 && id - 4 < this.rightSize() && this.bagSize() < 21) {
      let pos = this.bagSize();
      while (pos > 0 && this.tag[pos - 1 + 7] > this.tag[id]) {
        pos--;
      }
      this.move(this.bagSize() + 7, pos + 7);
      this.swap(pos + 7, id);
      this.move(id, this.rightSize() + 4);
    }

    if (id >= 7 && id - 7 < this.bagSize() && this.leftSize() < 3) {
      let pos = this.leftSize();
      while (pos > 0 && this.tag[pos - 1] > this.tag[id]) {
        pos--;
      }
      this.move(this.leftSize(), pos);
      this.swap(pos, id);
      this.move(id, this.bagSize() + 7);
    }

    for (let comp of COMPOSITION) {
      if (comp.from[0] === this.tag[0] && comp.from[1] === this.tag[1] && comp.from[2] === this.tag[2]) {
        for (let i of _.range(3)) {
          if (comp.to[i] !== -1) {
            this.get(i + 4).background = [Color.green, Color.purple, Color.red][comp.to[i]], { immediately: true };
          }
        }
      }
    }
    if (id === 3 && this.rightSize() === 0) {
      for (let comp of COMPOSITION) {
        if (comp.from[0] === this.tag[0] && comp.from[1] === this.tag[1] && comp.from[2] === this.tag[2]) {
          for (let i of _.range(3)) {
            this.tag[i] = -1;
            this.get(i).opacity = 0;

            if (comp.to[i] !== -1) {
              this.tag[i + 4] = comp.to[i];
              // this.get(i + 4).background = [Color.green, Color.purple, Color.red][comp.to[i]], { immediately: true };

              this.get(i + 4).opacity = 1;
            }
          }
          this.footer.tasks[0].add(comp.score);
        }
      }
    }
    let flag = false;
    if (this.rightSize() === 0) {
      for (let comp of COMPOSITION) {
        if (comp.from[0] === this.tag[0] && comp.from[1] === this.tag[1] && comp.from[2] === this.tag[2]) {
          flag = true;
        }
      }
    }
    this.get(3).opacity = +flag;
  }
}