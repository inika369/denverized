export type PlayerItem = {
  id: string;
  number: number;
  name: string;
  nameJa: string;
  position: string;
  height: string;
  bio: string;
};

export default function PlayerCard({ player }: { player: PlayerItem }) {
  return (
    <article className="pixel-shadow-sm flex flex-col border-2 border-navy-light bg-navy">
      <div className="flex items-center justify-between border-b-2 border-navy-light bg-navy-light/40 p-4">
        <span className="font-pixel text-2xl text-gold">
          {String(player.number).padStart(2, "0")}
        </span>
        <span className="border border-gold px-2 py-1 text-[10px] font-bold text-gold">
          {player.position}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold text-foreground">{player.nameJa}</h3>
        <p className="text-xs uppercase tracking-wide text-foreground/50">
          {player.name}
        </p>
        <p className="text-xs text-foreground/50">身長 {player.height}</p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/70">
          {player.bio}
        </p>
      </div>
    </article>
  );
}
