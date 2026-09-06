import type { LevelDef } from "./types";
import { Level1Treasure } from "./levels/Level1Treasure";
import { Level2Guess } from "./levels/Level2Guess";

/** 注册关卡列表。 */
export const LEVELS: LevelDef[] = [
  {
    meta: { id: "1", title: "找宝藏" },
    Component: Level1Treasure,
  },
  {
    meta: { id: "2", title: "猜数" },
    Component: Level2Guess,
  },
];
