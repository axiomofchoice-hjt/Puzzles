import type { LevelDef } from "./game/types";

interface Props {
  levels: LevelDef[];
  /** 已通关的关卡 id 集合。 */
  cleared: Set<string>;
  onSelect: (index: number) => void;
}

export function LevelSelect({ levels, cleared, onSelect }: Props) {
  return (
    <div className="select">
      <h1 className="select__title">选关</h1>
      <div className="select__grid">
        {levels.map((l, i) => (
          <button
            key={l.meta.id}
            className={`select__block ${cleared.has(l.meta.id) ? "is-cleared" : ""}`}
            onClick={() => onSelect(i)}
          >
            <span className="select__num">{i + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
