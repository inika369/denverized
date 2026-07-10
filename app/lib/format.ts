const HIGHLIGHT_HEADING = "【新情報・注目ニュース】";

export function extractHighlightSummary(
  summaryJa: string | null
): string | null {
  if (!summaryJa) return null;

  const startIdx = summaryJa.indexOf(HIGHLIGHT_HEADING);
  if (startIdx === -1) return null;

  const rest = summaryJa.slice(startIdx + HIGHLIGHT_HEADING.length);
  const nextHeadingIdx = rest.search(/【[^】]+】/);
  const content = nextHeadingIdx === -1 ? rest : rest.slice(0, nextHeadingIdx);

  return content.trim() || null;
}

export function formatPublishedAt(publishedAt: string | null): string {
  if (!publishedAt) return "";

  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export type SummarySection = {
  heading: string;
  body: string;
};

export function parseSummarySections(
  summaryJa: string | null
): SummarySection[] {
  if (!summaryJa) return [];

  const headingRegex = /【([^】]+)】/g;
  const matches = [...summaryJa.matchAll(headingRegex)];

  return matches.map((match, index) => {
    const heading = match[1];
    const start = match.index! + match[0].length;
    const end =
      index + 1 < matches.length ? matches[index + 1].index! : summaryJa.length;

    return { heading, body: summaryJa.slice(start, end).trim() };
  });
}

export function formatWeekLabel(weekStart: string): string {
  const date = new Date(weekStart);
  if (Number.isNaN(date.getTime())) return weekStart;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const weekOfMonth = Math.ceil(date.getDate() / 7);

  return `${year}年${month}月第${weekOfMonth}週`;
}

export function getPlainTextPreview(
  markdown: string,
  maxLength = 200
): string {
  const plain = markdown
    .replace(/^#{1,3}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/^[-・*]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  return plain.length > maxLength
    ? `${plain.slice(0, maxLength)}…`
    : plain;
}
