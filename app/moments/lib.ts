import type { Moment, MomentVideo } from "./types";

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

/**
 * Accepts the watch, youtu.be, shorts and embed forms of a YouTube URL.
 * Returns null for anything else, including malformed input.
 */
export function getYouTubeId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (!YOUTUBE_HOSTS.has(parsed.hostname)) return null;

  if (parsed.hostname.endsWith("youtu.be")) {
    const id = parsed.pathname.slice(1).split("/")[0];
    return id || null;
  }

  const watchId = parsed.searchParams.get("v");
  if (watchId) return watchId;

  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments.length >= 2 && ["shorts", "embed", "live"].includes(segments[0])) {
    return segments[1];
  }

  return null;
}

export function getVideoThumbnail(video: MomentVideo): string | null {
  if (video.provider !== "youtube") return null;
  const id = getYouTubeId(video.url);
  // hqdefault exists for every video; maxresdefault 404s on older uploads.
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

/** Null when the clip must be opened on its own site instead of embedded. */
export function getEmbedUrl(video: MomentVideo): string | null {
  if (!video.embeddable || video.provider !== "youtube") return null;

  const id = getYouTubeId(video.url);
  if (!id) return null;

  const params = new URLSearchParams({ rel: "0" });
  if (video.startSeconds) {
    params.set("start", String(video.startSeconds));
  }

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export function getPrimaryVideo(moment: Moment): MomentVideo | null {
  return moment.videos[0] ?? null;
}

export function hasEmbeddableVideo(moment: Moment): boolean {
  return moment.videos.some((video) => getEmbedUrl(video) !== null);
}

/**
 * Formats the stored local date. The date string carries no timezone, so it is
 * split by hand rather than passed through `new Date()`, which would read it as
 * UTC and can shift the day when rendered.
 */
export function formatMomentDate(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return date;

  const [, year, month, day] = match;
  return `${year}年${Number(month)}月${Number(day)}日`;
}

/** The label shown to readers: the free-form one when set, else the date. */
export function getDateDisplay(moment: Moment): string {
  return moment.dateLabel ?? formatMomentDate(moment.date);
}

export function sortMomentsByDateDesc(moments: Moment[]): Moment[] {
  return [...moments].sort((a, b) => b.date.localeCompare(a.date));
}

/** Opponent tricodes present in the data, most-used first then alphabetical. */
export function collectOpponents(moments: Moment[]): string[] {
  const counts = new Map<string, number>();
  for (const moment of moments) {
    if (!moment.opponent) continue;
    counts.set(moment.opponent, (counts.get(moment.opponent) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tricode]) => tricode);
}

export function collectPeople(moments: Moment[]): string[] {
  const counts = new Map<string, number>();
  for (const moment of moments) {
    for (const person of moment.people) {
      counts.set(person, (counts.get(person) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name);
}

/**
 * Moments from the same game, then ones sharing a tagged person. Used for the
 * "related" rail on a detail page.
 */
export function getRelatedMoments(
  moment: Moment,
  all: Moment[],
  limit = 3
): Moment[] {
  const people = new Set(moment.people);

  const scored = all
    .filter((candidate) => candidate.id !== moment.id)
    .map((candidate) => {
      const sameGame =
        moment.gameId !== undefined && candidate.gameId === moment.gameId;
      const shared = candidate.people.filter((p) => people.has(p)).length;
      return { candidate, score: (sameGame ? 100 : 0) + shared };
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.candidate.date.localeCompare(a.candidate.date)
    );

  return scored.slice(0, limit).map((entry) => entry.candidate);
}
