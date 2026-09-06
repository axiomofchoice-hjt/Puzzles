import { useCallback, useEffect, useState } from "react";
import { LEVELS } from "./game/levels";
import { LevelSelect } from "./LevelSelect";
import type { LevelContext } from "./game/types";

interface HudState {
  current: number;
  target: number;
}

const STORAGE_KEY = "puzzles.cleared";

function loadCleared(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export default function App() {
  const [view, setView] = useState<"select" | "play">("select");
  const [levelIndex, setLevelIndex] = useState(0);
  const [session, setSession] = useState(0); // 重新开始用，控制关卡组件重挂载
  const [hud, setHud] = useState<HudState>({ current: 0, target: 0 });
  const [done, setDone] = useState(false);
  const [cleared, setCleared] = useState<Set<string>>(loadCleared);

  const level = LEVELS[levelIndex];

  const openLevel = useCallback((index: number) => {
    setLevelIndex(index);
    setSession(0);
    setHud({ current: 0, target: 0 });
    setDone(false);
    setView("play");
  }, []);

  const handleSetHud = useCallback((current: number, target: number) => {
    setHud({ current, target });
  }, []);

  const restart = useCallback(() => {
    setSession((s) => s + 1);
    setHud({ current: 0, target: 0 });
    setDone(false);
  }, []);

  // 通关后写入 localStorage，方块背景变黄。
  useEffect(() => {
    if (view === "play" && done) {
      setCleared((prev) => {
        if (prev.has(level.meta.id)) return prev;
        const next = new Set(prev).add(level.meta.id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
        return next;
      });
    }
  }, [view, done, level.meta.id]);

  const ctx: LevelContext = {
    current: hud.current,
    target: hud.target,
    setHud: handleSetHud,
    done,
    setDone,
    complete: () => {},
  };

  const hudClass =
    hud.current > hud.target
      ? "hud hud--over"
      : hud.current === hud.target && done
        ? "hud hud--done"
        : "hud";

  if (view === "select") {
    return <LevelSelect levels={LEVELS} cleared={cleared} onSelect={openLevel} />;
  }

  const Component = level.Component;
  const hasPrev = levelIndex > 0;
  const hasNext = levelIndex < LEVELS.length - 1;

  return (
    <div className="app">
      <h1 className="app__title">{level.meta.title}</h1>

      <main className="stage">
        <Component key={session} {...ctx} />
      </main>

      {/* 底部条：左计数卡片 / 中重新开始 / 右 返回·上一关·下一关，垂直中心对齐 */}
      <div className="bottom-bar">
        {/* 左下角计数 HUD */}
        <div className={hudClass} aria-live="polite">
          <span className="hud__current">{hud.current}</span>
          <span className="hud__sep">/</span>
          <span className="hud__target">{hud.target}</span>
        </div>

        <button className="btn controls__restart" onClick={restart}>
          重新开始
        </button>

        <div className="controls__nav">
          <button className="btn" onClick={() => setView("select")}>
            返回
          </button>
          <button className="btn" disabled={!hasPrev} onClick={() => openLevel(levelIndex - 1)}>
            上一关
          </button>
          <button className="btn" disabled={!hasNext} onClick={() => openLevel(levelIndex + 1)}>
            下一关
          </button>
        </div>
      </div>
    </div>
  );
}
