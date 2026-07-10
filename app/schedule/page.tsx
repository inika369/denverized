import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "スケジュール | DENVERIZED.JP",
};

type Game = {
  id: string;
  date: string;
  time: string;
  opponent: string;
  homeAway: "HOME" | "AWAY";
  venue: string;
  result?: string;
};

const GAMES: Game[] = [
  {
    id: "g1",
    date: "2026.07.01",
    time: "09:00",
    opponent: "クリッパーズ",
    homeAway: "AWAY",
    venue: "インタュイット・ドーム",
    result: "L 108-112",
  },
  {
    id: "g2",
    date: "2026.07.04",
    time: "10:00",
    opponent: "ジャズ",
    homeAway: "HOME",
    venue: "ボールアリーナ",
    result: "W 121-104",
  },
  {
    id: "g3",
    date: "2026.07.07",
    time: "09:30",
    opponent: "サンダー",
    homeAway: "HOME",
    venue: "ボールアリーナ",
    result: "W 115-112",
  },
  {
    id: "g4",
    date: "2026.07.10",
    time: "10:00",
    opponent: "レイカーズ",
    homeAway: "HOME",
    venue: "ボールアリーナ",
  },
  {
    id: "g5",
    date: "2026.07.12",
    time: "11:00",
    opponent: "ウォリアーズ",
    homeAway: "AWAY",
    venue: "チェイス・センター",
  },
  {
    id: "g6",
    date: "2026.07.14",
    time: "09:30",
    opponent: "サンズ",
    homeAway: "HOME",
    venue: "ボールアリーナ",
  },
  {
    id: "g7",
    date: "2026.07.16",
    time: "10:30",
    opponent: "グリズリーズ",
    homeAway: "AWAY",
    venue: "フェデックスフォーラム",
  },
];

export default function SchedulePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-pixel mb-10 text-lg text-gold sm:text-xl">
        試合スケジュール
      </h1>

      <div className="pixel-shadow overflow-x-auto border-2 border-gold">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-gold text-navy-dark">
              <th className="p-3 font-bold">日付</th>
              <th className="p-3 font-bold">時刻</th>
              <th className="p-3 font-bold">対戦相手</th>
              <th className="p-3 font-bold">H/A</th>
              <th className="p-3 font-bold">会場</th>
              <th className="p-3 font-bold">結果</th>
            </tr>
          </thead>
          <tbody>
            {GAMES.map((game, index) => (
              <tr
                key={game.id}
                className={
                  index % 2 === 0 ? "bg-navy" : "bg-navy-dark"
                }
              >
                <td className="p-3 text-foreground/80">{game.date}</td>
                <td className="p-3 text-foreground/60">{game.time}</td>
                <td className="p-3 font-bold text-foreground">
                  {game.opponent}
                </td>
                <td className="p-3">
                  <span
                    className={
                      game.homeAway === "HOME"
                        ? "text-gold"
                        : "text-foreground/50"
                    }
                  >
                    {game.homeAway}
                  </span>
                </td>
                <td className="p-3 text-foreground/60">{game.venue}</td>
                <td className="p-3">
                  {game.result ? (
                    <span className="font-bold text-foreground">
                      {game.result}
                    </span>
                  ) : (
                    <span className="text-foreground/40">試合前</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
