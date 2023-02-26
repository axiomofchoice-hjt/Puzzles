import type { Key } from './KeyPress';

export interface Stage {
  click: (id: number) => void;
  keyPress: (key: Key) => void;
}