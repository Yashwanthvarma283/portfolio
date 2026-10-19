import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  LOADER_PATH_SINGLE,
  LOADER_VIEWBOX_SINGLE
} from '../data/loaderSvgPaths';
import {
  PORTRAIT_VIEWBOX,
  PORTRAIT_W,
  PORTRAIT_H,
  PORTRAIT_OUTLINES
} from '../data/portraitTrace';

export default function Preloader({ onComplete, onFlightStart, isDark, target = 'tile' }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  // Phase 1: Name loading references
  const nameSectionRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const counterRef = useRef(null);
  const progressBarRef = useRef(null);
  const hintRef = useRef(null);
  const accentMaskRectRef = useRef(null);
  const mainMaskRectRef = useRef(null);
  const penNibRef = useRef(null);

  // Phase 2: Dynamic Angled Scratch Reveal references (Centered & Borderless)
  const imageSectionRef = useRef(null);
  const portraitFlightRef = useRef(null);
  const mask1Ref = useRef(null);
  const mask2Ref = useRef(null);
  const mask3Ref = useRef(null);
  const sweep1Ref = useRef(null);
  const sweep2Ref = useRef(null);
  const sweep3Ref = useRef(null);
  const captionRef = useRef(null);
  const portraitSvgRef = useRef(null);
  const scanRectRef = useRef(null);
  const scanLineRef = useRef(null);
  const baseRef = useRef(null);
  const plateR = useRef(null);
  const plateG = useRef(null);
  const plateB = useRef(null);
  const marksRef = useRef(null);
  const silRef = useRef(null);
  const flightStartedRef = useRef(false);
  // Keep the latest callbacks in refs so parent re-renders never restart the timeline.
  const onCompleteRef = useRef(onComplete);
  const onFlightStartRef = useRef(onFlightStart);
  const targetRef = useRef(target);
  onCompleteRef.current = onComplete;
  onFlightStartRef.current = onFlightStart;
  targetRef.current = target;

  const mainTimelineRef = useRef(null);
  const isFinishedRef = useRef(false);

  // Theme colors matching the portfolio theme
  const themeBg = isDark ? '#141210' : '#FAF9F6';
  const themeText = isDark ? '#FAF9F6' : '#1E1B18';
  const accentColor = '#C2622D'; // Burnt terracotta / Spylt caramel
  const trackBg = isDark ? 'rgba(250, 249, 246, 0.12)' : 'rgba(30, 27, 24, 0.1)';

  useEffect(() => {
    // Lock scroll during preloader
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Preload transparent cutout image so it renders with 0ms latency
    const imgPreload = new Image();
    imgPreload.src = '/yashwanth-bust.png';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nameDuration = prefersReducedMotion ? 0.6 : 2.5;
    const progressObj = { value: 0 };
    const totalSvgWidth = 1100;
    const brushLeadWidth = 65;

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline({
        onComplete: () => {
          finishSequence();
        }
      });

      mainTimelineRef.current = masterTl;

      // ── PHASE 1: Cursive Name Dual-Tone Stroke Drawing & Counter (0s -> 2.5s) ──
      masterTl.to(progressObj, {
        value: 100,
        duration: nameDuration,
        ease: 'power2.inOut',
        onUpdate: () => {
          const currentVal = Math.round(progressObj.value);
          setProgress(currentVal);

          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${progressObj.value}%`;
          }

          const progressRatio = progressObj.value / 100;
          const accentWidth = progressRatio * totalSvgWidth;
          const mainWidth = progressRatio >= 0.97
            ? totalSvgWidth
            : Math.max(0, accentWidth - brushLeadWidth);

          if (accentMaskRectRef.current) {
            accentMaskRectRef.current.setAttribute('width', `${accentWidth}`);
          }
          if (mainMaskRectRef.current) {
            mainMaskRectRef.current.setAttribute('width', `${mainWidth}`);
          }

          if (penNibRef.current) {
            if (accentWidth > 20 && accentWidth < totalSvgWidth - 25) {
              penNibRef.current.setAttribute('cx', `${accentWidth - 12}`);
              const undulation = Math.sin(accentWidth * 0.035) * 6;
              penNibRef.current.setAttribute('cy', `${86 + undulation}`);
              penNibRef.current.setAttribute('opacity', '0.95');
            } else {
              penNibRef.current.setAttribute('opacity', '0.0');
            }
          }
        }
      }, 0);

      masterTl.to(logoWrapperRef.current, {
        scale: 1.018,
        duration: nameDuration * 0.35,
        ease: 'sine.out'
      }, nameDuration * 0.65);

      // Brief hold at 100% so the completed signature settles
      const nameHold = prefersReducedMotion ? 0.05 : 0.22;
      const phase2Start = nameDuration + nameHold;

      // ── TRANSITION: Fade out Name Section & Emergence of Centered Full Image ──
      masterTl.to(logoWrapperRef.current, {
        opacity: 0,
        scale: 1.04,
        duration: 0.35,
        ease: 'power2.inOut'
      }, phase2Start);

      masterTl.to([counterRef.current, progressBarRef.current?.parentElement, hintRef.current], {
        opacity: 0,
        y: 16,
        duration: 0.3,
        ease: 'power2.inOut'
      }, phase2Start);

      // ── PHASE 2: pen traces the bust, then three colour plates print into register ──
      const outlines = portraitSvgRef.current
        ? portraitSvgRef.current.querySelectorAll('.trace-outline')
        : [];
      const SHIFT = 46;
      gsap.set(outlines, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 1 });
      gsap.set(scanRectRef.current, { attr: { height: 0 } });
      gsap.set(scanLineRef.current, { y: 0, opacity: 0 });
      gsap.set(silRef.current, { opacity: 0 });
      gsap.set(marksRef.current, { opacity: 0, scale: 1.14, transformOrigin: '50% 50%' });
      gsap.set(plateR.current, { x: -SHIFT });
      gsap.set(plateB.current, { x: SHIFT });
      gsap.set(plateG.current, { y: -SHIFT * 0.4 });

      masterTl.to(imageSectionRef.current, { opacity: 1, duration: 0.25, ease: 'power2.out' }, phase2Start + 0.1);
      masterTl.fromTo(portraitFlightRef.current, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }, phase2Start + 0.1);

      const traceDur = prefersReducedMotion ? 0.3 : 1.0;
      const scanDur = prefersReducedMotion ? 0.3 : 0.9;
      const registerDur = prefersReducedMotion ? 0.2 : 0.8;
      const traceStart = phase2Start + 0.2;

      masterTl.to(outlines, { strokeDashoffset: 0, duration: traceDur, ease: 'power2.inOut' }, traceStart);
      masterTl.to(marksRef.current, { opacity: 1, scale: 1, duration: traceDur * 0.7, ease: 'power3.out' }, traceStart + 0.1);
      masterTl.to(silRef.current, { opacity: 1, duration: traceDur * 0.6, ease: 'power1.in' }, traceStart + traceDur * 0.5);

      const scanStart = traceStart + traceDur + 0.05;
      masterTl.to(scanLineRef.current, { opacity: 1, duration: 0.12 }, scanStart);
      masterTl.to(scanRectRef.current, { attr: { height: PORTRAIT_H + 20 }, duration: scanDur, ease: 'power2.inOut' }, scanStart);
      masterTl.to(scanLineRef.current, { y: PORTRAIT_H, duration: scanDur, ease: 'power2.inOut' }, scanStart);
      masterTl.to(scanLineRef.current, { opacity: 0, duration: 0.2 }, scanStart + scanDur - 0.05);

      // plates slide into register
      const regStart = scanStart + scanDur - 0.15;
      masterTl.to(plateR.current, { x: 0, duration: registerDur, ease: 'power4.out' }, regStart);
      masterTl.to(plateB.current, { x: 0, duration: registerDur, ease: 'power4.out' }, regStart);
      masterTl.to(plateG.current, { y: 0, duration: registerDur, ease: 'power4.out' }, regStart);
      masterTl.to(outlines, { opacity: 0, duration: 0.5, ease: 'power1.out' }, regStart + 0.1);
      masterTl.to(silRef.current, { opacity: 0, duration: 0.3 }, regStart + 0.1);
      masterTl.to(marksRef.current, { opacity: 0, duration: 0.5, ease: 'power1.in' }, regStart + registerDur - 0.1);
      masterTl.fromTo(captionRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, regStart + registerDur * 0.5);

      // ── PHASE 3: Hold, then land on the profile picker (or fade into the hero) ──
      const holdDuration = prefersReducedMotion ? 0.05 : 0.45;
      const flightStartTime = regStart + registerDur + holdDuration;
      const flightDuration = prefersReducedMotion ? 0.4 : 1.0;

      masterTl.call(() => {
        if (!flightStartedRef.current) {
          flightStartedRef.current = true;
          if (onFlightStartRef.current) onFlightStartRef.current();
        }
      }, null, flightStartTime);

      masterTl.to([headerRef.current, captionRef.current], {
        opacity: 0, y: -12, duration: 0.35, ease: 'power2.inOut'
      }, flightStartTime - 0.05);

      if (targetRef.current === 'tile') {
        // The bust shrinks into the owner tile as its avatar (square crop of the centre).
        const measure = () => {
          const tile = document.getElementById('owner-avatar');
          const src = portraitSvgRef.current;
          if (!tile || !src) return null;
          const t = tile.getBoundingClientRect();
          const r = src.getBoundingClientRect();
          return { t, r, s: t.width / r.height };
        };
        const sideCrop = ((1 - PORTRAIT_H / PORTRAIT_W) / 2) * 100;
        masterTl.fromTo(portraitFlightRef.current, {
          clipPath: 'inset(0% 0% 0% 0% round 0px)'
        }, {
          x: () => { const m = measure(); return m ? (m.t.left + m.t.width / 2) - (m.r.left + m.r.width / 2) : 0; },
          y: () => { const m = measure(); return m ? (m.t.top + m.t.height / 2) - (m.r.top + m.r.height / 2) : 0; },
          scale: () => { const m = measure(); return m ? m.s : 0.3; },
          clipPath: () => {
            const m = measure();
            return `inset(0% ${sideCrop}% 0% ${sideCrop}% round ${m ? 12 / m.s : 40}px)`;
          },
          duration: flightDuration,
          ease: 'expo.inOut'
        }, flightStartTime);
      } else {
        masterTl.to(portraitFlightRef.current, {
          scale: 1.05, opacity: 0, duration: flightDuration * 0.7, ease: 'power2.in'
        }, flightStartTime);
      }

      masterTl.to(containerRef.current, {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        duration: flightDuration * 0.75,
        ease: 'power2.inOut'
      }, flightStartTime + flightDuration * 0.2);

    }, containerRef);

    const finishSequence = () => {
      if (isFinishedRef.current) return;
      isFinishedRef.current = true;
      document.body.style.overflow = prevOverflow;
      if (onCompleteRef.current) onCompleteRef.current();
    };

    // Keyboard skip listener
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Escape' || e.key === 'Enter') {
        fastForward();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      ctx.revert();
    };
  }, []);

  // Fast-forward / Skip handler
  const fastForward = () => {
    if (mainTimelineRef.current) {
      mainTimelineRef.current.progress(1);
    }
  };

  return (
    <div
      ref={containerRef}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Loading Yashwanth Varma Racharla portfolio"
      style={{ backgroundColor: themeBg }}
      className="fixed inset-0 z-[99990] flex flex-col justify-between items-center select-none cursor-default transition-colors duration-300 overflow-hidden"
      onClick={fastForward}
    >
      {/* ── Top Minimal Header ── */}
      <div
        ref={headerRef}
        className="w-full flex justify-between items-center px-6 sm:px-12 pt-7 sm:pt-9 z-20 pointer-events-auto"
      >
        <div className="flex items-center gap-2.5 opacity-60">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-ink-500 dark:text-ink-400">
            Portfolio
          </span>
        </div>

        {/* Minimal Skip Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            fastForward();
          }}
          className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-ink-500 hover:text-accent dark:text-ink-400 dark:hover:text-accent transition-colors py-1 px-3 rounded-sm border border-ink-300/30 dark:border-ink-800/80 bg-paper-50/40 dark:bg-ink-950/40 backdrop-blur-sm"
        >
          Skip ↵
        </button>
      </div>

      {/* ── Center Area: Container for Name (Phase 1) ── */}
      <div className="relative w-full flex-1 flex items-center justify-center px-4 sm:px-8 z-10 overflow-hidden">
        {/* ── PHASE 1: Cursive Calligraphy Name Mark ── */}
        <div
          ref={nameSectionRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        >
          <div
            ref={logoWrapperRef}
            className="w-full max-w-[1200px] px-6 sm:px-10 md:px-14 flex flex-col items-center justify-center scale-100 sm:scale-105 md:scale-110 lg:scale-115 transition-transform"
          >
            <svg
              viewBox={LOADER_VIEWBOX_SINGLE}
              className="w-full h-auto max-h-[42vh] drop-shadow-md overflow-visible"
              style={{ willChange: 'transform, opacity' }}
            >
              <defs>
                {/* Accent Mask: Leads the stroke with slanted pen angle */}
                <mask id="mask-accent-reveal" maskUnits="userSpaceOnUse" x="-80" y="-40" width="1240" height="220">
                  <g transform="skewX(-14)">
                    <rect
                      ref={accentMaskRectRef}
                      x="-60"
                      y="-30"
                      width="0"
                      height="200"
                      fill="white"
                    />
                  </g>
                </mask>

                {/* Main Theme Ink Mask: Follows right behind the accent tip */}
                <mask id="mask-main-reveal" maskUnits="userSpaceOnUse" x="-80" y="-40" width="1240" height="220">
                  <g transform="skewX(-14)">
                    <rect
                      ref={mainMaskRectRef}
                      x="-60"
                      y="-30"
                      width="0"
                      height="200"
                      fill="white"
                    />
                  </g>
                </mask>

                {/* Ambient luminous glow filter for the active pen nib */}
                <filter id="pen-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* LAYER 1: Leading Terracotta Accent Brush Tip (#C2622D) */}
              <g>
                <path
                  d={LOADER_PATH_SINGLE}
                  mask="url(#mask-accent-reveal)"
                  fill={accentColor}
                  stroke={accentColor}
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>

              {/* LAYER 2: Solid Primary Theme Ink Trailing Behind */}
              <g>
                <path
                  d={LOADER_PATH_SINGLE}
                  mask="url(#mask-main-reveal)"
                  fill={themeText}
                  stroke={themeText}
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>

              {/* LAYER 3: Luminous Fluid Pen Nib Particle */}
              <g filter="url(#pen-glow)" className="pointer-events-none">
                <circle
                  ref={penNibRef}
                  cx="0"
                  cy="86"
                  r="6"
                  fill={accentColor}
                  opacity="0"
                  style={{ willChange: 'cx, cy, opacity', transition: 'opacity 0.15s ease' }}
                />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Percentage Counter & Minimalist Progress Line ── */}
      <div className="w-full flex flex-col items-center justify-center pb-12 sm:pb-16 px-6 z-20 pointer-events-none">
        {/* Percentage Counter in Bold Condensed Monospace with exact space before % */}
        <div
          ref={counterRef}
          style={{ color: themeText }}
          className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest tabular-nums select-none"
        >
          {progress} %
        </div>

        {/* Minimalist Horizontal Progress Line */}
        <div
          style={{ backgroundColor: trackBg }}
          className="w-64 sm:w-80 md:w-96 h-[2.5px] rounded-full mt-4 sm:mt-5 overflow-hidden relative"
        >
          <div
            ref={progressBarRef}
            style={{ backgroundColor: themeText, width: '0%' }}
            className="absolute top-0 left-0 h-full rounded-full will-change-transform"
          />
        </div>

        {/* Subtle skip cue */}
        <p
          ref={hintRef}
          className="font-mono text-[10px] sm:text-[11px] text-ink-400 dark:text-ink-600 mt-4 tracking-widest uppercase opacity-50 select-none"
        >
          Click anywhere or press Space to skip
        </p>
      </div>

      {/* ── PHASE 2: bust is traced, then printed as three colour plates ── */}
      <div
        ref={imageSectionRef}
        className="fixed inset-0 z-30 flex items-center justify-center opacity-0 pointer-events-none"
      >
        <div ref={portraitFlightRef} className="relative will-change-transform">
          <svg
            ref={portraitSvgRef}
            viewBox={PORTRAIT_VIEWBOX}
            className="block w-[min(90vw,84dvh,820px)] h-auto overflow-visible select-none"
            aria-hidden="true"
          >
            <defs>
              <mask id="scan-mask" maskUnits="userSpaceOnUse" x="-80" y="-10" width={PORTRAIT_W + 160} height={PORTRAIT_H + 20}>
                <rect ref={scanRectRef} x="-80" y="-10" width={PORTRAIT_W + 160} height="0" fill="white" />
              </mask>
              {/* colour plates: each keeps a single channel */}
              <filter id="plate-r" colorInterpolationFilters="sRGB">
                <feColorMatrix type="matrix" values={isDark ? '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0' : '1 0 0 0 0  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'} />
              </filter>
              <filter id="plate-g" colorInterpolationFilters="sRGB">
                <feColorMatrix type="matrix" values={isDark ? '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0' : '0 0 0 0 1  0 1 0 0 0  0 0 0 0 1  0 0 0 1 0'} />
              </filter>
              <filter id="plate-b" colorInterpolationFilters="sRGB">
                <feColorMatrix type="matrix" values={isDark ? '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0' : '0 0 0 0 1  0 0 0 0 1  0 0 1 0 0  0 0 0 1 0'} />
              </filter>
              <linearGradient id="scan-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={accentColor} stopOpacity="0" />
                <stop offset="0.7" stopColor={accentColor} stopOpacity="0.55" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.95" />
              </linearGradient>
              <filter id="scan-blur" x="-10%" y="-200%" width="120%" height="500%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
            </defs>

            {/* flat silhouette the plates print over */}
            <g ref={silRef}>
              {PORTRAIT_OUTLINES.map((d, i) => (
                <path key={`sil-${i}`} d={d} fill={accentColor} fillOpacity="0.2" />
              ))}
            </g>

            {/* three plates, revealed top-to-bottom by the scan, then slid into register */}
            <g mask="url(#scan-mask)" style={{ isolation: 'isolate' }}>
              {[['r', plateR], ['g', plateG], ['b', plateB]].map(([k, ref]) => (
                <image
                  key={k}
                  ref={ref}
                  href="/yashwanth-bust.png"
                  width={PORTRAIT_W}
                  height={PORTRAIT_H}
                  preserveAspectRatio="none"
                  filter={`url(#plate-${k})`}
                  style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
                />
              ))}
            </g>

            {/* pen-drawn outline */}
            {PORTRAIT_OUTLINES.map((d, i) => (
              <path
                key={`trace-${i}`}
                className="trace-outline"
                d={d}
                pathLength="1"
                fill="none"
                stroke={accentColor}
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}

            {/* registration marks */}
            <g ref={marksRef} fill="none" stroke={accentColor} strokeWidth="3.6">
              {[[-40, -40], [PORTRAIT_W + 40, -40], [-40, PORTRAIT_H + 40], [PORTRAIT_W + 40, PORTRAIT_H + 40]].map(([x, y], i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="16" />
                  <line x1={x - 32} y1={y} x2={x + 32} y2={y} />
                  <line x1={x} y1={y - 32} x2={x} y2={y + 32} />
                </g>
              ))}
            </g>

            {/* scan line */}
            <g ref={scanLineRef} opacity="0">
              <rect x="-60" y="-70" width={PORTRAIT_W + 120} height="70" fill="url(#scan-glow)" filter="url(#scan-blur)" />
              <rect x="-20" y="-3" width={PORTRAIT_W + 40} height="6" fill="#FFFFFF" opacity="0.95" />
            </g>
          </svg>
        </div>

        <div
          ref={captionRef}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-md opacity-0"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.25em] text-ink-800 dark:text-paper-100 font-medium whitespace-nowrap">
            Yashwanth Varma Racharla
          </span>
        </div>
      </div>
    </div>
  );
}
