import type { Metadata } from "next";
import SalaryCapStacker from "./SalaryCapStacker";

export const metadata: Metadata = {
  title: "ゲーム | DENVERIZED.JP",
};

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-pixel mb-4 text-lg text-gold sm:text-xl">
        わくわくサラリーマネジメント
      </h1>
      <p className="mb-8 text-sm text-foreground/60">
        サラリーに気を付けて強いロスターを作ろう！
      </p>
      <SalaryCapStacker />
    </div>
  );
}
