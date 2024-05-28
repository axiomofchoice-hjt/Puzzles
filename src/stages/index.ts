import type { Page } from '@/ts/Page';
import { Route } from '@/ts/Route';
import type { Stage } from '@/ts/Stage';
import Home from './Home';
import L0 from './L0';
import L1 from './L1';
import L2 from './L2';
import L3 from './L3';
import L4 from './L4';
import L5 from './L5';
import L6 from './L6';
import L7 from './L7';
import L8 from './L8';
import L9 from './L9';
import L10 from './L10';
import L11 from './L11';
import L12 from './L12';
import L13 from './L13';
import L14 from './L14';
import L15 from './L15';
import L16 from './L16';
import L17 from './L17';
import L18 from './L18';
import L19 from './L19';
import L20 from './L20';
import L21 from './L21';
import L22 from './L22';
import L23 from './L23';
import L24 from './L24';
import L25 from './L25';
import L26 from './L26';
import L27 from './L27';
import L28 from './L28';

const stages = [
  L0, L1, L2, L3, L4,
  L5, L6, L7, L8, L9,
  L10, L11, L12, L13, L14,
  L15, L16, L17, L18, L19,
  L20, L21, L22, L23, L24,
  L25, L26, L27, L28
];

export class Stages {
  static count = stages.length;
  static getStage(page: Page): Stage {
    if (Route.isHome()) {
      return new Home(page);
    } else {
      return new stages[+Route.path - 1](page);
    }
  }
};
