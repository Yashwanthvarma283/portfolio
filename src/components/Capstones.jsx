import { motion } from 'motion/react';
import { GithubLogo, ArrowUpRight } from '@phosphor-icons/react';
import { portfolioData } from '../data/portfolioData';

export default function Capstones() {
  const items = portfolioData.capstones || [];
  if (!items.length) return null;
  return (
    <section
      id="capstones"
      className="scroll-mt-16 py-20 px-5 md:px-8 bg-paper-100 dark:bg-ink-900 border-t border-paper-300 dark:border-ink-800 transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span className="label-mono">Academic</span>
          <h2 className="font-display italic text-display text-ink-900 dark:text-paper-50 mt-1.5">Capstones</h2>
        </motion.div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((c) => (
            <li key={c.id}>
              <a
                href={c.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-paper-300 dark:border-ink-700 bg-paper-50 dark:bg-ink-800 p-6 hover:border-accent transition-colors duration-200 btn-press"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl text-ink-900 dark:text-paper-100">{c.name}</h3>
                  <ArrowUpRight size={18} weight="bold" className="text-ink-400 group-hover:text-accent shrink-0 mt-1" />
                </div>
                <p className="font-sans text-sm text-ink-500 dark:text-ink-400 mt-2 leading-relaxed">{c.pitch}</p>
                <span className="inline-flex items-center gap-1.5 mt-4 font-mono text-[11px] uppercase tracking-widest text-ink-500 dark:text-ink-400 group-hover:text-accent">
                  <GithubLogo size={14} weight="bold" /> Repository
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
