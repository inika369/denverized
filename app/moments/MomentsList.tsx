"use client";

import { useMemo, useState } from "react";
import MomentCard from "../components/MomentCard";
import {
  CATEGORIES_BY_KIND,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  KIND_LABELS,
} from "./labels";
import { collectOpponents, sortMomentsByDateDesc } from "./lib";
import type { Moment, MomentCategory, MomentKind } from "./types";

const KIND_OPTIONS: { value: MomentKind | "all"; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "play", label: KIND_LABELS.play },
  { value: "offcourt", label: KIND_LABELS.offcourt },
];

const CHIP_ACTIVE = "bg-gold text-navy-dark";
const CHIP_IDLE =
  "border-2 border-navy-light text-foreground/60 hover:border-gold hover:text-gold";

export default function MomentsList({ moments }: { moments: Moment[] }) {
  const [kind, setKind] = useState<MomentKind | "all">("all");
  const [category, setCategory] = useState<MomentCategory | "all">("all");
  const [opponent, setOpponent] = useState("all");
  const [keyword, setKeyword] = useState("");

  const opponents = useMemo(() => collectOpponents(moments), [moments]);

  // Only offer the categories that make sense for the selected kind.
  const visibleCategories = useMemo(
    () =>
      kind === "all"
        ? CATEGORY_ORDER
        : CATEGORY_ORDER.filter((c) => CATEGORIES_BY_KIND[kind].includes(c)),
    [kind]
  );

  function selectKind(next: MomentKind | "all") {
    setKind(next);
    // Drop a category that the new kind doesn't offer, so the list can't end
    // up filtered by an option no longer visible.
    if (
      next !== "all" &&
      category !== "all" &&
      !CATEGORIES_BY_KIND[next].includes(category)
    ) {
      setCategory("all");
    }
  }

  const filtered = useMemo(() => {
    const lowerKeyword = keyword.trim().toLowerCase();

    const matched = moments.filter((moment) => {
      if (kind !== "all" && moment.kind !== kind) return false;
      if (category !== "all" && !moment.categories.includes(category)) {
        return false;
      }
      if (opponent !== "all" && moment.opponent !== opponent) return false;

      if (lowerKeyword) {
        const haystack = [
          moment.title,
          moment.story,
          moment.dateLabel ?? "",
          moment.opponent ?? "",
          ...moment.people,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(lowerKeyword)) return false;
      }

      return true;
    });

    return sortMomentsByDateDesc(matched);
  }, [moments, kind, category, opponent, keyword]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {KIND_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => selectKind(option.value)}
              className={`px-4 py-2 text-xs font-bold transition-colors ${
                kind === option.value ? CHIP_ACTIVE : CHIP_IDLE
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`px-3 py-1.5 text-[11px] font-bold transition-colors ${
              category === "all" ? CHIP_ACTIVE : CHIP_IDLE
            }`}
          >
            全カテゴリ
          </button>
          {visibleCategories.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCategory(option)}
              className={`px-3 py-1.5 text-[11px] font-bold transition-colors ${
                category === option ? CHIP_ACTIVE : CHIP_IDLE
              }`}
            >
              {CATEGORY_LABELS[option]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            className="border-2 border-navy-light bg-navy px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
          >
            <option value="all">すべての対戦相手</option>
            {opponents.map((tricode) => (
              <option key={tricode} value={tricode}>
                {tricode}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="選手名・キーワード検索"
            className="min-w-[200px] flex-1 border-2 border-navy-light bg-navy px-3 py-2 text-xs text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none"
          />
        </div>

        <p className="text-xs text-foreground/50">
          全 {filtered.length} モーメント
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((moment) => (
            <MomentCard key={moment.id} moment={moment} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-foreground/60">
          該当するモーメントはありません。
        </p>
      )}
    </div>
  );
}
