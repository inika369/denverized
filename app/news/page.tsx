import type { Metadata } from "next";
import { getArticles, getSources } from "../lib/api";
import NewsList from "./NewsList";

export const metadata: Metadata = {
  title: "ニュース | DENVERIZED.JP",
};

export default async function NewsPage() {
  const [articles, sources] = await Promise.all([
    getArticles(),
    getSources(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-pixel mb-10 text-lg text-gold sm:text-xl">
        ニュース
      </h1>
      <NewsList articles={articles} sources={sources} />
    </div>
  );
}
