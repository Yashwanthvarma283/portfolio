import { useRef } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Code, Database, ShieldCheck, Cpu } from '@phosphor-icons/react';
import { portfolioData } from '../data/portfolioData';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: custom * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function About() {
  const sectionRef = useRef(null);
  const cgpaPercent = (parseFloat(portfolioData.education.cgpa) / 10) * 100;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="scroll-mt-16 py-24 px-5 md:px-8 bg-paper-200 dark:bg-ink-950 border-t border-paper-300 dark:border-ink-800 transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mb-14"
        >
          <span className="label-mono">01 / Profile</span>
          <h2 className="font-display italic text-display text-ink-900 dark:text-paper-50 mt-2 leading-tight">
            About &amp; Technical<br className="hidden sm:block" /> Foundation
          </h2>
        </motion.div>

        {/* 2-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* LEFT COLUMN: Narrative & Education (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Standout quote */}
            <motion.blockquote
              variants={FADE_UP}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="font-display italic text-2xl md:text-3xl text-ink-900 dark:text-paper-100 leading-snug font-light border-l-2 border-accent pl-6 py-1"
            >
              "Building scalable web applications, optimizing relational databases, and architecting secure RESTful services."
            </motion.blockquote>

            {/* Narrative text */}
            <motion.div
              variants={FADE_UP}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="space-y-4 font-sans text-base md:text-lg text-ink-600 dark:text-ink-300 leading-relaxed"
            >
              <p>
                {portfolioData.summary}
              </p>
              <p className="text-ink-500 dark:text-ink-400 text-sm md:text-base">
                Passionate about clean layered software architecture (Controller &rarr; Service &rarr; Repository), database normalization, query optimization, and token-based security workflows.
              </p>
            </motion.div>

            {/* Core Competencies highlights */}
            <motion.div
              variants={FADE_UP}
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
            >
              {[
                { icon: Code, title: 'Layered Architecture', desc: 'Clean separation of concerns' },
                { icon: Database, title: 'SQL & Data JPA', desc: 'Schema & query optimization' },
                { icon: ShieldCheck, title: 'Secure Auth', desc: 'JWT & role-based access' },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="p-3.5 rounded-lg border border-paper-400/80 dark:border-ink-700 bg-paper-50 dark:bg-ink-900/80 flex flex-col gap-1.5"
                >
                  <Icon size={18} weight="bold" className="text-accent" />
                  <p className="font-sans text-xs font-semibold text-ink-800 dark:text-paper-200">
                    {title}
                  </p>
                  <p className="font-mono text-[11px] text-ink-400 dark:text-ink-500 leading-tight">
                    {desc}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Education Card */}
            <motion.div
              variants={FADE_UP}
              custom={4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="p-6 rounded-xl border border-paper-400 dark:border-ink-700 bg-paper-50 dark:bg-ink-900 space-y-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                    <GraduationCap size={22} weight="bold" />
                  </div>
                  <div>
                    <span className="label-mono mb-1 block">Education</span>
                    <h3 className="font-display italic text-xl md:text-2xl text-ink-900 dark:text-paper-100 font-medium">
                      {portfolioData.education.degree}
                    </h3>
                    <p className="font-sans text-sm text-ink-500 dark:text-ink-400 mt-0.5">
                      {portfolioData.education.institution}, {portfolioData.education.location} · {portfolioData.education.period}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="font-mono text-sm font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                    CGPA {portfolioData.education.cgpa} / 10
                  </span>
                  <span className="font-mono text-[10px] text-ink-400 dark:text-ink-500 mt-1 uppercase tracking-wider">
                    Academic Excellence
                  </span>
                </div>
              </div>

              {/* CGPA Progress Visual */}
              <div className="pt-1">
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className="text-ink-500 dark:text-ink-400">Cumulative Grade Point Average</span>
                  <span className="font-semibold text-accent">{portfolioData.education.cgpa} / 10.0</span>
                </div>
                <div className="h-2 rounded-full bg-paper-300 dark:bg-ink-700 overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${cgpaPercent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-accent"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Skills & Technical Stack (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              variants={FADE_UP}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="flex items-center justify-between border-b border-paper-300 dark:border-ink-800 pb-3"
            >
              <span className="label-mono">Technical Arsenal</span>
              <span className="font-mono text-[11px] text-ink-400 dark:text-ink-500">Categorized Stack</span>
            </motion.div>

            {portfolioData.skills.map((group, gi) => (
              <motion.div
                key={group.category}
                variants={FADE_UP}
                custom={gi * 0.6 + 2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="p-5 rounded-xl border border-paper-300 dark:border-ink-700 bg-paper-50/80 dark:bg-ink-900/60 space-y-3 hover:border-accent/40 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <p className="font-sans text-xs font-bold text-ink-800 dark:text-paper-200 uppercase tracking-wider">
                    {group.category}
                  </p>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="font-mono text-xs px-3 py-1.5 rounded-md border border-paper-400 dark:border-ink-600 text-ink-700 dark:text-paper-200 bg-paper-100 dark:bg-ink-800 hover:border-accent hover:text-accent dark:hover:text-accent transition-colors duration-150 tracking-wide"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
