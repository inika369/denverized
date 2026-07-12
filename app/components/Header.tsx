import Link from "next/link";

const NAV_ITEMS = [
  { href: "/news", label: "ニュース" },
  { href: "/features", label: "特集" },
  { href: "/schedule", label: "スケジュール" },
  { href: "/players", label: "選手紹介" },
  { href: "/games", label: "ゲーム" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-gold bg-navy-dark">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:justify-between sm:gap-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <span className="font-pixel text-[10px] leading-relaxed text-gold sm:text-sm">
            DENVERIZED
          </span>
        </Link>
        <nav>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs font-bold tracking-wide text-foreground/90 transition-colors hover:text-gold sm:text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
