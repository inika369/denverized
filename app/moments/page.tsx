import type { Metadata } from "next";
import { MOMENTS } from "./data";
import MomentsList from "./MomentsList";

export const metadata: Metadata = {
  title: "モーメント | DENVERIZED.JP",
  description:
    "Nuggetsの名場面・記録・オフコートの一場面を、動画と背景ストーリー付きで記録するアーカイブ。",
};

export default function MomentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-pixel mb-4 text-lg text-gold sm:text-xl">
        モーメント
      </h1>
      <p className="mb-10 max-w-3xl text-sm leading-relaxed text-foreground/70">
        Nuggetsの名場面から記録達成、コート外の一場面まで。動画と一緒に、誰が関わり
        何が起きたのかを記録しています。選手名・対戦相手・カテゴリから探せます。
      </p>

      <MomentsList moments={MOMENTS} />
    </div>
  );
}
