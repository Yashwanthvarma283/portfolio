import { portfolioData } from '../data/portfolioData';

export default function Footer({ onReplayLoader }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t-2 border-accent bg-paper-100 dark:bg-ink-900">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        <p className="font-mono text-xs text-ink-400 dark:text-ink-600 uppercase tracking-widest">
          {portfolioData.firstName} · {year}
        </p>
        <div className="flex items-center gap-6">
          {onReplayLoader && (
            <button
              onClick={onReplayLoader}
              className="font-mono text-xs text-ink-400 dark:text-ink-600 hover:text-accent dark:hover:text-accent transition-colors uppercase tracking-widest flex items-center gap-1.5"
              title="Replay cursive intro animation"
            >
              <span>⚡</span> Replay Intro
            </button>
          )}
          <p className="font-mono text-xs text-ink-400 dark:text-ink-600 uppercase tracking-widest hidden sm:block">
            React · GSAP · Lenis
          </p>
        </div>
      </div>
    </footer>
  );
}
