import type { MomentCategory, MomentKind } from "./types";

export const KIND_LABELS: Record<MomentKind, string> = {
  play: "プレー",
  offcourt: "オフコート",
};

export const CATEGORY_LABELS: Record<MomentCategory, string> = {
  highlight: "名場面",
  oddity: "珍場面",
  record: "記録達成",
  clutch: "クラッチ",
  interview: "インタビュー",
  "behind-the-scenes": "舞台裏",
};

// Which categories belong under which kind, used to group the filter chips.
// A moment may still carry any category regardless of its kind.
export const CATEGORIES_BY_KIND: Record<MomentKind, MomentCategory[]> = {
  play: ["highlight", "oddity", "record", "clutch"],
  offcourt: ["interview", "behind-the-scenes", "oddity"],
};

export const CATEGORY_ORDER: MomentCategory[] = [
  "highlight",
  "clutch",
  "record",
  "oddity",
  "interview",
  "behind-the-scenes",
];
