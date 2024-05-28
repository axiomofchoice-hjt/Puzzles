import { Vec } from '@/ts/Vec';
import { assert } from '@vue/compiler-core';
import { Color } from './Color';
import { Config } from './Config';

export class BlockValue {
  static Str = Symbol();
  static Num = Symbol();
  static Arrow = Symbol();
  static Star = Symbol();
  static Chess = Symbol();
  type: Symbol;
  value: string | number;
  constructor(arg?: string | number | Symbol, value?: string | number) {
    this.type = BlockValue.Str;
    this.value = '';
    this.set(arg, value);
  }
  isNum() { return this.type === BlockValue.Num; }
  isStr() { return this.type === BlockValue.Str; }
  isArrow() { return this.type === BlockValue.Arrow; }
  isStar() { return this.type === BlockValue.Star; }
  isChess() { return this.type === BlockValue.Chess; }
  get realText() {
    return (this.isNum()
      ? Math.round(this.num).toString()
      : this.isStr() ?
        this.str :
        '');
  }
  set(arg1?: string | number | Symbol, arg2?: string | number) {
    if (typeof arg1 === 'symbol') {
      this.type = arg1;
      assert((arg1 === BlockValue.Str && typeof arg2 === 'string')
        || (arg1 === BlockValue.Num && typeof arg2 === 'number')
        || (arg1 === BlockValue.Arrow && typeof arg2 === 'number')
        || (arg1 === BlockValue.Star)
        || (arg1 == BlockValue.Chess && typeof arg2 === 'string'));
      this.value = arg2 as string | number;
    } else if (typeof arg1 === 'number') {
      assert(typeof arg2 === 'undefined');
      this.type = BlockValue.Num;
      this.value = arg1;
    } else if (typeof arg1 === 'string') {
      assert(typeof arg2 === 'undefined');
      this.type = BlockValue.Str;
      this.value = arg1;
    } else {
      this.type = BlockValue.Str;
      this.value = '';
    }
  }
  get str(): string {
    return this.value as string;
  }
  get num(): number {
    return this.value as number;
  }
  static eq(a: BlockValue, b: BlockValue) {
    return a.type === b.type && a.value === b.value;
  }
  clone(): BlockValue {
    return new BlockValue(this.type, this.value);
  }
  empty() {
    return this.type === BlockValue.Str && this.value === '';
  }
};

export class Block {
  readonly id: number;
  size: number;
  pos: Vec;
  value: BlockValue;
  color: Color;
  background: Color;
  rotate: number;
  clickable: boolean;
  opacity: number;
  imm_value: BlockValue | null;
  round: boolean;
  backgroundOpacity: number;
  constructor(id: number, options?: {
    size?: number;
    pos?: Vec;
    value?: BlockValue;
    color?: Color;
    background?: Color;
    rotate?: number;
    clickable?: boolean;
    opacity?: number;
    round?: boolean;
  }) {
    this.id = id;
    this.size = options?.size ?? Config.blockSize - Config.blockGap;
    this.pos = options?.pos ?? new Vec(0, 0);
    this.value = options?.value ?? new BlockValue();
    this.color = options?.color ?? Color.black;
    this.background = options?.background ?? Color.black;
    this.rotate = options?.rotate ?? 0;
    this.clickable = options?.clickable ?? false;
    this.opacity = options?.opacity ?? 1;
    this.round = options?.round ?? false;
    this.imm_value = null;
    this.backgroundOpacity = 1;
  }
}
