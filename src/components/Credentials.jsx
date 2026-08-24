import { useRef } from 'react';
import { motion } from 'motion/react';
import { Trophy, Certificate, Cpu, Brain, ArrowUpRight, Sparkle } from '@phosphor-icons/react';
import FlowingMenu from './FlowingMenu';
import { portfolioData } from '../data/portfolioData';

const ICONS = {
  award: Trophy,
  cert: Certificate,
};

export default function Credentials() {
  const sectionRef = useRef(null);

  // Map credentials for FlowingMenu
  const flowingMenuItems = portfolioData.credentials.map((item) => ({
    link: item.link || portfolioData.linkedin,
    text: item.shortTitle || item.title,
    image: item.image,
  }));

  return (
    <section
      id="credentials"
      ref={sectionRef}
      className="scroll-mt-16 py-24 px-5 md:px-8 bg-paper-100 dark:bg-ink-900 border-t border-paper-300 dark:border-ink-800 transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="label-mono">04 / Accreditations</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </div>
            <h2 className="font-display italic text-display text-ink-900 dark:text-paper-50 leading-tight">
              Awards &amp; Certifications
            </h2>
            <p className="font-sans text-sm md:text-base text-ink-500 dark:text-ink-400 mt-2 max-w-lg">
              Recognized competencies in Java backend engineering, relational database querying, full-stack systems, and AI.
            </p>
          </motion.div>

          {/* Interactive Hint Pill */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 self-start md:self-end px-3.5 py-1.5 rounded-full border border-paper-300 dark:border-ink-700 bg-paper-50 dark:bg-ink-800 text-ink-500 dark:text-ink-400 font-mono text-xs"
          >
            <Sparkle size={13} className="text-accent shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Hover to explore kinetic stream</span>
          </motion.div>
        </div>

        {/* ── FlowingMenu Container ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[520px] md:h-[580px] rounded-2xl overflow-hidden border border-paper-300 dark:border-ink-800 bg-paper-200/60 dark:bg-ink-950/80 shadow-sm mb-12"
        >
          <FlowingMenu
            items={flowingMenuItems}
            speed={14}
            textColor="currentColor"
            bgColor="transparent"
            marqueeBgColor="#C2622D"
            marqueeTextColor="#FEFDFB"
            borderColor="rgba(140, 135, 125, 0.22)"
          />
        </motion.div>

        {/* ── Detailed Credential List & Verification Links ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {portfolioData.credentials.map((item, i) => {
            const Icon = item.type === 'award' ? Trophy : Certificate;
            return (
              <motion.a
                key={item.id}
                href={item.link || portfolioData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group relative p-5 rounded-xl border border-paper-300 dark:border-ink-800 bg-paper-50/70 dark:bg-ink-950/50 hover:border-accent/60 dark:hover:border-accent/60 hover:bg-paper-100 dark:hover:bg-ink-900 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="label-mono px-2 py-0.5 rounded-sm border border-paper-300 dark:border-ink-700 bg-paper-100 dark:bg-ink-900">
                      {item.type === 'award' ? 'Award' : 'Certificate'}
                    </span>
                    <span className="font-mono text-xs font-semibold text-accent">
                      {item.year}
                    </span>
                  </div>

                  <h3 className="font-sans text-base font-semibold text-ink-900 dark:text-paper-100 group-hover:text-accent dark:group-hover:text-accent transition-colors duration-200 leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-ink-400 dark:text-ink-500 mt-1.5">
                    {item.issuer}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-paper-200 dark:border-ink-800/80 text-xs font-mono text-ink-400 dark:text-ink-500 group-hover:text-accent dark:group-hover:text-accent transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Icon size={14} className="text-accent" />
                    <span>Verified Credential</span>
                  </span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
