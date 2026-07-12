import type { Metadata } from "next";
import SalaryCapStacker from "./SalaryCapStacker";

export const metadata: Metadata = {
  title: "ゲーム | DENVERIZED.JP",
};

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-pixel mb-4 text-lg text-gold sm:text-xl">
        サラリーキャップ・スタッカー
      </h1>
      <p className="mb-8 text-sm text-foreground/60">
        同じ選手の玉を落として合体させ、より年俸の高い選手に育てよう。目指すはヨキッチ！
      </p>
      <SalaryCapStacker />
    </div>
  );
}
