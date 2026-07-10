"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Article } from "../lib/api";
import { formatPublishedAt } from "../lib/format";
import {
  DEFAULT_SENTIMENT_STYLE,
  SENTIMENT_STYLES,
  SOURCE_ACTION_LABELS,
  SOURCE_TYPE_LABELS,
} from "../lib/labels";
import SummarySections from "../components/SummarySections";

export default function ArticleModal({
  article,
  onClose,
}: {
  article: Article | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!article) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [article, onClose]);

  if (!article) return null;

  const dateLabel = formatPublishedAt(article.published_at);
  const actionLabel =
    SOURCE_ACTION_LABELS[article.source_type] ?? "元記事を読む";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pixel-shadow relative max-h-[85vh] w-full max-w-2xl overflow-y-auto border-2 border-gold bg-navy p-6 sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="閉じる"
          className="absolute right-4 top-4 text-xl font-bold text-foreground/60 hover:text-gold"
        >
          ×
        </button>

        <div className="flex flex-wrap items-center gap-2 pr-8">
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
        <h2 className="mt-1 text-lg font-bold leading-snug text-foreground">
          {article.title}
        </h2>
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

        <div className="mt-8 flex flex-wrap gap-3">
          {article.source_type === "text" ? (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold px-4 py-2 text-xs font-bold text-navy-dark transition-transform hover:-translate-y-0.5"
            >
              {actionLabel} &rarr;
            </a>
          ) : (
            <>
              <Link
                href={`/news/${article.id}`}
                className="bg-gold px-4 py-2 text-xs font-bold text-navy-dark transition-transform hover:-translate-y-0.5"
              >
                全文を読む &rarr;
              </Link>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-gold px-4 py-2 text-xs font-bold text-gold transition-transform hover:-translate-y-0.5"
              >
                {actionLabel} &rarr;
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
