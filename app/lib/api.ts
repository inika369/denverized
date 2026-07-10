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

const NBA_SUMMER_LEAGUE_URL =
  "https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_1.json";

const NBA_FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Referer: "https://www.nba.com/",
};

const NUGGETS_TEAM_ID = 1610612743;

export type ScheduleGameType =
  | "summer"
  | "preseason"
  | "regular"
  | "playoff"
  | "finals";

const GAME_TYPE_BY_GID_PREFIX: Record<string, ScheduleGameType> = {
  "001": "preseason",
  "002": "regular",
  "003": "playoff",
  "004": "finals",
};

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
  gameType: ScheduleGameType;
};

function formatJstDateFromInstant(instant: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

function formatJstDateTimeFromInstant(instant: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(instant);
}

async function fetchMainScheduleGames(): Promise<ScheduleGame[]> {
  try {
    const res = await fetch(NBA_SCHEDULE_URL, {
      headers: NBA_FETCH_HEADERS,
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch NBA schedule: ${res.status}`);
    }

    const data: NbaScheduleResponse = await res.json();

    const games: ScheduleGame[] = [];
    for (const month of data.lscd) {
      for (const g of month.mscd.g) {
        const gameType = GAME_TYPE_BY_GID_PREFIX[g.gid.slice(0, 3)];
        if (!gameType) continue;
        if (g.v.tid !== NUGGETS_TEAM_ID && g.h.tid !== NUGGETS_TEAM_ID) continue;

        const isHome = g.h.tid === NUGGETS_TEAM_ID;
        const finished = g.st === "3";
        const utcInstant = new Date(`${g.gdtutc}T${g.utctm}:00Z`);

        games.push({
          gameId: g.gid,
          date: Number.isNaN(utcInstant.getTime())
            ? g.gdte
            : formatJstDateFromInstant(utcInstant),
          homeTeam: { name: `${g.h.tc} ${g.h.tn}`, abbreviation: g.h.ta },
          awayTeam: { name: `${g.v.tc} ${g.v.tn}`, abbreviation: g.v.ta },
          homeScore: finished && g.h.s ? Number(g.h.s) : null,
          awayScore: finished && g.v.s ? Number(g.v.s) : null,
          isHome,
          status: finished ? "finished" : "scheduled",
          arenaName: g.an,
          jstDateTime: Number.isNaN(utcInstant.getTime())
            ? ""
            : formatJstDateTimeFromInstant(utcInstant),
          gameType,
        });
      }
    }

    return games;
  } catch (error) {
    console.error(
      "[getNuggetsSchedule] failed to fetch NBA schedule:",
      error
    );
    return [];
  }
}

type NbaV2Team = {
  teamId: number;
  teamTricode: string;
  teamName: string;
  teamCity: string;
  score: number;
};

type NbaV2Game = {
  gameId: string;
  gameDateTimeUTC?: string;
  gameStatus: number;
  gameLabel?: string;
  gameSubLabel?: string;
  arenaCity?: string;
  homeTeam: NbaV2Team;
  awayTeam: NbaV2Team;
  arenaName?: string;
};

type NbaV2Response = {
  leagueSchedule?: {
    gameDates?: { gameDate: string; games?: NbaV2Game[] }[];
  };
};

function isSummerLeagueGame(g: NbaV2Game): boolean {
  const label = `${g.gameLabel ?? ""} ${g.gameSubLabel ?? ""}`.toLowerCase();
  return label.includes("summer league") || g.arenaCity === "Las Vegas";
}

// Best-effort: NBA Summer League isn't part of the season schedule feed
// above, and this CDN endpoint (which otherwise mirrors the full season)
// has been unreliable/blocked in testing. Any failure here is swallowed
// and simply yields no summer-league games; entries are also filtered
// down to genuine Summer League games only, since this feed's regular
// content would otherwise duplicate the main schedule fetch.
async function fetchSummerLeagueGames(): Promise<ScheduleGame[]> {
  try {
    const res = await fetch(NBA_SUMMER_LEAGUE_URL, {
      headers: NBA_FETCH_HEADERS,
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(
        `Failed to fetch summer league schedule: ${res.status}`
      );
    }

    const data: NbaV2Response = await res.json();
    const games: ScheduleGame[] = [];

    for (const gameDate of data.leagueSchedule?.gameDates ?? []) {
      for (const g of gameDate.games ?? []) {
        if (!isSummerLeagueGame(g)) continue;

        const isNuggetsHome = g.homeTeam?.teamId === NUGGETS_TEAM_ID;
        const isNuggetsAway = g.awayTeam?.teamId === NUGGETS_TEAM_ID;
        if (!isNuggetsHome && !isNuggetsAway) continue;
        if (!g.gameDateTimeUTC) continue;

        const utcInstant = new Date(g.gameDateTimeUTC);
        if (Number.isNaN(utcInstant.getTime())) continue;

        const finished = g.gameStatus === 3;

        games.push({
          gameId: g.gameId,
          date: formatJstDateFromInstant(utcInstant),
          homeTeam: {
            name: `${g.homeTeam.teamCity} ${g.homeTeam.teamName}`,
            abbreviation: g.homeTeam.teamTricode,
          },
          awayTeam: {
            name: `${g.awayTeam.teamCity} ${g.awayTeam.teamName}`,
            abbreviation: g.awayTeam.teamTricode,
          },
          homeScore: finished ? (g.homeTeam.score ?? null) : null,
          awayScore: finished ? (g.awayTeam.score ?? null) : null,
          isHome: isNuggetsHome,
          status: finished ? "finished" : "scheduled",
          arenaName: g.arenaName ?? "",
          jstDateTime: formatJstDateTimeFromInstant(utcInstant),
          gameType: "summer",
        });
      }
    }

    return games;
  } catch (error) {
    console.error(
      "[getNuggetsSchedule] failed to fetch summer league schedule:",
      error
    );
    return [];
  }
}

type ManualGame = {
  id: number;
  game_type: ScheduleGameType;
  date: string;
  jst_datetime: string;
  home_team_name: string;
  away_team_name: string;
  home_team_abbr: string | null;
  away_team_abbr: string | null;
  is_home: boolean;
  arena_name: string | null;
  home_score: number | null;
  away_score: number | null;
  status: "scheduled" | "finished";
};

function toAbbreviation(name: string, abbr: string | null): string {
  return abbr && abbr.trim() ? abbr : name.slice(0, 3).toUpperCase();
}

// Manually-tracked games (e.g. Summer League) recorded in Nuggets Feed's own
// database, since the NBA feeds above don't reliably carry this data. These
// take priority over NBA-sourced entries when merged in getNuggetsSchedule().
export async function getManualGames(): Promise<ScheduleGame[]> {
  try {
    const res = await fetch(`${NUGGETS_FEED_URL}/api/games`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch manual games: ${res.status}`);
    }

    const games: ManualGame[] = await res.json();

    return games.map((g) => ({
      gameId: String(g.id),
      date: g.date,
      homeTeam: {
        name: g.home_team_name,
        abbreviation: toAbbreviation(g.home_team_name, g.home_team_abbr),
      },
      awayTeam: {
        name: g.away_team_name,
        abbreviation: toAbbreviation(g.away_team_name, g.away_team_abbr),
      },
      homeScore: g.home_score,
      awayScore: g.away_score,
      isHome: g.is_home,
      status: g.status,
      arenaName: g.arena_name ?? "",
      jstDateTime: g.jst_datetime,
      gameType: g.game_type,
    }));
  } catch (error) {
    console.error(
      "[getManualGames] failed to fetch from Nuggets Feed:",
      error
    );
    return [];
  }
}

export async function getNuggetsSchedule(): Promise<ScheduleGame[]> {
  const [mainGames, summerLeagueGames, manualGames] = await Promise.all([
    fetchMainScheduleGames(),
    fetchSummerLeagueGames(),
    getManualGames(),
  ]);

  // Merge by gameId; manual (Nuggets Feed) entries are added last so they
  // win over any NBA-sourced entry sharing the same id.
  const gamesById = new Map<string, ScheduleGame>();
  for (const game of [...mainGames, ...summerLeagueGames]) {
    gamesById.set(game.gameId, game);
  }
  for (const game of manualGames) {
    gamesById.set(game.gameId, game);
  }

  const games = [...gamesById.values()];
  games.sort((a, b) => a.date.localeCompare(b.date));
  return games;
}
