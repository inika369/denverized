import { parseSummarySections } from "../lib/format";

export default function SummarySections({
  summaryJa,
}: {
  summaryJa: string | null;
}) {
  const sections = parseSummarySections(summaryJa);

  if (sections.length === 0) {
    return <p className="text-sm italic text-foreground/40">要約準備中</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <div key={section.heading}>
          <p className="font-bold text-gold">【{section.heading}】</p>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground/80">
            {section.body}
          </p>
        </div>
      ))}
    </div>
  );
}
