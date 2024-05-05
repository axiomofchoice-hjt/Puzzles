import type { Page } from './Page';

export class WindowResize {
  static page: Page;
  static update() {
    const dom = WindowResize.page.dom as HTMLDivElement;
    WindowResize.page.width = dom.offsetWidth;
    WindowResize.page.height = dom.offsetHeight;
  }

  static init(page: Page) {
    this.page = page;
    WindowResize.update();
    window.addEventListener('resize', WindowResize.update);
  }

  static drop() {
    window.removeEventListener('resize', WindowResize.update);
  }
}
