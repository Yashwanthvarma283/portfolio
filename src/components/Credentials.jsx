import { useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkle } from '@phosphor-icons/react';
import FlowingMenu from './FlowingMenu';
import { portfolioData } from '../data/portfolioData';

export default function Credentials() {
  const sectionRef = useRef(null);

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
              <span className="label-mono">Accreditations</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </div>
            <h2 className="font-display italic text-display text-ink-900 dark:text-paper-50 leading-tight">
              Awards &amp; Certifications
            </h2>
            <p className="font-sans text-sm md:text-base text-ink-500 dark:text-ink-400 mt-2 max-w-lg leading-relaxed">
              Recognized competencies in Java backend engineering, relational database querying, full-stack systems, and AI.
            </p>
          </motion.div>

          {/* Interactive Hint Pill */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 self-start md:self-end px-3.5 py-1.5 rounded-full border border-paper-300 dark:border-ink-700 bg-paper-50 dark:bg-ink-800 text-ink-500 dark:text-ink-400 font-mono text-xs shadow-sm"
          >
            <Sparkle size={13} className="text-accent shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Hover to explore kinetic stream</span>
          </motion.div>
        </div>

        {/* ── FlowingMenu Container (Kinetic Stream Centerpiece) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[520px] md:h-[580px] rounded-2xl overflow-hidden border border-paper-300 dark:border-ink-800 bg-paper-200/60 dark:bg-ink-950/80 shadow-md"
        >
          <FlowingMenu
            items={portfolioData.credentials}
            speed={20}
            textColor="currentColor"
            bgColor="transparent"
            marqueeBgColor="#C2622D"
            marqueeTextColor="#FEFDFB"
            borderColor="rgba(140, 135, 125, 0.22)"
          />
        </motion.div>
      </div>
    </section>
  );
}

