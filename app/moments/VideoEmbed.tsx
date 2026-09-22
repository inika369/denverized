"use client";

import Image from "next/image";
import { useState } from "react";
import { getEmbedUrl, getVideoThumbnail } from "./lib";
import type { MomentVideo } from "./types";

/**
 * Click-to-load player. The thumbnail stands in for the iframe until the
 * viewer actually presses play, so a page full of moments doesn't pull in a
 * YouTube player for each one.
 *
 * A clip whose `embeddable` flag is false (or that isn't YouTube) renders as a
 * link out to its own site instead.
 */
export default function VideoEmbed({
  video,
  title,
}: {
  video: MomentVideo;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  const embedUrl = getEmbedUrl(video);
  const thumbnail = getVideoThumbnail(video);

  if (!embedUrl) {
    return (
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex aspect-video w-full items-center justify-center overflow-hidden border-2 border-navy-light bg-navy transition-colors hover:border-gold"
      >
        {thumbnail && (
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover opacity-40 transition-opacity group-hover:opacity-60"
          />
        )}
        <span className="relative z-10 border-2 border-gold bg-navy-dark/90 px-4 py-2 text-xs font-bold text-gold">
          外部サイトで見る ↗
        </span>
      </a>
    );
  }

  if (playing) {
    return (
      <div className="aspect-video w-full border-2 border-gold bg-navy-dark">
        <iframe
          src={`${embedUrl}&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`${title} を再生`}
      className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden border-2 border-navy-light bg-navy transition-colors hover:border-gold"
    >
      {thumbnail && (
        <Image
          src={thumbnail}
          alt=""
          fill
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}
      <span className="pixel-shadow-sm relative z-10 flex h-14 w-14 items-center justify-center border-2 border-gold bg-navy-dark/90 text-gold">
        <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  );
}
