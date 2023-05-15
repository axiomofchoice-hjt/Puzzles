import { Puzzle } from '@/ts/Puzzle';
import { Bonus } from './Bonus';
import { Buttons } from './Buttons';
import { Config } from './Config';
import { Footer } from './Footer';
import { Header } from './Header';
import { Vec } from './Vec';

export class Page {
  dom: HTMLDivElement | null;
  width: number;
  height: number;
  readonly header: Header;
  readonly puzzle: Puzzle;
  readonly footer: Footer;
  readonly buttons: Buttons;
  readonly bonus: Bonus;
  constructor() {
    this.dom = null;
    this.width = 0;
    this.height = 0;
    this.header = new Header();
    this.puzzle = new Puzzle();
    this.footer = new Footer();
    this.buttons = new Buttons();
    this.bonus = new Bonus();
  }
  get puzzle_pos(): Vec {
    const page = this;
    return new Vec(
      (page.height - page.puzzle.height) / 2,
      (page.width - page.puzzle.width) / 2
    );
  }
  get buttons_pos() {
    const page = this;
    return new Vec(
      (page.height - page.buttons.count * Config.buttons.size - (page.buttons.count - 1) * Config.buttons.gap) / 2,
      page.width - Config.buttons.size - Config.buttons.right
    );
  }
  drop() {
    this.buttons.drop();
    this.puzzle.drop();
    this.bonus.drop();
  }
}