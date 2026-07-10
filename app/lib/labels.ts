import type { SourceType } from "./api";

export const SENTIMENT_STYLES: Record<string, string> = {
  楽観的: "bg-green-600 text-white",
  批判的: "bg-red-600 text-white",
  議論白熱: "bg-gold text-navy-dark",
  中立的: "bg-gray-500 text-white",
};

export const DEFAULT_SENTIMENT_STYLE = "bg-gray-500 text-white";

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  text: "記事",
  youtube: "YouTube",
  podcast: "ポッドキャスト",
};

export const SOURCE_ACTION_LABELS: Record<SourceType, string> = {
  text: "元記事を読む",
  youtube: "動画を見る",
  podcast: "音声を聞く",
};
