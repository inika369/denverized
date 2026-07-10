import type { ScheduleGame, ScheduleTeam } from "../lib/api";

function TeamLabel({
  team,
  highlight,
}: {
  team: ScheduleTeam;
  highlight: boolean;
}) {
  return (
    <span className={highlight ? "font-bold text-gold" : "text-foreground/70"}>
      {team.name} <span className="text-xs">({team.abbreviation})</span>
    </span>
  );
}

export default function ScheduleGameCard({ game }: { game: ScheduleGame }) {
  const isFinished = game.status === "finished";
  const nuggetsScore = game.isHome ? game.homeScore : game.awayScore;
  const opponentScore = game.isHome ? game.awayScore : game.homeScore;
  const isWin =
    isFinished && nuggetsScore !== null && opponentScore !== null
      ? nuggetsScore > opponentScore
      : null;

  const containerClass = !isFinished
    ? "border-navy-light bg-navy"
    : isWin
      ? "border-gold bg-gold/15"
      : "border-navy-light bg-gray-700/25";

  return (
    <div
      className={`flex flex-col gap-3 border-2 p-5 sm:flex-row sm:items-center sm:justify-between ${containerClass}`}
    >
      <div className="flex flex-col gap-1">
        <p className="text-xs text-foreground/50">{game.jstDateTime}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <TeamLabel team={game.awayTeam} highlight={!game.isHome} />
          <span className="text-foreground/40">@</span>
          <TeamLabel team={game.homeTeam} highlight={game.isHome} />
        </div>
        <p className="text-xs text-foreground/50">{game.arenaName}</p>
      </div>

      <div className="flex items-center gap-4">
        {isFinished ? (
          <div className="text-right">
            <p
              className={`text-2xl font-bold ${
                isWin ? "text-gold" : "text-foreground/70"
              }`}
            >
              {nuggetsScore} - {opponentScore}
            </p>
            <p
              className={`text-xs font-bold ${
                isWin ? "text-gold" : "text-foreground/50"
              }`}
            >
              {isWin ? "WIN" : "LOSE"}
            </p>
          </div>
        ) : (
          <span className="w-fit border border-gold px-3 py-1 text-xs font-bold text-gold">
            予定
          </span>
        )}
      </div>
    </div>
  );
}
