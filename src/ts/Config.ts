import { Vec } from './Vec';

export class Config {
  static readonly blockSize = 100;
  static readonly blockGap = 8;
  static readonly mouseEnterOpacity = 0.7;
  static readonly mouseEnterLightChange = 0.9;
  static readonly mouseDownSize = 94;
  static readonly arrowRelativeSize = 0.5;
  static readonly grid = {
    getBlockMid(v: Vec): Vec {
      return new Vec(
        Config.blockSize * v.x + (Config.blockGap + Config.blockSize) / 2,
        Config.blockSize * v.y + (Config.blockGap + Config.blockSize) / 2,
      );
    },
    getGapMid(v: Vec): Vec { // 方块 v 左上的 Gap 中间
      return new Vec(
        Config.blockSize * v.x + Config.blockGap / 2,
        Config.blockSize * v.y + Config.blockGap / 2
      );
    },
    getBlockVertices(v: Vec): {
      x1: number, y1: number, x2: number, y2: number;
    } {
      return {
        x1: Config.blockGap + v.x * Config.blockSize,
        y1: Config.blockGap + v.y * Config.blockSize,
        x2: Config.blockSize * (v.x + 1),
        y2: Config.blockSize * (v.y + 1),
      };
    }
  };
  static readonly header = {
    fontSize: 25,
    top: 25,
    bottom: 25,
    leftRight: 25,
    getHeight() {
      return this.fontSize + this.top + this.bottom + 2;
    }
  };
  static readonly footer = {
    fontSize: 25,
    top: 25,
    bottom: 25,
    leftRight: 25,
    getHeight() {
      return this.fontSize + this.top + this.bottom + 2;
    }
  };
  static readonly buttons = {
    size: 65,
    svgSize: 40,
    gap: 20,
    right: 20,
    tipHeight: 45,
    tipFontSize: 20,
  };
};
