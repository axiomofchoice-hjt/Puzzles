import type { LevelDef } from "./types";
import { Level1Treasure } from "./levels/Level1Treasure";

/** 注册关卡列表。 */
export const LEVELS: LevelDef[] = [
  {
    meta: { id: "1", title: "找宝藏" },
    Component: Level1Treasure,
  },
];
