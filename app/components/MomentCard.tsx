import Image from "next/image";
import Link from "next/link";
import {
  getDateDisplay,
  getPrimaryVideo,
  getVideoThumbnail,
  hasEmbeddableVideo,
} from "../moments/lib";
import { CATEGORY_LABELS, KIND_LABELS } from "../moments/labels";
import { PERSON_ROLE_STYLES, getPersonRole } from "../moments/people";
import type { Moment } from "../moments/types";

const MAX_PEOPLE = 4;

export default function MomentCard({ moment }: { moment: Moment }) {
  const video = getPrimaryVideo(moment);
  const thumbnail = video ? getVideoThumbnail(video) : null;
  const embeddable = hasEmbeddableVideo(moment);
  const people = moment.people.slice(0, MAX_PEOPLE);
  const hiddenPeople = moment.people.length - people.length;

  return (
    <article className="pixel-shadow-sm flex h-full flex-col border-2 border-navy-light bg-navy transition-colors hover:border-gold">
      <Link
        href={`/moments/${moment.id}`}
        className="group relative block aspect-video w-full overflow-hidden border-b-2 border-navy-light bg-navy-dark"
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs text-foreground/30">
            動画未登録
          </span>
        )}

        <span className="absolute bottom-2 left-2 z-10 bg-navy-dark/90 px-2 py-1 text-[10px] font-bold text-gold">
          {embeddable ? "サイト内再生" : "外部サイト"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-gold px-2 py-1 text-[10px] font-bold text-navy-dark">
            {KIND_LABELS[moment.kind]}
          </span>
          {moment.categories.map((category) => (
            <span
              key={category}
              className="border border-navy-light px-2 py-1 text-[10px] text-foreground/70"
            >
              {CATEGORY_LABELS[category]}
            </span>
          ))}
        </div>

        <h3 className="font-bold leading-snug text-foreground">
          <Link href={`/moments/${moment.id}`} className="hover:text-gold">
            {moment.title}
          </Link>
        </h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-foreground/70">
          {moment.story}
        </p>

        <ul className="flex flex-wrap gap-2">
          {moment.opponent && (
            <li className="border border-gold px-2 py-1 text-[10px] font-bold text-gold">
              vs {moment.opponent}
            </li>
          )}
          {people.map((person) => (
            <li
              key={person}
              className={`px-2 py-1 text-[10px] font-bold ${
                PERSON_ROLE_STYLES[getPersonRole(person)]
              }`}
            >
              {person}
            </li>
          ))}
          {hiddenPeople > 0 && (
            <li className="px-2 py-1 text-[10px] text-foreground/50">
              +{hiddenPeople}
            </li>
          )}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <time dateTime={moment.date} className="text-xs text-foreground/50">
            {getDateDisplay(moment)}
          </time>
          <Link
            href={`/moments/${moment.id}`}
            className="text-xs font-bold text-gold hover:underline"
          >
            詳細へ &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
