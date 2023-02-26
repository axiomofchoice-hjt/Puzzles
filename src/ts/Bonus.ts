export class Bonus {
  content: string;
  show: boolean;
  constructor() {
    this.content = '';
    this.show = false;
  }
  do_show(content: string) {
    this.content = content;
    this.show = true;
    window.setTimeout(() => {
      this.show = false;
    }, 2000);
  }
  drop() {
    this.show = false;
  }
}