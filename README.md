# 解密游戏 · 闯关

一个基于 **React + TypeScript + Vite** 的鼠标解密闯关小游戏。画面使用 SVG 绘制，
支持图形（内含数字/图片）、线条、箭头等元素，左下角显示 `当前计数/目标计数`（`%d/%d`）。

## 运行

```bash
npm install
npm run dev      # 开发服务器（默认 http://localhost:5173）
npm run build    # 生产构建（输出到 dist/）
npm run preview  # 预览构建产物
```

## 玩法

闯关制，满足每关条件后自动进入下一关。左下角 HUD 显示当前进度 `X/Y`。

- **第 1 关 · 找到宝藏**：点击地图任意位置，若未命中宝藏会用箭头指向最近的宝藏；
  找出全部 3 处宝藏即通关（HUD 显示 `X/3`）。
- **第 2 关 · 点亮数字**：点击圆圈把数值加到目标值并点亮，全部点亮即通关。

## 结构

```
src/
  main.tsx                  入口
  App.tsx                   应用外壳、关卡切换、HUD
  styles.css               样式
  game/
    types.ts               关卡上下文类型
    levels.ts              关卡注册表（按顺序闯关）
    levels/
      Level1Treasure.tsx   第 1 关：找宝藏（箭头引导 + X/3）
      Level2Counter.tsx    第 2 关：点亮数字（数字 + 线条）
```

新增关卡：在 `src/game/levels/` 写一个组件并添加到 `src/game/levels.ts` 的 `LEVELS` 数组即可。
