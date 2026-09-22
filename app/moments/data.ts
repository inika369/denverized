import type { Moment } from "./types";

/**
 * The moments library.
 *
 * Adding an entry: append to this array. `id`, `kind`, `title`, `date`,
 * `people` and `story` are required; everything else is optional. Order here
 * doesn't matter — the pages sort by date descending.
 *
 * `gameId` links a moment to the NBA schedule feed used by app/lib/api.ts.
 * That feed only carries the current season, so historical moments leave it
 * unset; moments sharing a gameId are surfaced as related to each other.
 *
 * `embeddable` records whether the clip plays inside the page. YouTube exposes
 * no reliable way to detect this up front, so it is set by hand — verify once
 * when adding the moment and set false if the player refuses to load.
 */
export const MOMENTS: Moment[] = [
  {
    id: "murray-buzzer-beater-lakers-2024-g2",
    kind: "play",
    categories: ["clutch", "highlight"],
    title: "Jamal Murray、Lakers戦Game 2をブザービーターで決める",
    date: "2024-04-22",
    dateLabel: "2024年 プレーオフ1回戦 Game 2",
    season: "2023-24",
    opponent: "LAL",
    people: ["Jamal Murray", "Nikola Jokic", "Anthony Davis", "LeBron James"],
    story:
      "後半に一時20点差をつけられた展開から追い上げ、同点で迎えた最終局面。Jamal MurrayがAnthony Davisを相手にステップバックのフェイダウェイをブザーと同時に沈め、101-99で勝利した。Murrayは第4クォーターだけで14点を挙げ、Nikola Jokicは27得点20リバウンド10アシストのトリプルダブル。シリーズを2勝0敗とした。",
    videos: [
      {
        provider: "youtube",
        url: "https://www.youtube.com/watch?v=6pZ9m6K6X8A",
        embeddable: true,
      },
      {
        provider: "youtube",
        url: "https://www.youtube.com/watch?v=koV1UUMExTI",
        embeddable: true,
        label: "ラスト1分",
      },
    ],
  },
  {
    id: "murray-series-clincher-lakers-2024-g5",
    kind: "play",
    categories: ["clutch"],
    title: "Jamal Murray、再びの決勝弾でLakersを退ける",
    date: "2024-04-29",
    dateLabel: "2024年 プレーオフ1回戦 Game 5",
    season: "2023-24",
    opponent: "LAL",
    people: ["Jamal Murray", "Nikola Jokic"],
    story:
      "同じシリーズで2度目の決勝ショット。残りわずかの場面でMurrayが放ったジャンパーが決まり、108-106でLakersを下してシリーズを4勝1敗で突破した。Murrayはこの試合32得点。",
    videos: [
      {
        provider: "youtube",
        url: "https://www.youtube.com/watch?v=T3xk9vay5tE",
        embeddable: true,
      },
    ],
  },
  {
    id: "nuggets-first-title-2023-finals-g5",
    kind: "play",
    categories: ["record", "highlight"],
    title: "Nuggets、球団史上初のNBAチャンピオンに",
    date: "2023-06-12",
    dateLabel: "2023年 NBAファイナル Game 5",
    season: "2022-23",
    opponent: "MIA",
    people: [
      "Nikola Jokic",
      "Jamal Murray",
      "Aaron Gordon",
      "Michael Porter Jr.",
      "Kentavious Caldwell-Pope",
      "Bruce Brown",
      "Michael Malone",
    ],
    story:
      "Ball ArenaでのGame 5、Miami Heatを94-89で下しシリーズを4勝1敗で制覇。1976年のNBA参入以来初、球団創設から47年目にして初の優勝となった。Nikola Jokicは28得点16リバウンドを記録しファイナルMVPを受賞。",
    videos: [
      {
        provider: "youtube",
        url: "https://www.youtube.com/watch?v=xFNvnOa2M14",
        embeddable: true,
        label: "ラスト14秒",
      },
      {
        provider: "youtube",
        url: "https://www.youtube.com/watch?v=ucZZdf94LbI",
        embeddable: true,
        label: "Game 5 ハイライト",
      },
    ],
  },
  {
    id: "jokic-drafted-during-taco-bell-ad-2014",
    kind: "offcourt",
    categories: ["oddity", "behind-the-scenes"],
    title: "Nikola Jokic、タコベルのCM中に指名される",
    date: "2014-06-26",
    dateLabel: "2014年 NBAドラフト",
    people: ["Nikola Jokic"],
    story:
      "2014年のNBAドラフト2巡目41位でNuggetsがNikola Jokicを指名。ところが中継はタコベルのCMに入っており、指名の瞬間は全米に放送されなかった。のちに3度のMVPと優勝を経験する選手のキャリアが、CMの裏側で静かに始まった逸話としてたびたび語られている。",
    videos: [
      {
        provider: "youtube",
        url: "https://www.youtube.com/watch?v=1fQc0hirB-o",
        embeddable: true,
      },
    ],
  },
];
