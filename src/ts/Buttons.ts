import { Color } from './Color';

export class Button {
  show: boolean;
  hover: boolean;
  COMMON_COLOR: string;
  HOVER_COLOR: string;
  constructor() {
    this.show = true;
    this.hover = false;
    this.COMMON_COLOR = 'grey';
    this.HOVER_COLOR = 'green';
  }
  get color(): string {
    return !this.hover
      ? this.COMMON_COLOR
      : this.HOVER_COLOR;
  }
}

export class Buttons {
  back: Button;
  restart: Button;
  tip: Button;
  tip_content: string;
  constructor() {
    this.back = new Button();
    this.restart = new Button();
    this.tip = new Button();
    this.tip.show = false;
    this.tip.HOVER_COLOR = 'darkorange';
    this.tip_content = '';
  }
  get count() {
    return (+this.back.show) + (+this.restart.show) + (+this.tip.show);
  }
  drop() {
    this.back.show = true;
    this.restart.show = true;
    this.tip.show = false;
  }
  setTip(content: string) {
    this.tip.show = true;
    this.tip_content = content;
  }
}