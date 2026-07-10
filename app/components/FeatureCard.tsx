import Link from "next/link";
import type { WeeklySummary } from "../lib/api";
import { formatWeekLabel, getPlainTextPreview } from "../lib/format";

export default function FeatureCard({ summary }: { summary: WeeklySummary }) {
  return (
    <article className="pixel-shadow flex flex-col gap-4 border-2 border-gold bg-navy p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-pixel text-[10px] text-gold">
          {formatWeekLabel(summary.week_start)}
        </p>
        <span className="text-xs text-foreground/50">
          参照記事 {summary.article_count} 件
        </span>
      </div>

      <p className="text-sm leading-relaxed text-foreground/70 sm:text-base">
        {getPlainTextPreview(summary.content)}
      </p>

      <Link
        href={`/features/${summary.id}`}
        className="mt-auto w-fit bg-gold px-4 py-2 text-xs font-bold text-navy-dark transition-transform hover:-translate-y-0.5"
      >
        全文を読む &rarr;
      </Link>
    </article>
  );
}
