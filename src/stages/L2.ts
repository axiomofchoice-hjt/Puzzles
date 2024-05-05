import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray } from '@/ts/Tools';
import _ from 'lodash';

const SHAPE: [number, number][][] = [
  [[-1, 0], [0, -1], [0, 1]],
  [[-1, 0], [0, 0], [0, 1]],
  [[0, -1], [0, 0], [0, 1]]
];

export default class extends Grid {
  tag: boolean[];
  shapeId: number;
  checkOneBlock(x: number, y: number) {
    return this.inArea(x, y) && !this.tag[this.getId(x, y)];
  }
  checkShape(x: number, y: number, shape: [number, number][]) {
    return _.every(shape, (pos) => (this.checkOneBlock(x + pos[0], y + pos[1])));
  };
  update_clickable() {
    for (let i of _.range(this.size)) {
      const { x, y } = this.getVec(i);
      this.get(i).clickable = this.checkShape(x, y, SHAPE[this.shapeId]);
    }
  }
  constructor(page: Page) {
    super({ n: 6, m: 6, page });
    this.tag = genArray(this.size, () => false);
    this.shapeId = 0;
    page.header.message = '地砖';
    page.footer.load([
      [0, 3, Task.eq],
      [0, 3, Task.eq],
      [0, 5, Task.eq]
    ]);
    for (let i of _.range(this.size)) {
      this.get(i).background = Color.grey;
    }
    this.update_clickable();
  }
  click(id: number) {
    const { x, y } = this.getVec(id);
    if (this.checkShape(x, y, SHAPE[this.shapeId])) {
      for (let [dx, dy] of SHAPE[this.shapeId]) {
        this.get(this.getId(x + dx, y + dy)).background =
          [
            Color.green, Color.yellow, Color.blue
          ][this.shapeId];
        this.tag[this.getId(x + dx, y + dy)] = true;
      }
      this.footer.tasks[this.shapeId].add(1);
      if (this.shapeId !== 2 && this.footer.tasks[this.shapeId].ok()) {
        this.shapeId++;
      }
      this.update_clickable();
      if (this.shapeId == 1
        && this.footer.tasks[this.shapeId].now == 2
        && _.sumBy(_.range(this.size), i => +this.get(i).clickable) === 0) {
        this.bonus.do_show('只能放 5 个');
      }
    }
  }
}
