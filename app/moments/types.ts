// Moments library: hand-curated Nuggets highlights and off-court clips.
// Data lives in ./data.ts as a static file — no DB, no API call at request time.

export type MomentKind = "play" | "offcourt";

export type MomentCategory =
  | "highlight"
  | "oddity"
  | "record"
  | "clutch"
  | "interview"
  | "behind-the-scenes";

export type VideoProvider = "youtube" | "x" | "instagram" | "other";

export type MomentVideo = {
  provider: VideoProvider;
  url: string;
  /**
   * Whether the clip can be played inside the page. YouTube gives no reliable
   * way to check this ahead of time (it depends on the uploader's embed
   * setting), so it is recorded by hand: set false and the card links out
   * instead of embedding.
   */
  embeddable: boolean;
  /** Jump straight to the moment instead of the start of the video. */
  startSeconds?: number;
  /** Shown when a moment carries more than one clip (e.g. "別アングル"). */
  label?: string;
};

export type Moment = {
  /** URL slug — also the React key and the anchor used by related links. */
  id: string;
  kind: MomentKind;
  categories: MomentCategory[];
  title: string;
  /** Local (US) date of the moment, YYYY-MM-DD. Always required. */
  date: string;
  /** Free-form label for when the plain date isn't the useful handle. */
  dateLabel?: string;
  /** e.g. "2023-24" */
  season?: string;
  /** Links to the NBA schedule feed's gameId, so moments can be grouped by game. */
  gameId?: string;
  /** Opponent tricode, e.g. "LAL". Omit for off-court moments. */
  opponent?: string;
  /** English names only, matching ./people.ts. */
  people: string[];
  story: string;
  videos: MomentVideo[];
};
