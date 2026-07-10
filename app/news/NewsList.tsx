"use client";

import { useMemo, useState } from "react";
import NewsCard from "../components/NewsCard";
import ArticleModal from "./ArticleModal";
import type { Article, SourceType } from "../lib/api";

const TYPE_OPTIONS: { value: SourceType | "all"; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "text", label: "記事" },
  { value: "youtube", label: "YouTube" },
  { value: "podcast", label: "ポッドキャスト" },
];

export default function NewsList({
  articles,
  sources,
}: {
  articles: Article[];
  sources: string[];
}) {
  const [source, setSource] = useState("all");
  const [type, setType] = useState<SourceType | "all">("all");
  const [keyword, setKeyword] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(
    null
  );

  const filtered = useMemo(() => {
    const lowerKeyword = keyword.trim().toLowerCase();

    return articles.filter((article) => {
      if (source !== "all" && article.source_name !== source) return false;
      if (type !== "all" && article.source_type !== type) return false;

      if (lowerKeyword) {
        const haystack = [
          article.title,
          article.summary_ja ?? "",
          article.author ?? "",
          ...article.topics,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(lowerKeyword)) return false;
      }

      return true;
    });
  }, [articles, source, type, keyword]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setType(option.value)}
              className={`px-4 py-2 text-xs font-bold transition-colors ${
                type === option.value
                  ? "bg-gold text-navy-dark"
                  : "border-2 border-navy-light text-foreground/60 hover:border-gold hover:text-gold"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border-2 border-navy-light bg-navy px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
          >
            <option value="all">すべてのソース</option>
            {sources.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="キーワード検索"
            className="min-w-[200px] flex-1 border-2 border-navy-light bg-navy px-3 py-2 text-xs text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onClick={() => setSelectedArticle(article)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-foreground/60">
          該当するニュースはありません。
        </p>
      )}

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
}
