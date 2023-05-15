import { Color } from '@/ts/Color';
import { PuzzleCookies } from '@/ts/PuzzleCookies';
import { Grid } from '@/ts/Grid';
import type { Page } from '@/ts/Page';
import { Route } from '@/ts/Route';
import { Task } from '@/ts/Task';
import _ from 'lodash';

export default class Home extends Grid {
  static stageCount: number;
  constructor(page: Page) {
    super({ n: Math.ceil(Home.stageCount / 5), m: 5, page });
    page.buttons.back.show = false;
    page.buttons.setTip("关卡难度没有单调性");
    this.header.message = '选关';
    this.footer.load([
      [PuzzleCookies.count(), Home.stageCount, Task.ge],
    ]);
    for (let i of _.range(this.size)) {
      if (i < Home.stageCount) {
        this.get(i).value.set(i + 1);
        this.get(i).clickable = true;
        this.get(i).background = PuzzleCookies.get(i) ? Color.yellow : Color.grey;
      } else {
        this.get(i).background = Color.white;
      }
    }
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    Route.toLevel(id + 1);
  }
}