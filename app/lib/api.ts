const NUGGETS_FEED_URL = process.env.NUGGETS_FEED_URL ?? "http://localhost:8000";

export type SourceType = "text" | "youtube" | "podcast";

export type Article = {
  id: number;
  source_name: string;
  source_type: SourceType;
  title: string;
  url: string;
  published_at: string | null;
  collected_at: string;
  author: string | null;
  summary_ja: string | null;
  key_speakers: string[];
  topics: string[];
  sentiment: string | null;
  has_translation: boolean;
};

export type GetArticlesParams = {
  source?: string;
  type?: SourceType;
  keyword?: string;
  limit?: number;
};

export async function getArticles(
  params: GetArticlesParams = {}
): Promise<Article[]> {
  const { source, type, keyword, limit } = params;

  const searchParams = new URLSearchParams();
  if (source && source !== "all") {
    searchParams.set("source", source);
  }
  const query = searchParams.toString();

  let articles: Article[];
  try {
    const res = await fetch(
      `${NUGGETS_FEED_URL}/api/articles${query ? `?${query}` : ""}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch articles: ${res.status}`);
    }
    articles = await res.json();
  } catch (error) {
    console.error("[getArticles] failed to fetch from Nuggets Feed:", error);
    return [];
  }

  if (type) {
    articles = articles.filter((article) => article.source_type === type);
  }

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    articles = articles.filter((article) => {
      const haystack = [
        article.title,
        article.summary_ja ?? "",
        article.author ?? "",
        ...article.topics,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(lowerKeyword);
    });
  }

  if (typeof limit === "number") {
    articles = articles.slice(0, limit);
  }

  return articles;
}

export type ArticleDetail = Article & {
  translation_ja: string | null;
};

export async function getArticle(id: number): Promise<ArticleDetail | null> {
  try {
    const res = await fetch(`${NUGGETS_FEED_URL}/api/articles/${id}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`Failed to fetch article ${id}: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(
      `[getArticle] failed to fetch id=${id} from Nuggets Feed:`,
      error
    );
    return null;
  }
}

export async function getSources(): Promise<string[]> {
  try {
    const res = await fetch(`${NUGGETS_FEED_URL}/api/article_sources`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch sources: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("[getSources] failed to fetch from Nuggets Feed:", error);
    return [];
  }
}

export type WeeklySummary = {
  id: number;
  week_start: string;
  week_end: string;
  content: string;
  article_count: number;
  created_at: string;
};

export async function getWeeklySummaries(): Promise<WeeklySummary[]> {
  try {
    const res = await fetch(`${NUGGETS_FEED_URL}/api/weekly_summaries`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch weekly summaries: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(
      "[getWeeklySummaries] failed to fetch from Nuggets Feed:",
      error
    );
    return [];
  }
}

export async function getWeeklySummary(
  id: number
): Promise<WeeklySummary | null> {
  try {
    const res = await fetch(`${NUGGETS_FEED_URL}/api/weekly_summaries/${id}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`Failed to fetch weekly summary ${id}: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(
      `[getWeeklySummary] failed to fetch id=${id} from Nuggets Feed:`,
      error
    );
    return null;
  }
}
