import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWeeklySummary } from "../../lib/api";
import { formatWeekLabel } from "../../lib/format";
import { renderMarkdown } from "../../lib/markdown";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const summaryId = Number(id);
  const summary = Number.isInteger(summaryId)
    ? await getWeeklySummary(summaryId)
    : null;

  return {
    title: summary
      ? `${formatWeekLabel(summary.week_start)}のまとめ | DENVERIZED.JP`
      : "特集 | DENVERIZED.JP",
  };
}

export default async function FeatureDetailPage({ params }: Props) {
  const { id } = await params;
  const summaryId = Number(id);

  if (!Number.isInteger(summaryId)) {
    notFound();
  }

  const summary = await getWeeklySummary(summaryId);

  if (!summary) {
    notFound();
  }

  const html = renderMarkdown(summary.content);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link
        href="/features"
        className="mb-8 inline-block text-xs font-bold text-foreground/60 hover:text-gold"
      >
        &larr; 特集一覧に戻る
      </Link>

      <div className="pixel-shadow border-2 border-gold bg-navy p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-pixel text-xs text-gold sm:text-sm">
            {formatWeekLabel(summary.week_start)}
          </p>
          <span className="text-xs text-foreground/50">
            参照記事 {summary.article_count} 件
          </span>
        </div>

        <div
          className="weekly-content mt-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
