import { useRef } from 'react';
import { motion } from 'motion/react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { portfolioData } from '../data/portfolioData';

const REVEAL = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Experience() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  // Timeline line draws on scroll (scaleY from 0)
  useGSAP(() => {
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 70%',
          scrub: 0.5,
        },
      }
    );
  }, { scope: sectionRef });

  const exp = portfolioData.experience[0];

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-24 px-5 md:px-8 bg-paper-100 dark:bg-ink-900 border-t border-paper-300 dark:border-ink-800"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section label */}
        <motion.div
          variants={REVEAL} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mb-14"
        >
          <span className="label-mono">02 / Industry</span>
          <h2 className="font-display italic text-display text-ink-900 dark:text-paper-50 mt-2 leading-tight">
            Work Experience
          </h2>
        </motion.div>

        {/* Timeline layout */}
        <div className="flex gap-8 md:gap-12">

          {/* Vertical line + dot */}
          <div className="flex flex-col items-center pt-2 flex-shrink-0">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-3 h-3 rounded-full bg-accent z-10"
            />
            <div
              ref={lineRef}
              className="w-px flex-1 bg-accent/30 mt-2"
              style={{ minHeight: '200px' }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <motion.div
              variants={REVEAL} custom={0.5} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="mb-5"
            >
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
                  {exp.company}
                </span>
                <span className="font-mono text-[10px] text-ink-400 border border-paper-300 dark:border-ink-700 px-2 py-0.5 rounded-sm">
                  {exp.type}
                </span>
              </div>
              <h3 className="font-display italic text-2xl md:text-3xl text-ink-900 dark:text-paper-100 font-light leading-tight">
                {exp.role}
              </h3>
              <p className="label-mono mt-1">{exp.period}</p>
            </motion.div>

            {/* Tools */}
            <motion.div
              variants={REVEAL} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="flex flex-wrap gap-1.5 mb-7"
            >
              {exp.tools.map((tool) => (
                <span
                  key={tool}
                  className="font-mono text-[11px] px-2.5 py-1 rounded-sm border border-paper-400 dark:border-ink-600 text-ink-600 dark:text-ink-300 bg-paper-50 dark:bg-ink-800 tracking-wide"
                >
                  {tool}
                </span>
              ))}
            </motion.div>

            {/* Bullets */}
            <ul className="space-y-4">
              {exp.bullets.map((bullet, i) => (
                <motion.li
                  key={i}
                  variants={REVEAL} custom={i * 0.5 + 1.5} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                  <p className="font-sans text-base text-ink-600 dark:text-ink-300 leading-relaxed">
                    {bullet}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
