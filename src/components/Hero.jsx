import { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { portfolioData } from '../data/portfolioData';
import { useCountUp } from '../hooks/useCountUp';

// ── Abstract geometric SVG (backend/API motif) ─────────────────
function BackendMotif() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-full flex items-center justify-center"
    >
      <motion.svg
        viewBox="0 0 340 340"
        className="w-[280px] h-[280px] md:w-[340px] md:h-[340px] opacity-70 dark:opacity-50"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, ease: 'linear', repeat: Infinity }}
      >
        {/* Concentric rings */}
        {[120, 90, 60, 30].map((r, i) => (
          <circle
            key={r}
            cx="170" cy="170" r={r}
            fill="none"
            stroke="#C2622D"
            strokeWidth={i === 0 ? 1.5 : 1}
            strokeOpacity={0.15 + i * 0.1}
            strokeDasharray={i % 2 === 0 ? '6 4' : 'none'}
          />
        ))}
        {/* Node grid */}
        {[0, 1, 2, 3, 4].map((col) =>
          [0, 1, 2, 3, 4].map((row) => {
            const x = 85 + col * 42.5;
            const y = 85 + row * 42.5;
            const dist = Math.sqrt(Math.pow(x - 170, 2) + Math.pow(y - 170, 2));
            if (dist > 115) return null;
            return (
              <circle
                key={`${col}-${row}`}
                cx={x} cy={y} r={dist < 40 ? 4 : 2.5}
                fill="#C2622D"
                fillOpacity={dist < 40 ? 0.8 : 0.3}
              />
            );
          })
        )}
        {/* Connecting lines */}
        <line x1="170" y1="55"  x2="170" y2="285" stroke="#C2622D" strokeWidth="0.8" strokeOpacity="0.12" />
        <line x1="55"  y1="170" x2="285" y2="170" stroke="#C2622D" strokeWidth="0.8" strokeOpacity="0.12" />
        <line x1="88"  y1="88"  x2="252" y2="252" stroke="#C2622D" strokeWidth="0.8" strokeOpacity="0.08" />
        <line x1="252" y1="88"  x2="88"  y2="252" stroke="#C2622D" strokeWidth="0.8" strokeOpacity="0.08" />
      </motion.svg>

      {/* Center pulse */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-accent"
        animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0.2, 0.8] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

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
export default function Hero() {
  const sectionRef = useRef(null);
  const nameRef = useRef(null);

  // Scroll-parallax on hero content without broken pinSpacing
  useGSAP(() => {
    gsap.to(nameRef.current, {
      yPercent: 18,
      opacity: 0.35,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col justify-between pt-20 pb-10 px-5 md:px-8 overflow-hidden bg-paper-100 dark:bg-ink-900"
    >
      {/* Top label strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto w-full flex items-center justify-between"
      >
        <span className="label-mono">Backend Developer · SIMATS '27</span>
        <span className="label-mono hidden sm:block">Chennai, India</span>
      </motion.div>

      {/* Main content — asymmetric 2-col */}
      <div ref={nameRef} className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-0 my-auto py-10">

        {/* LEFT: Text */}
        <div className="flex-1 lg:pr-12">
          {/* Identity badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5"
          >
            <span className="label-mono border border-accent/30 bg-accent/5 px-3 py-1 rounded-sm">
              {portfolioData.role}
            </span>
          </motion.div>

          {/* Name — clip-path line reveal */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="font-display italic font-light text-hero text-ink-900 dark:text-paper-50 leading-[0.9] tracking-tight"
            >
              Yashwanth
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-display italic font-light text-hero text-accent leading-[0.9] tracking-tight"
            >
              Varma Racharla
            </motion.h1>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-base md:text-lg text-ink-500 dark:text-ink-400 mb-8 font-medium tracking-wide"
          >
            {portfolioData.tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('projects');
                if (el) {
                  if (window.lenis) {
                    window.lenis.scrollTo(el, { offset: -40, duration: 1.2 });
                  } else {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
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
              Download Resume
              <ArrowUpRight size={13} weight="bold" />
            </a>
          </motion.div>
        </div>

        {/* RIGHT: geometric motif */}
        <div className="w-[260px] h-[260px] md:w-[340px] md:h-[340px] flex-shrink-0">
          <BackendMotif />
        </div>
      </div>

      {/* Bottom stat strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto w-full"
      >
        <div className="h-px bg-paper-300 dark:bg-ink-700 mb-6" />
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
