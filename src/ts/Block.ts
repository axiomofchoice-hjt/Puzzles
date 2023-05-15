import { Vec } from '@/ts/Vec';
import { assert } from '@vue/compiler-core';
import { Color } from './Color';
import { Config } from './Config';

export class BlockValue {
  static Str = Symbol();
  static Num = Symbol();
  static Arrow = Symbol();
  type: Symbol;
  value: string | number;
  constructor(arg?: string | number | Symbol, value?: string | number) {
    this.type = BlockValue.Str;
    this.value = '';
    this.set(arg, value);
  }
  isNum() { return this.type === BlockValue.Num; }
  isStr() { return this.type === BlockValue.Str; }
  get realText() {
    return (this.isNum()
      ? Math.round(this.num).toString()
      : this.isStr() ?
        this.str :
        '');
  }
  get isText() { return this.isNum() || this.isStr(); }
  set(arg?: string | number | Symbol, value?: string | number) {
    if (typeof arg === 'symbol') {
      this.type = arg;
      assert((arg === BlockValue.Str && typeof value === 'string')
        || (arg === BlockValue.Num && typeof value === 'number')
        || (arg === BlockValue.Arrow && typeof value === 'number'));
      this.value = value as string | number;
    } else if (typeof arg === 'number') {
      assert(typeof value === 'undefined');
      this.type = BlockValue.Num;
      this.value = arg;
    } else if (typeof arg === 'string') {
      assert(typeof value === 'undefined');
      this.type = BlockValue.Str;
      this.value = arg;
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
  }
}