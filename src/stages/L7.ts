import { Color } from '@/ts/Color';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Task } from '@/ts/Task';
import { genArray, random } from '@/ts/Tools';
import _ from 'lodash';

export default class extends Grid {
  tag: number[];
  constructor(page: Page) {
    super({ n: 6, m: 8, page });
    this.tag = genArray(this.size, () => 0);
    this.header.message = '二进制';
    this.footer.load([
      [0, 2000, Task.eq],
    ]);
    for (let i of _.range(this.size)) {
      this.get(i).clickable = false;
      this.get(i).background = Color.grey;
    }
    var gen = (tag: number, color: Color, value: string) => {
      let id = random(this.size);
      while (this.tag[id]) {
        id = random(this.size);
      }
      this.tag[id] = tag;
      this.get(id).background = color;
      this.get(id).value.set(value);
      this.get(id).clickable = true;
    };
    for (let i of _.range(2)) { gen(-1, Color.red, '-1'); }
    for (let i of _.range(2)) { gen(1, Color.green, '+1'); }
    for (let i of _.range(10)) { gen(2, Color.yellow, '×2'); }
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    if (this.tag[id] === 2) {
      this.footer.tasks[0].set(this.footer.tasks[0].now * 2);
    } else {
      this.footer.tasks[0].add(this.tag[id]);
    }
    this.tag[id] = 0;
    this.get(id).background = Color.grey;
    this.get(id).value.set('');
    this.get(id).clickable = false;
  }
}