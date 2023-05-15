export class Route {
  static path: string = '?';
  static callback: () => void;
  static update() {
    if (window.location.hash.length === 0) {
      window.location.replace('#home');
      return;
    }
    Route.path = window.location.hash.slice(1);
    Route.callback();
  };
  static init(callback: () => void) {
    Route.callback = callback;
    window.addEventListener('hashchange', Route.update);
    Route.update();
  }
  static drop() {
    window.removeEventListener('hashchange', Route.update);
  }
  static set(path: string) {
    window.location.hash = '#' + path;
  }

  static isHome(): boolean {
    return Route.path === 'home';
  }
  static toHome() {
    Route.set('home');
  }
  static toLevel(level: number) {
    Route.set(level.toString());
  }
}