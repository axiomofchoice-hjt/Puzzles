import { Vec } from './Vec';

export class Key {
  event: KeyboardEvent;
  constructor(event: KeyboardEvent) {
    this.event = event;
  }
  get shift(): boolean {
    return this.event.shiftKey;
  }
  isAdd(): boolean {
    return this.event.code === 'NumpadAdd' ||
      (this.event.code === 'Equal' && this.shift);
  }
  isSub(): boolean {
    return this.event.code === 'NumpadSubtract' ||
      (this.event.code === 'Minus' && !this.shift);
  }
  isMul(): boolean {
    return this.event.code === 'NumpadMultiply' ||
      (this.event.code === 'Digit8' && this.shift);
  }
  isDiv(): boolean {
    return this.event.code === 'NumpadDivide' ||
      (this.event.code === 'Slash' && !this.shift);
  }
  isEnter(): boolean {
    return this.event.code === 'Enter' ||
      this.event.code === 'NumpadEnter';
  }
  isEqual(): boolean {
    return this.event.code === 'Equal' && this.event.shiftKey === false;
  }
  isUp(): boolean {
    return this.event.code === 'KeyW' || this.event.code === 'ArrowUp';
  }
  isDown(): boolean {
    return this.event.code === 'KeyS' || this.event.code === 'ArrowDown';
  }
  isLeft(): boolean {
    return this.event.code === 'KeyA' || this.event.code === 'ArrowLeft';
  }
  isRight(): boolean {
    return this.event.code === 'KeyD' || this.event.code === 'ArrowRight';
  }
  isDirection(): boolean {
    return this.isUp() || this.isDown() || this.isLeft() || this.isRight();
  }
  direction(): Vec {
    return (this.isUp()
      ? new Vec(-1, 0)
      : this.isDown()
        ? new Vec(1, 0)
        : this.isLeft()
          ? new Vec(0, -1)
          : new Vec(0, 1)
    );
  }
  directionId(): number {
    return (this.isUp()
      ? 0 : this.isRight()
        ? 1 : this.isDown()
          ? 2 : 3
    );
  }
}

export class KeyPress {
  static down: (event: KeyboardEvent) => void;
  static up: (event: KeyboardEvent) => void;
  static init(down: (event: KeyboardEvent) => void, up: (event: KeyboardEvent) => void) {
    KeyPress.down = down;
    KeyPress.up = up;
    document.addEventListener('keydown', KeyPress.down);
    document.addEventListener('keyup', KeyPress.up);
  }
  static drop() {
    document.removeEventListener('keydown', KeyPress.down);
    document.removeEventListener('keyup', KeyPress.up);
  }
}