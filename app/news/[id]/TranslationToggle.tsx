"use client";

import { useState } from "react";

export default function TranslationToggle({
  translation,
}: {
  translation: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-8 border-t-2 border-navy-light pt-6">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="bg-gold px-4 py-2 text-xs font-bold text-navy-dark transition-transform hover:-translate-y-0.5"
      >
        {expanded ? "全文和訳を閉じる" : "全文和訳を読む"}
      </button>

      {expanded && (
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/80">
          {translation}
        </p>
      )}
    </div>
  );
}
