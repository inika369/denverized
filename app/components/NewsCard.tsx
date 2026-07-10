"use client";

import type { Article } from "../lib/api";
import { extractHighlightSummary, formatPublishedAt } from "../lib/format";
import {
  DEFAULT_SENTIMENT_STYLE,
  SENTIMENT_STYLES,
  SOURCE_TYPE_LABELS,
} from "../lib/labels";

const MAX_TOPICS = 5;

export default function NewsCard({
  article,
  onClick,
}: {
  article: Article;
  onClick?: () => void;
}) {
  const highlight = extractHighlightSummary(article.summary_ja);
  const dateLabel = formatPublishedAt(article.published_at);
  const topics = article.topics.slice(0, MAX_TOPICS);

  return (
    <article
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`pixel-shadow-sm flex h-full flex-col gap-3 border-2 border-navy-light bg-navy p-5 ${
        onClick
          ? "cursor-pointer transition-colors hover:border-gold"
          : ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="border border-navy-light px-2 py-1 text-[10px] text-foreground/60">
          {SOURCE_TYPE_LABELS[article.source_type] ?? article.source_type}
        </span>
        {dateLabel && (
          <time className="text-xs text-foreground/50">{dateLabel}</time>
        )}
      </div>

      <div>
        <p className="text-xs font-bold text-gold">{article.source_name}</p>

        {article.sentiment && (
          <span
            className={`mt-2 inline-block px-2 py-1 text-[10px] font-bold ${
              SENTIMENT_STYLES[article.sentiment] ?? DEFAULT_SENTIMENT_STYLE
            }`}
          >
            {article.sentiment}
          </span>
        )}

        <h3 className="mt-2 font-bold leading-snug text-foreground">
          {article.title}
        </h3>
        {article.author && (
          <p className="mt-1 text-xs text-foreground/50">{article.author}</p>
        )}
      </div>

      {highlight ? (
        <p className="line-clamp-3 text-sm leading-relaxed text-foreground/70">
          {highlight}
        </p>
      ) : (
        <p className="line-clamp-3 text-sm italic leading-relaxed text-foreground/40">
          要約準備中
        </p>
      )}

      {topics.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <li
              key={topic}
              className="bg-gold px-2 py-1 text-[10px] font-bold text-navy-dark"
            >
              #{topic}
            </li>
          ))}
        </ul>
      )}

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-auto pt-2 text-xs font-bold text-gold hover:underline"
      >
        元記事を読む &rarr;
      </a>
    </article>
  );
}
