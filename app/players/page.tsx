import type { Metadata } from "next";
import PlayerCard, { type PlayerItem } from "../components/PlayerCard";

export const metadata: Metadata = {
  title: "選手紹介 | DENVERIZED.JP",
};

const PLAYERS: PlayerItem[] = [
  {
    id: "p1",
    number: 15,
    name: "N. Jokic",
    nameJa: "ニコラ・ヨキッチ",
    position: "C",
    height: "211cm",
    bio: "圧倒的なパスセンスと得点力を兼ね備えるチームの核。複数年MVPを獲得したリーグ屈指のセンター。",
  },
  {
    id: "p2",
    number: 27,
    name: "J. Murray",
    nameJa: "ジャマール・マレー",
    position: "PG",
    height: "191cm",
    bio: "勝負強いシュートセレクションが持ち味のポイントガード。ヨキッチとのコンビネーションでチームを牽引する。",
  },
  {
    id: "p3",
    number: 9,
    name: "M. Porter Jr.",
    nameJa: "マイケル・ポーター・ジュニア",
    position: "SF",
    height: "208cm",
    bio: "高い位置からの3ポイントを武器にするスコアラー。長身を活かしたシューティングレンジの広さが魅力。",
  },
  {
    id: "p4",
    number: 5,
    name: "A. Gordon",
    nameJa: "アーロン・ゴードン",
    position: "PF",
    height: "203cm",
    bio: "攻守両面で貢献するオールラウンダー。ダイナミックなフィニッシュとタフなディフェンスが持ち味。",
  },
  {
    id: "p5",
    number: 3,
    name: "P. Watson",
    nameJa: "ペイトン・ワトソン",
    position: "SG",
    height: "198cm",
    bio: "運動能力を活かしたトランジションプレーが光る若手ウィング。年々出場機会を増やしている注目株。",
  },
  {
    id: "p6",
    number: 12,
    name: "Z. Braun",
    nameJa: "ザイリー・ブラウン",
    position: "PG",
    height: "196cm",
    bio: "エネルギッシュなプレースタイルでベンチを活性化するコンボガード。地元出身でファンからの人気も高い。",
  },
];

export default function PlayersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-pixel mb-10 text-lg text-gold sm:text-xl">
        選手紹介
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLAYERS.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
