import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MomentCard from "../../components/MomentCard";
import { MOMENTS } from "../data";
import { CATEGORY_LABELS, KIND_LABELS } from "../labels";
import { getDateDisplay, getRelatedMoments } from "../lib";
import {
  PERSON_ROLE_ORDER,
  PERSON_ROLE_STYLES,
  getPersonRole,
  type PersonRole,
} from "../people";
import { getTeamName } from "../teams";
import type { Moment } from "../types";
import VideoEmbed from "../VideoEmbed";

type Props = {
  params: Promise<{ id: string }>;
};

const ROLE_GROUP_LABELS: Record<PersonRole, string> = {
  "nuggets-player": "Nuggets選手",
  "nuggets-staff": "Nuggetsスタッフ",
  opponent: "対戦相手",
  other: "その他",
};

export function generateStaticParams() {
  return MOMENTS.map((moment) => ({ id: moment.id }));
}

function findMoment(id: string): Moment | undefined {
  return MOMENTS.find((moment) => moment.id === id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const moment = findMoment(id);

  if (!moment) {
    return { title: "モーメント | DENVERIZED.JP" };
  }

  return {
    title: `${moment.title} | DENVERIZED.JP`,
    description: moment.story.slice(0, 120),
  };
}

export default async function MomentDetailPage({ params }: Props) {
  const { id } = await params;
  const moment = findMoment(id);

  if (!moment) {
    notFound();
  }

  const related = getRelatedMoments(moment, MOMENTS);

  // Group tagged people so Nuggets names read first, opponents after.
  const peopleByRole = PERSON_ROLE_ORDER.map((role) => ({
    role,
    names: moment.people.filter((name) => getPersonRole(name) === role),
  })).filter((group) => group.names.length > 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <Link
        href="/moments"
        className="mb-8 inline-block text-xs font-bold text-foreground/60 hover:text-gold"
      >
        &larr; モーメント一覧に戻る
      </Link>

      <article className="pixel-shadow border-2 border-gold bg-navy p-6 sm:p-10">
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

        <h1 className="mt-4 text-xl font-bold leading-snug text-foreground sm:text-2xl">
          {moment.title}
        </h1>

        <dl className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-foreground/60">
          <div className="flex items-center gap-2">
            <dt className="text-foreground/40">日付</dt>
            <dd>
              <time dateTime={moment.date}>{getDateDisplay(moment)}</time>
            </dd>
          </div>
          {moment.dateLabel && (
            <div className="flex items-center gap-2">
              <dt className="text-foreground/40">現地日付</dt>
              <dd>{moment.date}</dd>
            </div>
          )}
          {moment.opponent && (
            <div className="flex items-center gap-2">
              <dt className="text-foreground/40">対戦相手</dt>
              <dd className="font-bold text-gold">
                {getTeamName(moment.opponent)}
              </dd>
            </div>
          )}
          {moment.season && (
            <div className="flex items-center gap-2">
              <dt className="text-foreground/40">シーズン</dt>
              <dd>{moment.season}</dd>
            </div>
          )}
        </dl>

        {moment.videos.length > 0 && (
          <div className="mt-8 flex flex-col gap-6">
            {moment.videos.map((video) => (
              <div key={video.url}>
                {video.label && (
                  <p className="mb-2 text-xs font-bold text-gold">
                    {video.label}
                  </p>
                )}
                <VideoEmbed video={video} title={moment.title} />
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-foreground/50 hover:text-gold"
                >
                  元の動画を開く ↗
                </a>
              </div>
            ))}
          </div>
        )}

        <section className="mt-8">
          <h2 className="font-pixel mb-3 text-xs text-gold">STORY</h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            {moment.story}
          </p>
        </section>

        {peopleByRole.length > 0 && (
          <section className="mt-8 border-t-2 border-navy-light pt-6">
            <h2 className="font-pixel mb-4 text-xs text-gold">TAGS</h2>
            <div className="flex flex-col gap-3">
              {peopleByRole.map((group) => (
                <div key={group.role} className="flex flex-wrap items-center gap-2">
                  <span className="w-28 shrink-0 text-[10px] text-foreground/40">
                    {ROLE_GROUP_LABELS[group.role]}
                  </span>
                  {group.names.map((name) => (
                    <span
                      key={name}
                      className={`px-2 py-1 text-[11px] font-bold ${
                        PERSON_ROLE_STYLES[group.role]
                      }`}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-pixel mb-6 text-sm text-gold">関連モーメント</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <MomentCard key={item.id} moment={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
