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

const NBA_SCHEDULE_URL =
  "https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2025/league/00_full_schedule.json";

const NUGGETS_TEAM_ID = 1610612743;

type NbaTeamSide = {
  tid: number;
  ta: string;
  tn: string;
  tc: string;
  s: string;
};

type NbaGame = {
  gid: string;
  gdte: string;
  an: string;
  st: string;
  gdtutc: string;
  utctm: string;
  v: NbaTeamSide;
  h: NbaTeamSide;
};

type NbaScheduleResponse = {
  lscd: { mscd: { mon: string; g: NbaGame[] } }[];
};

export type ScheduleTeam = {
  name: string;
  abbreviation: string;
};

export type ScheduleGame = {
  gameId: string;
  date: string;
  homeTeam: ScheduleTeam;
  awayTeam: ScheduleTeam;
  homeScore: number | null;
  awayScore: number | null;
  isHome: boolean;
  status: "scheduled" | "finished";
  arenaName: string;
  jstDateTime: string;
};

function formatJstDate(gdtutc: string, utctm: string): string {
  const utcInstant = new Date(`${gdtutc}T${utctm}:00Z`);
  if (Number.isNaN(utcInstant.getTime())) return gdtutc;

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(utcInstant);
}

function formatJstDateTime(gdtutc: string, utctm: string): string {
  const utcInstant = new Date(`${gdtutc}T${utctm}:00Z`);
  if (Number.isNaN(utcInstant.getTime())) return "";

  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(utcInstant);
}

export async function getNuggetsSchedule(): Promise<ScheduleGame[]> {
  try {
    const res = await fetch(NBA_SCHEDULE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.nba.com/",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch NBA schedule: ${res.status}`);
    }

    const data: NbaScheduleResponse = await res.json();

    const games: ScheduleGame[] = [];
    for (const month of data.lscd) {
      for (const g of month.mscd.g) {
        // Regular season games only (gid prefix "002"); excludes preseason ("001").
        if (!g.gid.startsWith("002")) continue;
        if (g.v.tid !== NUGGETS_TEAM_ID && g.h.tid !== NUGGETS_TEAM_ID) continue;

        const isHome = g.h.tid === NUGGETS_TEAM_ID;
        const finished = g.st === "3";

        games.push({
          gameId: g.gid,
          date: formatJstDate(g.gdtutc, g.utctm),
          homeTeam: { name: `${g.h.tc} ${g.h.tn}`, abbreviation: g.h.ta },
          awayTeam: { name: `${g.v.tc} ${g.v.tn}`, abbreviation: g.v.ta },
          homeScore: finished && g.h.s ? Number(g.h.s) : null,
          awayScore: finished && g.v.s ? Number(g.v.s) : null,
          isHome,
          status: finished ? "finished" : "scheduled",
          arenaName: g.an,
          jstDateTime: formatJstDateTime(g.gdtutc, g.utctm),
        });
      }
    }

    games.sort((a, b) => a.date.localeCompare(b.date));
    return games;
  } catch (error) {
    console.error(
      "[getNuggetsSchedule] failed to fetch NBA schedule:",
      error
    );
    return [];
  }
}
