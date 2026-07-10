"use client";

import { useMemo, useState } from "react";
import type { ScheduleGame } from "../lib/api";
import ScheduleGameCard from "./ScheduleGameCard";

type Tab = "all" | "home" | "away" | "recent";

const TABS: { value: Tab; label: string }[] = [
  { value: "all", label: "全試合" },
  { value: "home", label: "ホーム" },
  { value: "away", label: "アウェイ" },
  { value: "recent", label: "直近・今後" },
];

const RECENT_WINDOW_DAYS = 14;

function isRecentOrUpcoming(game: ScheduleGame, todayStr: string): boolean {
  if (game.status === "scheduled") return true;

  const gameDate = new Date(`${game.date}T00:00:00`);
  const today = new Date(`${todayStr}T00:00:00`);
  const diffDays =
    (today.getTime() - gameDate.getTime()) / (24 * 60 * 60 * 1000);

  return diffDays <= RECENT_WINDOW_DAYS;
}

export default function ScheduleList({ games }: { games: ScheduleGame[] }) {
  const [tab, setTab] = useState<Tab>("all");

  const todayStr = useMemo(
    () =>
      new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(
        new Date()
      ),
    []
  );

  const filtered = useMemo(() => {
    switch (tab) {
      case "home":
        return games.filter((g) => g.isHome);
      case "away":
        return games.filter((g) => !g.isHome);
      case "recent":
        return games.filter((g) => isRecentOrUpcoming(g, todayStr));
      default:
        return games;
    }
  }, [games, tab, todayStr]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 text-xs font-bold transition-colors ${
              tab === t.value
                ? "bg-gold text-navy-dark"
                : "border-2 border-navy-light text-foreground/60 hover:border-gold hover:text-gold"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filtered.map((game) => (
            <ScheduleGameCard key={game.gameId} game={game} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-foreground/60">
          該当する試合はありません。
        </p>
      )}
    </div>
  );
}
