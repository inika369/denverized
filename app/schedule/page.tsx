import type { Metadata } from "next";
import { getNuggetsSchedule } from "../lib/api";
import ScheduleList from "./ScheduleList";

export const metadata: Metadata = {
  title: "スケジュール | DENVERIZED.JP",
};

export default async function SchedulePage() {
  const games = await getNuggetsSchedule();

  let wins = 0;
  let losses = 0;
  for (const game of games) {
    if (
      game.gameType !== "regular" ||
      game.status !== "finished" ||
      game.homeScore === null ||
      game.awayScore === null
    ) {
      continue;
    }
    const nuggetsScore = game.isHome ? game.homeScore : game.awayScore;
    const opponentScore = game.isHome ? game.awayScore : game.homeScore;
    if (nuggetsScore > opponentScore) {
      wins++;
    } else {
      losses++;
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-pixel mb-8 text-lg text-gold sm:text-xl">
        試合スケジュール
      </h1>

      <div className="pixel-shadow-sm mb-10 flex items-center justify-center gap-8 border-2 border-gold bg-navy p-6">
        <div className="text-center">
          <p className="font-pixel text-2xl text-gold sm:text-3xl">{wins}</p>
          <p className="mt-2 text-xs text-foreground/60">勝利</p>
        </div>
        <div className="h-10 w-px bg-navy-light" />
        <div className="text-center">
          <p className="font-pixel text-2xl text-foreground sm:text-3xl">
            {losses}
          </p>
          <p className="mt-2 text-xs text-foreground/60">敗北</p>
        </div>
      </div>

      {games.length > 0 ? (
        <ScheduleList games={games} />
      ) : (
        <p className="text-sm text-foreground/60">
          スケジュールを取得できませんでした。
        </p>
      )}
    </div>
  );
}
