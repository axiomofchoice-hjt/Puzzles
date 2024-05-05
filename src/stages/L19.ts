import { BlockValue } from '@/ts/Block';
import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray } from '@/ts/Tools';
import { Vec } from '@/ts/Vec';
import _ from 'lodash';

const VERTICES: Vec[] = [
  new Vec(2, 0),
  new Vec(2, 4),
  new Vec(2, 8),
  new Vec(6, 4),
];
interface Edge { pos: Vec, from: number, to: number, value: number; arrows: [Vec, number][]; }
const EDGES_GEN: () => Edge[] = () => [
  { pos: new Vec(2, 2), from: 0, to: 1, value: 1, arrows: [[new Vec(2, 1), 90], [new Vec(2, 3), 90]] },
  { pos: new Vec(4, 2), from: 0, to: 3, value: 4, arrows: [[new Vec(3, 1), 135], [new Vec(5, 3), 135]] },
  { pos: new Vec(0, 2), from: 1, to: 0, value: Infinity, arrows: [[new Vec(1, 1), 225], [new Vec(1, 3), 315]] },
  { pos: new Vec(2, 6), from: 1, to: 2, value: 1, arrows: [[new Vec(2, 5), 90], [new Vec(2, 7), 90]] },
  { pos: new Vec(0, 6), from: 2, to: 1, value: Infinity, arrows: [[new Vec(1, 5), 225], [new Vec(1, 7), 315]] },
  { pos: new Vec(4, 4), from: 3, to: 1, value: 1, arrows: [[new Vec(3, 4), 0], [new Vec(5, 4), 0]] },
  { pos: new Vec(4, 6), from: 3, to: 2, value: -2, arrows: [[new Vec(3, 7), 45], [new Vec(5, 5), 45]] },
];

export default class extends Grid {
  // tag: number[];
  player: number;
  edges: Edge[];
  constructor(page: Page) {
    super({ n: 7, m: 9, page });
    this.header.message = '爱心';
    this.footer.load([
      [0, 7, Task.eq],
    ]);
    for (let i of _.range(this.size)) {
      this.get(i).clickable = false;
      this.get(i).opacity = 0;
    }
    this.edges = EDGES_GEN();
    for (let { arrows } of this.edges) {
      for (let [pos, v] of arrows) {
        this.get(pos).opacity = 1;
        this.get(pos).background = Color.white;
        this.get(pos).value.set(BlockValue.Arrow, v);
      }
    }
    for (let pos of VERTICES) {
      this.get(pos).opacity = 1;
      this.get(pos).background = Color.grey;
    }
    for (let { pos } of this.edges) {
      this.get(pos).round = true;
    }
    this.puzzle.addBlock({
      background: Color.blue,
      value: new BlockValue('P'),
    });
    this.player = 0;

    this.update();
  }
  update() {
    this.get(this.size).pos = VERTICES[this.player];
    for (let to of _.range(4)) {
      this.get(VERTICES[to]).clickable = (this.edges.findIndex(e => (e.from == this.player && e.to == to && e.value != 0)) !== -1);
      this.get(VERTICES[to]).opacity = +(this.player != to);
    }
    for (let { pos, value } of this.edges) {
      this.get(pos).opacity = +(value != 0);
      this.get(pos).background = value >= 0 ? Color.grey : Color.green;
      this.get(pos).value.set(value === Infinity ? '∞' : value === 0 ? '' : Math.abs(value));
    }
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    id = VERTICES.findIndex(v => Vec.equal(this.getVec(id), v));
    const edge = this.edges.find(e => (e.from == this.player && e.to == id && e.value != 0)) as Edge;
    this.player = id;
    if (edge.value >= 0) {
      edge.value--;
    } else {
      edge.value++;
      if (edge.value === 0) {
        for (let e of this.edges) {
          if (e.value == Infinity) {
            e.value = 1;
          }
        }
      }
    }
    if (edge.value === 0) {
      for (let [pos] of edge.arrows) {
        this.get(pos).opacity = 0;
      }
      this.footer.tasks[0].add(1);
    }
    this.update();
  }
}
