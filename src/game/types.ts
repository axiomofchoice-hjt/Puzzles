import type { ReactNode } from "react";

/** 传递给关卡的通用上下文：用于向 HUD 上报当前计数/目标计数，以及通关回调。 */
export interface LevelContext {
  /** 左下角 HUD 当前计数。 */
  current: number;
  /** 左下角 HUD 目标计数。 */
  target: number;
  /** 关卡内更新 HUD。 */
  setHud: (current: number, target: number) => void;
  /** 是否已达成目标（如找到宝藏），用于计数器颜色。 */
  done: boolean;
  setDone: (v: boolean) => void;
}

/** 关卡元数据（菜单/进度提示用）。 */
export interface LevelMeta {
  id: string;
  title: string;
}

/** 关卡组件：接收通用上下文。 */
export type LevelComponent = (ctx: LevelContext) => ReactNode;

/** 关卡注册表。 */
export interface LevelDef {
  meta: LevelMeta;
  Component: LevelComponent;
}
