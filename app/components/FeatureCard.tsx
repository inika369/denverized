export type FeatureItem = {
  id: string;
  week: string;
  title: string;
  summary: string;
  tags: string[];
};

export default function FeatureCard({ item }: { item: FeatureItem }) {
  return (
    <article className="pixel-shadow border-2 border-gold bg-navy p-6 sm:p-8">
      <p className="font-pixel text-[10px] text-gold">{item.week}</p>
      <h3 className="mt-4 text-lg font-bold leading-snug text-foreground sm:text-xl">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
        {item.summary}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <li
            key={tag}
            className="border border-navy-light px-2 py-1 text-[10px] text-foreground/60"
          >
            #{tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
