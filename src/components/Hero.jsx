import { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { portfolioData } from '../data/portfolioData';
import { useCountUp } from '../hooks/useCountUp';
import HeroPortrait from './HeroPortrait';

// ── Stat counter card ──────────────────────────────────────────
function StatCard({ stat }) {
  const { value, triggerRef } = useCountUp(stat.value, {
    decimals: stat.decimals,
    duration: 1.6,
    delay: 0.2,
  });

  return (
    <div ref={triggerRef} className="flex flex-col gap-0.5">
      <span className="font-display italic text-2xl md:text-3xl font-light text-ink-900 dark:text-paper-100 tabular-nums">
        {value.toFixed(stat.decimals)}{stat.suffix}
      </span>
      <span className="label-mono">{stat.label}</span>
    </div>
  );
}

// ── Hero ───────────────────────────────────────────────────────
export default function Hero({ ready = true }) {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const giantRef = useRef(null);

  // Scroll: text block drifts, giant name slides slowly sideways
  useGSAP(() => {
    gsap.to(textRef.current, {
      yPercent: 14, opacity: 0.3, ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(giantRef.current, {
      xPercent: -6, ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
    });
  }, { scope: sectionRef });

  const goProjects = (e) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    if (!el) return;
    if (window.lenis) window.lenis.scrollTo(el, { offset: -40, duration: 1.2 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col pt-20 px-5 md:px-8 overflow-hidden bg-paper-100 dark:bg-ink-900"
    >
      {/* Blueprint field: fine grid that fades toward the edges */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(30,27,24,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,27,24,.07) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            WebkitMaskImage: 'radial-gradient(75% 70% at 55% 55%, #000 25%, transparent 85%)',
            maskImage: 'radial-gradient(75% 70% at 55% 55%, #000 25%, transparent 85%)',
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(250,249,246,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(250,249,246,.07) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            WebkitMaskImage: 'radial-gradient(75% 70% at 55% 55%, #000 25%, transparent 85%)',
            maskImage: 'radial-gradient(75% 70% at 55% 55%, #000 25%, transparent 85%)',
          }}
        />
      </div>

      {/* Top label strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between"
      >
        <span className="label-mono">Backend Developer · SIMATS '27</span>
        <span className="label-mono hidden sm:block">Chennai, India</span>
      </motion.div>

      {/* Stage */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex-1 flex flex-col lg:block lg:min-h-[470px]">

        {/* Art layer: giant name behind the bust, bust, callouts */}
        <div className="relative h-[min(58dvh,430px)] border-b border-ink-900/70 dark:border-paper-100/60 lg:border-b-0 lg:absolute lg:inset-0 lg:h-auto">
          <div ref={giantRef} className="absolute inset-x-0 top-[20%] lg:top-[9%] z-0 pointer-events-none select-none">
            <div className="overflow-hidden pb-[0.08em]">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: ready ? 0 : '110%' }}
                transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="font-display italic font-light leading-[0.86] tracking-tight text-center whitespace-nowrap text-ink-900 dark:text-paper-50 text-[clamp(72px,18vw,280px)]"
              >
                Yashwanth<span className="sr-only"> Varma Racharla</span>
              </motion.h1>
            </div>
          </div>
          <div className="absolute inset-0 z-10">
            <HeroPortrait ready={ready} sectionRef={sectionRef} />
          </div>
        </div>

        {/* Text block: below the stage on small screens, bottom-left on desktop */}
        <div ref={textRef} className="relative z-20 pt-8 pb-6 lg:pt-0 lg:pb-0 lg:absolute lg:left-0 lg:bottom-10 lg:w-[330px]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4"
          >
            <span className="label-mono border border-accent/30 bg-accent/5 px-3 py-1 rounded-sm">
              {portfolioData.role}
            </span>
          </motion.div>

          <div className="overflow-hidden mb-4 pb-1">
            <motion.p
              initial={{ y: '110%' }}
              animate={{ y: ready ? 0 : '110%' }}
              transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display italic font-light text-accent leading-[0.95] tracking-tight text-[clamp(2.4rem,4.6vw,4.2rem)]"
            >
              Varma<br />Racharla
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.7, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-base text-ink-500 dark:text-ink-400 mb-6 font-medium tracking-wide"
          >
            {portfolioData.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              onClick={goProjects}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink-900 dark:bg-paper-100 text-paper-100 dark:text-ink-900 font-mono text-xs uppercase tracking-widest hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-all duration-240 btn-press shadow-md"
            >
              View Projects
              <ArrowDown size={13} weight="bold" className="group-hover:translate-y-0.5 transition-transform duration-200" />
            </a>
            <a
              href={portfolioData.resumeUrl}
              download
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-paper-400 dark:border-ink-600 text-ink-700 dark:text-paper-300 font-mono text-xs uppercase tracking-widest hover:border-accent hover:text-accent dark:hover:border-accent dark:hover:text-accent transition-all duration-240 btn-press"
            >
              Resume
              <ArrowUpRight size={13} weight="bold" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Floor line + stats: the bust stands on this rule */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.7, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-6xl mx-auto w-full pb-10"
      >
        <div className="h-px bg-ink-900/70 dark:bg-paper-100/60 mb-6" />
        <div className="flex items-center gap-10 md:gap-16">
          {portfolioData.stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
          <div className="ml-auto hidden md:block">
            <p className="font-sans text-sm text-ink-400 dark:text-ink-500 max-w-xs leading-relaxed">
              {portfolioData.summary.split('.')[0]}.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
