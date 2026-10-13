import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  LOADER_PATH_SINGLE,
  LOADER_VIEWBOX_SINGLE
} from '../data/loaderSvgPaths';
import {
  SCRATCH_VIEWBOX,
  SLASH_1_CENTER,
  SLASH_1_MASK,
  SLASH_1_SWEEP,
  SLASH_2_CENTER,
  SLASH_2_MASK,
  SLASH_2_SWEEP,
  SLASH_3_CENTER,
  SLASH_3_MASK,
  SLASH_3_SWEEP
} from '../data/scratchPaths';

export default function Preloader({ onComplete, isDark }) {
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
    imgPreload.src = '/yashwanth-cutout.png';

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

      // ── PHASE 2: Dynamic Angled Scratch Reveal (Dead Center in Viewport) ──
      masterTl.to(imageSectionRef.current, {
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out'
      }, phase2Start + 0.1);

      masterTl.fromTo(portraitFlightRef.current, {
        scale: 0.94,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: 'power3.out'
      }, phase2Start + 0.1);

      const scratchDuration = prefersReducedMotion ? 0.3 : 0.68;
      const scratchStagger = prefersReducedMotion ? 0.05 : 0.2;

      // 1. SLASH 1 (Head & Shoulders): Dynamic scratch angled at -22°, reveals from LEFT to RIGHT
      masterTl.fromTo(mask1Ref.current, {
        attr: { transform: 'translate(-850, 0)' }
      }, {
        attr: { transform: 'translate(850, 0)' },
        duration: scratchDuration,
        ease: 'power3.inOut'
      }, phase2Start + 0.15);

      masterTl.fromTo(sweep1Ref.current, {
        attr: { transform: 'translate(-850, 0)' },
        opacity: 0.95
      }, {
        attr: { transform: 'translate(850, 0)' },
        duration: scratchDuration,
        ease: 'power3.inOut'
      }, phase2Start + 0.15);

      masterTl.to(sweep1Ref.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out'
      }, phase2Start + 0.15 + scratchDuration - 0.15);

      // 2. SLASH 2 (Torso & Arms): Dynamic scratch angled at +24°, reveals from RIGHT to LEFT
      masterTl.fromTo(mask2Ref.current, {
        attr: { transform: 'translate(850, 0)' }
      }, {
        attr: { transform: 'translate(-850, 0)' },
        duration: scratchDuration,
        ease: 'power3.inOut'
      }, phase2Start + 0.15 + scratchStagger);

      masterTl.fromTo(sweep2Ref.current, {
        attr: { transform: 'translate(850, 0)' },
        opacity: 0.95
      }, {
        attr: { transform: 'translate(-850, 0)' },
        duration: scratchDuration,
        ease: 'power3.inOut'
      }, phase2Start + 0.15 + scratchStagger);

      masterTl.to(sweep2Ref.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out'
      }, phase2Start + 0.15 + scratchStagger + scratchDuration - 0.15);

      // 3. SLASH 3 (Waist & Pants): Dynamic scratch angled at -16°, reveals from LEFT to RIGHT
      masterTl.fromTo(mask3Ref.current, {
        attr: { transform: 'translate(-850, 0)' }
      }, {
        attr: { transform: 'translate(850, 0)' },
        duration: scratchDuration,
        ease: 'power3.inOut'
      }, phase2Start + 0.15 + scratchStagger * 2);

      masterTl.fromTo(sweep3Ref.current, {
        attr: { transform: 'translate(-850, 0)' },
        opacity: 0.95
      }, {
        attr: { transform: 'translate(850, 0)' },
        duration: scratchDuration,
        ease: 'power3.inOut'
      }, phase2Start + 0.15 + scratchStagger * 2);

      masterTl.to(sweep3Ref.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out'
      }, phase2Start + 0.15 + scratchStagger * 2 + scratchDuration - 0.15);

      // Subtle editorial caption badge
      if (captionRef.current) {
        masterTl.fromTo(captionRef.current, {
          opacity: 0,
          y: 8
        }, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power2.out'
        }, phase2Start + 0.6);
      }

      // ── PHASE 3: Showcase Hold & Flight into Hero Right-Side Slot ──
      const revealEndTime = phase2Start + 0.15 + scratchStagger * 2 + scratchDuration;
      const holdDuration = prefersReducedMotion ? 0.05 : 0.35;
      const flightStartTime = revealEndTime + holdDuration;
      const flightDuration = prefersReducedMotion ? 0.4 : 0.88;

      // Flight tween: dynamic target coordinates calculated when tween starts
      masterTl.to(portraitFlightRef.current, {
        x: () => {
          const targetSlot = document.getElementById('hero-portrait-slot');
          if (!targetSlot || !portraitFlightRef.current) return window.innerWidth * 0.25;
          const targetRect = targetSlot.getBoundingClientRect();
          const sourceRect = portraitFlightRef.current.getBoundingClientRect();
          return (targetRect.left + targetRect.width / 2) - (sourceRect.left + sourceRect.width / 2);
        },
        y: () => {
          const targetSlot = document.getElementById('hero-portrait-slot');
          if (!targetSlot || !portraitFlightRef.current) return 0;
          const targetRect = targetSlot.getBoundingClientRect();
          const sourceRect = portraitFlightRef.current.getBoundingClientRect();
          return (targetRect.top + targetRect.height / 2) - (sourceRect.top + sourceRect.height / 2);
        },
        scale: () => {
          const targetSlot = document.getElementById('hero-portrait-slot');
          if (!targetSlot || !portraitFlightRef.current) return 0.55;
          const targetRect = targetSlot.getBoundingClientRect();
          const sourceRect = portraitFlightRef.current.getBoundingClientRect();
          return targetRect.width / sourceRect.width;
        },
        duration: flightDuration,
        ease: 'power3.inOut'
      }, flightStartTime);

      // Fade out preloader backdrop smoothly to unveil the Hero section & Navbar
      masterTl.to(containerRef.current, {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        duration: flightDuration * 0.75,
        ease: 'power2.inOut'
      }, flightStartTime + flightDuration * 0.25);

      // Fade out top header and caption during flight
      masterTl.to([headerRef.current, captionRef.current], {
        opacity: 0,
        y: -12,
        duration: 0.35,
        ease: 'power2.inOut'
      }, flightStartTime);

    }, containerRef);

    const finishSequence = () => {
      if (isFinishedRef.current) return;
      isFinishedRef.current = true;
      document.body.style.overflow = prevOverflow;
      if (onComplete) onComplete();
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
  }, [onComplete]);

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

      {/* ── PHASE 2: Dedicated True-Viewport-Centered Scratch Reveal (NO Boundaries / NO Box) ── */}
      {/* Placed fixed inset-0 so it is 100% dead center in the viewport vertically & horizontally */}
      <div
        ref={imageSectionRef}
        className="fixed inset-0 z-30 flex items-center justify-center opacity-0 pointer-events-none"
      >
        {/* Flight container: animates from exact middle directly to hero right-side slot */}
        <div
          ref={portraitFlightRef}
          className="relative flex flex-col items-center justify-center will-change-transform"
        >
          {/* Ambient warm gradient halo behind the cutout silhouette */}
          <div className="absolute -inset-16 bg-gradient-to-tr from-accent/25 via-accent/10 to-transparent rounded-full blur-3xl opacity-60 dark:opacity-40 -z-10 pointer-events-none" />

          {/* SVG Scratch Masking Canvas (Free size without boundaries, covers full image) */}
          <svg
            viewBox={SCRATCH_VIEWBOX}
            className="h-[76vh] sm:h-[80vh] md:h-[84vh] lg:h-[86vh] max-h-[920px] w-auto max-w-[92vw] overflow-visible select-none pointer-events-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
          >
            <defs>
              {/* Terracotta Scratch Sweep Gradient: Left to Right */}
              <linearGradient id="grad-terracotta-ltr" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7C3511" stopOpacity="0" />
                <stop offset="35%" stopColor="#7C3511" stopOpacity="0.85" />
                <stop offset="85%" stopColor="#C2622D" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#FAF9F6" stopOpacity="0.9" />
              </linearGradient>

              {/* Terracotta Scratch Sweep Gradient: Right to Left */}
              <linearGradient id="grad-terracotta-rtl" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#7C3511" stopOpacity="0" />
                <stop offset="35%" stopColor="#7C3511" stopOpacity="0.85" />
                <stop offset="85%" stopColor="#C2622D" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#FAF9F6" stopOpacity="0.9" />
              </linearGradient>

              {/* Subtle dry-brush fiber displacement filter for authentic scratch edges */}
              <filter id="scratch-displacement" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04 0.35" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
              </filter>

              {/* SLASH 1 MASK: Angled at -22° (Head & Shoulders, reveals Left to Right) */}
              <mask id="slash-mask-1" maskUnits="userSpaceOnUse" x="-2500" y="-2500" width="6000" height="6000">
                <g transform={`translate(${SLASH_1_CENTER.cx}, ${SLASH_1_CENTER.cy}) rotate(${SLASH_1_CENTER.angle})`}>
                  <g ref={mask1Ref} transform="translate(-850, 0)">
                    <path d={SLASH_1_MASK} fill="white" />
                  </g>
                </g>
              </mask>

              {/* SLASH 2 MASK: Angled at +24° (Torso & Arms, reveals Right to Left) */}
              <mask id="slash-mask-2" maskUnits="userSpaceOnUse" x="-2500" y="-2500" width="6000" height="6000">
                <g transform={`translate(${SLASH_2_CENTER.cx}, ${SLASH_2_CENTER.cy}) rotate(${SLASH_2_CENTER.angle})`}>
                  <g ref={mask2Ref} transform="translate(850, 0)">
                    <path d={SLASH_2_MASK} fill="white" />
                  </g>
                </g>
              </mask>

              {/* SLASH 3 MASK: Angled at -16° (Waist & Pants, reveals Left to Right) */}
              <mask id="slash-mask-3" maskUnits="userSpaceOnUse" x="-2500" y="-2500" width="6000" height="6000">
                <g transform={`translate(${SLASH_3_CENTER.cx}, ${SLASH_3_CENTER.cy}) rotate(${SLASH_3_CENTER.angle})`}>
                  <g ref={mask3Ref} transform="translate(-850, 0)">
                    <path d={SLASH_3_MASK} fill="white" />
                  </g>
                </g>
              </mask>
            </defs>

            {/* ── THE 3 DYNAMIC ANGLED REVEAL LAYERS (NO rectangular clips, completely borderless) ── */}
            {/* Layer 1: Revealed dynamically via Slash 1 (-22° angle) */}
            <g mask="url(#slash-mask-1)">
              <image href="/yashwanth-cutout.png" width="874" height="1507" preserveAspectRatio="none" />
            </g>

            {/* Layer 2: Revealed dynamically via Slash 2 (+24° angle) */}
            <g mask="url(#slash-mask-2)">
              <image href="/yashwanth-cutout.png" width="874" height="1507" preserveAspectRatio="none" />
            </g>

            {/* Layer 3: Revealed dynamically via Slash 3 (-16° angle) */}
            <g mask="url(#slash-mask-3)">
              <image href="/yashwanth-cutout.png" width="874" height="1507" preserveAspectRatio="none" />
            </g>

            {/* ── SHADED TERRACOTTA SCRATCH SWEEPS (Travel along each angled scratch front) ── */}
            {/* Slash 1 Sweep (-22° angle) */}
            <g transform={`translate(${SLASH_1_CENTER.cx}, ${SLASH_1_CENTER.cy}) rotate(${SLASH_1_CENTER.angle})`}>
              <g ref={sweep1Ref} transform="translate(-850, 0)" filter="url(#scratch-displacement)">
                <path d={SLASH_1_SWEEP} fill="url(#grad-terracotta-ltr)" opacity="0.95" />
                <path d={SLASH_1_SWEEP} stroke="#FAF9F6" strokeWidth="2" strokeOpacity="0.75" fill="none" />
              </g>
            </g>

            {/* Slash 2 Sweep (+24° angle) */}
            <g transform={`translate(${SLASH_2_CENTER.cx}, ${SLASH_2_CENTER.cy}) rotate(${SLASH_2_CENTER.angle})`}>
              <g ref={sweep2Ref} transform="translate(850, 0)" filter="url(#scratch-displacement)">
                <path d={SLASH_2_SWEEP} fill="url(#grad-terracotta-rtl)" opacity="0.95" />
                <path d={SLASH_2_SWEEP} stroke="#FAF9F6" strokeWidth="2" strokeOpacity="0.75" fill="none" />
              </g>
            </g>

            {/* Slash 3 Sweep (-16° angle) */}
            <g transform={`translate(${SLASH_3_CENTER.cx}, ${SLASH_3_CENTER.cy}) rotate(${SLASH_3_CENTER.angle})`}>
              <g ref={sweep3Ref} transform="translate(-850, 0)" filter="url(#scratch-displacement)">
                <path d={SLASH_3_SWEEP} fill="url(#grad-terracotta-ltr)" opacity="0.95" />
                <path d={SLASH_3_SWEEP} stroke="#FAF9F6" strokeWidth="2" strokeOpacity="0.75" fill="none" />
              </g>
            </g>
          </svg>

          {/* Minimal Editorial Badge */}
          <div
            ref={captionRef}
            className="flex items-center gap-2 mt-4 px-3.5 py-1 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-md opacity-0 pointer-events-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.25em] text-ink-800 dark:text-paper-100 font-medium">
              Yashwanth Varma Racharla
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
