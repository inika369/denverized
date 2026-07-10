import Link from "next/link";
import NewsCard from "./components/NewsCard";
import FeatureCard, { type FeatureItem } from "./components/FeatureCard";
import GameCard, { type GameItem } from "./components/GameCard";
import { getArticles } from "./lib/api";

const LATEST_FEATURE: FeatureItem = {
  id: "f1",
  week: "WEEK 27 まとめ",
  title: "西カンファレンス首位攻防、ナゲッツが勝率を五分に押し戻す一週間",
  summary:
    "今週3連戦を2勝1敗で終えたナゲッツ。ヨキッチのトリプルダブル量産、若手ローテーションの躍動、そして次節に向けた課題を振り返る。",
  tags: ["ヨキッチ", "西カンファレンス", "週次レビュー"],
};

const UPCOMING_GAMES: GameItem[] = [
  {
    id: "g1",
    date: "07/10",
    time: "10:00",
    opponent: "レイカーズ",
    homeAway: "HOME",
    venue: "ボールアリーナ",
  },
  {
    id: "g2",
    date: "07/12",
    time: "11:00",
    opponent: "ウォリアーズ",
    homeAway: "AWAY",
    venue: "チェイス・センター",
  },
  {
    id: "g3",
    date: "07/14",
    time: "09:30",
    opponent: "サンズ",
    homeAway: "HOME",
    venue: "ボールアリーナ",
  },
];

export default async function Home() {
  const latestNews = await getArticles({ limit: 3 });

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
          <FeatureCard item={LATEST_FEATURE} />
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
          <div className="flex flex-col gap-4">
            {UPCOMING_GAMES.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
