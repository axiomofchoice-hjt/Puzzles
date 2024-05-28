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

export default class extends Grid {
  choose: boolean;
  constructor(page: Page) {
    super({ n: 8, m: 8, page, blockInnerSize: Config.blockSize });
    this.header.message = '独棋';
    this.footer.load([
      [0, 5, Task.eq],
    ]);
    this.choose = false;
    for (let i of _.range(this.size)) {
      this.get(i).background = _.sum(this.getXY(i)) % 2 ? Color.grey : Color.white;
      this.get(i).color = Color.black;
    }
    let set = (x: number, y: number, value: string) => {
      let block = this.puzzle.addBlock({
        size: Config.blockSize,
        pos: new Vec(x, y),
        value: new BlockValue(BlockValue.Chess, value),
        color: Color.black,
        clickable: true,
      });
      block.backgroundOpacity = 0;
    };
    set(5, 2, 'knight');
    set(5, 3, 'knight');
    set(4, 3, 'pawn');
    set(4, 4, 'pawn');
    set(2, 5, 'pawn');
    set(3, 4, 'rook');
    this.update();
  }
  update() {
  }
  click(id: number) {
    // const {x, y} = this.getVec(id);
    // this.tag[id] = !this.tag[id];
    const { x, y } = this.get(id).pos;
    if (!this.choose) {
      this.get(x, y).background = Color.yellow;
      for (let chess of this.puzzle.blocks) {
        if (chess.value.isChess()) {
          if ((this.get(id).value.value === 'pawn' && chess.pos.x === x - 1 && Math.abs(chess.pos.y - y) === 1)
            || (this.get(id).value.value === 'knight' && Math.abs(chess.pos.x - x) + Math.abs(chess.pos.y - y) === 3)
            || (this.get(id).value.value === 'rook' && (chess.pos.x === x) != (chess.pos.y === y))) {
            this.get(chess.pos.x, chess.pos.y).background = Color.blue;
          }
        }
      }
    } else {
      if (this.get(x, y).background.equal(Color.blue)) {
        this.get(id).opacity = 0;
        this.get(id).clickable = false;
        for (let chess of this.puzzle.blocks) {
          if (chess.value.isChess() && this.get(chess.pos.x, chess.pos.y).background.equal(Color.yellow)) {
            chess.pos = new Vec(x, y);
          }
        }
        this.footer.tasks[0].add(1);
      }
      for (let block of this.puzzle.blocks) {
        block.background = (block.pos.x + block.pos.y) % 2 ? Color.grey : Color.white;
      }
    }
    this.choose = !this.choose;
    this.update();
  }
}
