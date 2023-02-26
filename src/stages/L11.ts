import { BlockValue } from '@/ts/Block';
import { Color } from '@/ts/Color';
import { Config } from '@/ts/Config';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { enumerate, genArray, rangeMatrix } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _ from 'lodash';
import { drawRect } from '@/ts/Line';

const BLOCKS: [number, number][] = [
  [1, 2], [2, 1], [2, 2], [4, 1], [4, 2], [4, 3], [1, 4], [2, 4], [3, 4]
];

export default class extends Grid {
  tag: number[];
  btn: Map<number, [number, number, number, number]>;
  constructor(page: Page) {
    super({ n: 6, m: 6, page, noBlock: true });
    this.tag = genArray(this.size, () => -1);
    this.btn = new Map();
    this.header.message = '平移';
    this.footer.load([
      [3, 9, Task.eq],
    ]);
    for (let [i, BLOCK] of enumerate(BLOCKS)) {
      let [x, y] = BLOCK;
      this.tag[this.getId(x, y)] = this.puzzle.addBlock({
        pos: new Vec(x, y),
        background: Color.green
      }).id;
    }
    for (let i of _.range(1, 5)) {
      this.btn.set(this.puzzle.addBlock({
        pos: new Vec(0, i),
        background: Color.yellow,
        value: new BlockValue(BlockValue.Arrow, 0)
      }).id, [
        this.getId(1, i),
        this.getId(2, i),
        this.getId(3, i),
        this.getId(4, i)
      ]);
      this.btn.set(this.puzzle.addBlock({
        pos: new Vec(i, 5),
        background: Color.yellow,
        value: new BlockValue(BlockValue.Arrow, 90)
      }).id, [
        this.getId(i, 4),
        this.getId(i, 3),
        this.getId(i, 2),
        this.getId(i, 1)
      ]);
      this.btn.set(this.puzzle.addBlock({
        pos: new Vec(5, i),
        background: Color.yellow,
        value: new BlockValue(BlockValue.Arrow, 180)
      }).id, [
        this.getId(4, i),
        this.getId(3, i),
        this.getId(2, i),
        this.getId(1, i)
      ]);
      this.btn.set(this.puzzle.addBlock({
        pos: new Vec(i, 0),
        background: Color.yellow,
        value: new BlockValue(BlockValue.Arrow, 270)
      }).id, [
        this.getId(i, 1),
        this.getId(i, 2),
        this.getId(i, 3),
        this.getId(i, 4)
      ]);
    }
    drawRect(this.puzzle.lines,
      Config.blockSize + Config.blockGap / 2,
      Config.blockSize + Config.blockGap / 2,
      Config.blockSize * 4 + Config.blockGap / 2,
      Config.blockSize * 4 + Config.blockGap / 2,
      {
        width: 2,
        color: Color.blue
      }
    );
    this.update();
  }
  update() {
    for (let [id, arr] of this.btn) {
      this.get(id).clickable = (this.tag[arr[0]] === -1);
    }
    this.footer.tasks[0].set(0);
    for (let [i, j] of rangeMatrix(3, 3)) {
      if (this.tag[this.getId(i + 1, j + 1)] !== -1) {
        this.footer.tasks[0].add(1);
      }
    }
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    const arr = this.btn.get(id) as [number, number, number, number];
    for (let i of _.range(0, 3)) {
      const pos1 = arr[i];
      const pos2 = arr[i + 1];
      if (this.tag[pos2] !== -1) {
        this.tag[pos1] = this.tag[pos2];
        this.tag[pos2] = -1;
        const [x, y] = this.getXY(pos1);
        this.get(this.tag[pos1]).pos = new Vec(x, y);
      }
    }
    this.update();
  }
}