import { useCallback, useState } from "react";
import { LEVELS } from "./game/levels";
import type { LevelContext } from "./game/types";

interface HudState {
  current: number;
  target: number;
}

export default function App() {
  const [hud, setHud] = useState<HudState>({ current: 0, target: 0 });
  const [done, setDone] = useState(false);

  const level = LEVELS[0];
  const Component = level.Component;

  const handleSetHud = useCallback((current: number, target: number) => {
    setHud({ current, target });
  }, []);

  const ctx: LevelContext = {
    current: hud.current,
    target: hud.target,
    setHud: handleSetHud,
    done,
    setDone,
    complete: () => {}, // 目前只有一关，无需切换
  };

  const hudClass =
    hud.current > hud.target
      ? "hud hud--over"
      : hud.current === hud.target && done
        ? "hud hud--done"
        : "hud";

  return (
    <div className="app">
      <h1 className="app__title">{level.meta.title}</h1>

      <main className="stage">
        <Component {...ctx} />
      </main>

      {/* 左下角计数 HUD */}
      <div className={hudClass} aria-live="polite">
        <span className="hud__current">{hud.current}</span>
        <span className="hud__sep">/</span>
        <span className="hud__target">{hud.target}</span>
      </div>
    </div>
  );
}
