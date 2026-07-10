import Link from "next/link";
import NewsCard from "./components/NewsCard";
import FeatureCard from "./components/FeatureCard";
import GameCard, { type GameItem } from "./components/GameCard";
import {
  getArticles,
  getNuggetsSchedule,
  getWeeklySummaries,
  type ScheduleGame,
} from "./lib/api";

const UPCOMING_GAMES_LIMIT = 3;

function toGameItem(game: ScheduleGame): GameItem {
  const opponent = game.isHome ? game.awayTeam : game.homeTeam;
  const [, month, day] = game.date.split("-");
  const time = game.jstDateTime.match(/(\d{1,2}:\d{2})$/)?.[1] ?? "";

  let result: string | undefined;
  if (
    game.status === "finished" &&
    game.homeScore !== null &&
    game.awayScore !== null
  ) {
    const nuggetsScore = game.isHome ? game.homeScore : game.awayScore;
    const opponentScore = game.isHome ? game.awayScore : game.homeScore;
    result = `${nuggetsScore > opponentScore ? "W" : "L"} ${nuggetsScore}-${opponentScore}`;
  }

  return {
    id: game.gameId,
    date: `${month}/${day}`,
    time,
    opponent: opponent.name,
    homeAway: game.isHome ? "HOME" : "AWAY",
    venue: game.arenaName,
    result,
  };
}

export default async function Home() {
  const [latestNews, schedule, weeklySummaries] = await Promise.all([
    getArticles({ limit: 3 }),
    getNuggetsSchedule(),
    getWeeklySummaries(),
  ]);

  const latestSummary = weeklySummaries[0] ?? null;

  const todayStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
  }).format(new Date());

  const upcomingGames = schedule
    .filter((game) => game.date >= todayStr)
    .slice(0, UPCOMING_GAMES_LIMIT)
    .map(toGameItem);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="crt-lines border-b-4 border-gold bg-navy px-4 py-10 text-center sm:px-6 sm:py-14">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
          <h1 className="font-sans text-3xl font-black text-gold sm:text-5xl">
            デンバライズド.JP
          </h1>
          <p className="text-sm text-foreground/80 sm:text-base">
            デンバー・ナゲッツ情報をもっと深く
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/news"
              className="pixel-shadow-sm bg-gold px-5 py-2 text-xs font-bold text-navy-dark transition-transform hover:-translate-y-0.5"
            >
              最新ニュースを見る
            </Link>
            <Link
              href="/schedule"
              className="border-2 border-gold px-5 py-2 text-xs font-bold text-gold transition-transform hover:-translate-y-0.5"
            >
              スケジュールを見る
            </Link>
          </div>
        </div>
      </section>

      {/* Latest news */}
      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-pixel text-sm text-gold sm:text-base">
              最新ニュース
            </h2>
            <Link
              href="/news"
              className="text-xs font-bold text-foreground/60 hover:text-gold"
            >
              一覧を見る &rarr;
            </Link>
          </div>
          {latestNews.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {latestNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground/60">
              ニュースを読み込めませんでした。
            </p>
          )}
        </div>
      </section>

      {/* Weekly feature */}
      <section className="border-y-4 border-navy-light bg-navy-dark px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-pixel text-sm text-gold sm:text-base">
              今週のまとめ
            </h2>
            <Link
              href="/features"
              className="text-xs font-bold text-foreground/60 hover:text-gold"
            >
              バックナンバー &rarr;
            </Link>
          </div>
          {latestSummary ? (
            <FeatureCard summary={latestSummary} />
          ) : (
            <p className="text-sm text-foreground/60">
              週次まとめはまだありません。
            </p>
          )}
        </div>
      </section>

      {/* Schedule */}
      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-pixel text-sm text-gold sm:text-base">
              試合スケジュール
            </h2>
            <Link
              href="/schedule"
              className="text-xs font-bold text-foreground/60 hover:text-gold"
            >
              全試合を見る &rarr;
            </Link>
          </div>
          {upcomingGames.length > 0 ? (
            <div className="flex flex-col gap-4">
              {upcomingGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground/60">
              現在予定されている試合はありません。
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
