/**
 * Validates every video referenced by app/moments/data.ts.
 *
 *   npm run check:moments
 *
 * Checks two things per YouTube clip:
 *   1. The video still exists (oEmbed returns 200). Dead links are the common
 *      failure — clips get deleted or made private long after being added.
 *   2. Whether the uploader allows embedding, read from the watch page's
 *      `playableInEmbed` flag. This is best-effort: when it can't be read the
 *      check is reported as unknown and the stored flag is left alone.
 *
 * Exits non-zero when a video is gone, or when `embeddable: true` is recorded
 * for a clip that YouTube says cannot be embedded.
 */
import { MOMENTS } from "../app/moments/data.ts";
import { getYouTubeId } from "../app/moments/lib.ts";

type Status = "ok" | "missing" | "not-embeddable" | "skipped";

const results: { moment: string; url: string; status: Status; note: string }[] =
  [];

async function videoExists(id: string): Promise<boolean> {
  const res = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
  );
  return res.ok;
}

/** null when the flag can't be found in the page. */
async function isEmbeddable(id: string): Promise<boolean | null> {
  const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
    headers: { "Accept-Language": "en-US,en;q=0.9" },
  });
  if (!res.ok) return null;

  const html = await res.text();
  const match = /"playableInEmbed":\s*(true|false)/.exec(html);
  return match ? match[1] === "true" : null;
}

for (const moment of MOMENTS) {
  for (const video of moment.videos) {
    if (video.provider !== "youtube") {
      results.push({
        moment: moment.id,
        url: video.url,
        status: "skipped",
        note: `provider=${video.provider} — 手動で確認`,
      });
      continue;
    }

    const id = getYouTubeId(video.url);
    if (!id) {
      results.push({
        moment: moment.id,
        url: video.url,
        status: "missing",
        note: "YouTube URL として解釈できない",
      });
      continue;
    }

    if (!(await videoExists(id))) {
      results.push({
        moment: moment.id,
        url: video.url,
        status: "missing",
        note: "動画が存在しない（削除・非公開）",
      });
      continue;
    }

    const embeddable = await isEmbeddable(id);
    if (embeddable === false && video.embeddable) {
      results.push({
        moment: moment.id,
        url: video.url,
        status: "not-embeddable",
        note: "embeddable: false に変更してください",
      });
      continue;
    }

    results.push({
      moment: moment.id,
      url: video.url,
      status: "ok",
      note:
        embeddable === null
          ? "埋め込み可否は判定不能（既存フラグを維持）"
          : `埋め込み ${embeddable ? "可" : "不可"}`,
    });
  }
}

const ICONS: Record<Status, string> = {
  ok: "OK  ",
  missing: "NG  ",
  "not-embeddable": "WARN",
  skipped: "SKIP",
};

for (const result of results) {
  console.log(
    `${ICONS[result.status]} ${result.moment}\n     ${result.url}\n     ${result.note}`
  );
}

const failures = results.filter(
  (r) => r.status === "missing" || r.status === "not-embeddable"
);

console.log(
  `\n${results.length} 件を検査、${failures.length} 件が要対応。`
);

if (failures.length > 0) {
  process.exitCode = 1;
}
