export default function Footer() {
  return (
    <footer className="border-t-4 border-gold bg-navy-dark">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center sm:px-6">
        <p className="text-[10px] leading-relaxed text-foreground/60">
          &copy; {new Date().getFullYear()} DENVERIZED.JP
        </p>
      </div>
    </footer>
  );
}
