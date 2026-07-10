import type { Metadata } from "next";
import Link from "next/link";
import { getWeeklySummaries } from "../lib/api";
import { formatWeekLabel, getPlainTextPreview } from "../lib/format";

export const metadata: Metadata = {
  title: "特集 | DENVERIZED.JP",
};

export default async function FeaturesPage() {
  const summaries = await getWeeklySummaries();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-pixel mb-10 text-lg text-gold sm:text-xl">
        特集・週次まとめ
      </h1>

      {summaries.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {summaries.map((summary) => (
            <article
              key={summary.id}
              className="pixel-shadow flex flex-col gap-4 border-2 border-gold bg-navy p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-pixel text-[10px] text-gold">
                  {formatWeekLabel(summary.week_start)}
                </p>
                <span className="text-xs text-foreground/50">
                  参照記事 {summary.article_count} 件
                </span>
              </div>

              <p className="text-sm leading-relaxed text-foreground/70">
                {getPlainTextPreview(summary.content)}
              </p>

              <Link
                href={`/features/${summary.id}`}
                className="mt-auto w-fit bg-gold px-4 py-2 text-xs font-bold text-navy-dark transition-transform hover:-translate-y-0.5"
              >
                全文を読む &rarr;
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-foreground/60">
          週次まとめはまだありません。
        </p>
      )}
    </div>
  );
}
