import type { Line } from '@/ts/Line';
import { Block, BlockValue } from './Block';
import type { Color } from './Color';
import type { Vec } from './Vec';

export class Puzzle {
  width: number;
  height: number;
  blocks: Block[];
  lines: Line[];
  press_space: boolean;
  constructor() {
    this.width = 0;
    this.height = 0;
    this.blocks = [];
    this.lines = [];
    this.press_space = false;
  }
  drop() {
    this.blocks = [];
    this.lines = [];
  }
  addBlock(options?: {
    size?: number;
    pos?: Vec;
    value?: BlockValue;
    color?: Color;
    background?: Color;
    rotate?: number;
    clickable?: boolean;
    opacity?: number;
    round?: boolean;
  }): Block {
    const block = new Block(this.blocks.length, options);
    this.blocks.push(block);
    return block;
  }
}
