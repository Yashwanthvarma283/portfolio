import { portfolioData } from '../data/portfolioData';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t-2 border-accent bg-paper-100 dark:bg-ink-900">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        <p className="font-mono text-xs text-ink-400 dark:text-ink-600 uppercase tracking-widest">
          {portfolioData.firstName} · {year}
        </p>
        <p className="font-mono text-xs text-ink-400 dark:text-ink-600 uppercase tracking-widest">
          React · GSAP · Lenis
        </p>
      </div>
    </footer>
  );
}
