export type GameItem = {
  id: string;
  date: string;
  time: string;
  opponent: string;
  homeAway: "HOME" | "AWAY";
  venue: string;
  result?: string;
};

export default function GameCard({ game }: { game: GameItem }) {
  return (
    <div className="pixel-shadow-sm flex flex-col gap-3 border-2 border-navy-light bg-navy p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="font-pixel text-center text-[10px] leading-loose text-gold">
          {game.date}
        </div>
        <div>
          <p className="text-xs text-foreground/50">{game.time} 開始</p>
          <p className="font-bold text-foreground">
            vs {game.opponent}{" "}
            <span
              className={`ml-1 text-xs font-normal ${
                game.homeAway === "HOME" ? "text-gold" : "text-foreground/50"
              }`}
            >
              {game.homeAway === "HOME" ? "(HOME)" : "(AWAY)"}
            </span>
          </p>
          <p className="text-xs text-foreground/50">{game.venue}</p>
        </div>
      </div>
      {game.result ? (
        <span className="w-fit bg-gold px-3 py-1 text-xs font-bold text-navy-dark">
          {game.result}
        </span>
      ) : (
        <span className="w-fit border border-navy-light px-3 py-1 text-xs text-foreground/60">
          試合前
        </span>
      )}
    </div>
  );
}
