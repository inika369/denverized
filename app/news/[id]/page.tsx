import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "../../lib/api";
import { formatPublishedAt } from "../../lib/format";
import {
  DEFAULT_SENTIMENT_STYLE,
  SENTIMENT_STYLES,
  SOURCE_ACTION_LABELS,
  SOURCE_TYPE_LABELS,
} from "../../lib/labels";
import SummarySections from "../../components/SummarySections";
import TranslationToggle from "./TranslationToggle";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const articleId = Number(id);
  const article = Number.isInteger(articleId)
    ? await getArticle(articleId)
    : null;

  return {
    title: article
      ? `${article.title} | DENVERIZED.JP`
      : "ニュース | DENVERIZED.JP",
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const articleId = Number(id);

  if (!Number.isInteger(articleId)) {
    notFound();
  }

  const article = await getArticle(articleId);

  if (!article) {
    notFound();
  }

  const dateLabel = formatPublishedAt(article.published_at);
  const actionLabel =
    SOURCE_ACTION_LABELS[article.source_type] ?? "元記事を読む";
  const showTranslation =
    (article.source_type === "youtube" || article.source_type === "podcast") &&
    article.translation_ja;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link
        href="/news"
        className="mb-8 inline-block text-xs font-bold text-foreground/60 hover:text-gold"
      >
        &larr; ニュース一覧に戻る
      </Link>

      <div className="pixel-shadow border-2 border-gold bg-navy p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="border border-navy-light px-2 py-1 text-[10px] text-foreground/60">
            {SOURCE_TYPE_LABELS[article.source_type] ?? article.source_type}
          </span>
          {article.sentiment && (
            <span
              className={`px-2 py-1 text-[10px] font-bold ${
                SENTIMENT_STYLES[article.sentiment] ?? DEFAULT_SENTIMENT_STYLE
              }`}
            >
              {article.sentiment}
            </span>
          )}
          {dateLabel && (
            <time className="text-xs text-foreground/50">{dateLabel}</time>
          )}
        </div>

        <p className="mt-3 text-xs font-bold text-gold">
          {article.source_name}
        </p>
        <h1 className="mt-1 text-xl font-bold leading-snug text-foreground sm:text-2xl">
          {article.title}
        </h1>
        {article.author && (
          <p className="mt-1 text-xs text-foreground/50">{article.author}</p>
        )}

        {article.topics.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {article.topics.map((topic) => (
              <li
                key={topic}
                className="bg-gold px-2 py-1 text-[10px] font-bold text-navy-dark"
              >
                #{topic}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 border-t-2 border-navy-light pt-6">
          <SummarySections summaryJa={article.summary_ja} />
        </div>

        {showTranslation && (
          <TranslationToggle translation={article.translation_ja as string} />
        )}

        <div className="mt-8">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gold px-4 py-2 text-xs font-bold text-navy-dark transition-transform hover:-translate-y-0.5"
          >
            {actionLabel} &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
