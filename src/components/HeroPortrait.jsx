import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { useProfile } from '../context/ProfileContext';
import { PORTRAIT_OUTLINES, PORTRAIT_VIEWBOX, PORTRAIT_W, PORTRAIT_H } from '../data/portraitTrace';
import { CALLOUTS } from '../data/callouts';

// Bust portrait set like a printed plate:
//   halftone accent plate (printed slightly out of register) · die-cut photo · inked contour
//   · registration marks · blueprint callouts that change per profile.
const BUST = 'url(/yashwanth-bust.png)';
const maskStyle = {
  WebkitMaskImage: BUST, maskImage: BUST,
  WebkitMaskSize: '100% 100%', maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
};
const MARKS = [[-34, PORTRAIT_H + 34], [PORTRAIT_W + 34, PORTRAIT_H + 34]];

export default function HeroPortrait({ ready, sectionRef }) {
  const { personaId } = useProfile();
  const callouts = CALLOUTS[personaId] || CALLOUTS.recruiter;

  const box = useRef(null);
  const plate = useRef(null);
  const photo = useRef(null);
  const photoSvg = useRef(null);
  const contour = useRef(null);
  const orbit = useRef(null);
  const marks = useRef(null);
  const lines = useRef(null);
  const labels = useRef(null);

  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useGSAP(() => {
    const cPaths = contour.current.querySelectorAll('path');
    const lPaths = lines.current.querySelectorAll('.cl-line');
    const dots = lines.current.querySelectorAll('.cl-dot');
    const labelEls = labels.current.children;
    const hidden = () => {
      gsap.set(photo.current, { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(plate.current, { opacity: 0, xPercent: 9, yPercent: 0 });
      gsap.set(marks.current, { opacity: 0, scale: 1.12, transformOrigin: '50% 50%' });
      gsap.set(cPaths, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(contour.current, { opacity: 1 });
      gsap.set(orbit.current, { opacity: 0 });
      gsap.set(lPaths, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(dots, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labelEls, { opacity: 0, x: -14 });
    };
    if (!ready) { hidden(); return; }
    if (reduce) {
      gsap.set(photo.current, { clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(plate.current, { opacity: 1, xPercent: -3.5, yPercent: -2 });
      gsap.set(marks.current, { opacity: 1, scale: 1 });
      gsap.set(cPaths, { strokeDasharray: 1, strokeDashoffset: 0 });
      gsap.set(contour.current, { opacity: 0.55 });
      gsap.set(lPaths, { strokeDasharray: 1, strokeDashoffset: 0 });
      gsap.set(dots, { scale: 1 });
      gsap.set(labelEls, { opacity: 1, x: 0 });
      return;
    }
    hidden();
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.5 });
    tl.to(marks.current, { opacity: 1, scale: 1, duration: 1.2 }, 0)
      .to(photo.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15 }, 0.1)
      .to(plate.current, { opacity: 1, xPercent: -3.5, yPercent: -2, duration: 1.2 }, 0.45)
      .to(cPaths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.5)
      .to(dots, { scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(3)' }, 1.0)
      .to(lPaths, { strokeDashoffset: 0, duration: 0.9, stagger: 0.12, ease: 'power2.inOut' }, 1.05)
      .to(labelEls, { opacity: 1, x: 0, duration: 0.7, stagger: 0.12 }, 1.35)
      .to(contour.current, { opacity: 0.55, duration: 0.8 }, 2.1)
      .to(orbit.current, { opacity: 1, duration: 0.6 }, 2.0);
  }, { dependencies: [ready, personaId], scope: box, revertOnUpdate: true });

  // Scroll: the photo desaturates as the hero leaves
  useGSAP(() => {
    if (reduce) return;
    gsap.to(photoSvg.current, {
      filter: 'grayscale(1) contrast(1.1)', ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '85% top', scrub: true },
    });
  }, { scope: box });

  // Pointer: plate and callouts drift against the photo
  useEffect(() => {
    if (reduce || window.matchMedia('(pointer: coarse)').matches) return undefined;
    const set = (el, dx, dy) => ({
      dx, dy,
      qx: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3' }),
      qy: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3' }),
    });
    const L = [set(plate.current, -14, -8), set(labels.current, 8, 4), set(lines.current, 8, 4)];
    const move = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      L.forEach((l) => { l.qx(nx * l.dx); l.qy(ny * l.dy); });
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [reduce]);

  return (
    <div className="absolute inset-0 flex items-end justify-center lg:justify-start lg:pl-[30%] pointer-events-none">
      <div ref={box} className="relative w-full max-w-[600px] lg:w-[min(600px,52vw)]" style={{ aspectRatio: `${PORTRAIT_W} / ${PORTRAIT_H}` }}>

        {/* registration marks */}
        <svg ref={marks} aria-hidden="true" viewBox={PORTRAIT_VIEWBOX} className="absolute inset-0 w-full h-full overflow-visible">
          {MARKS.map(([x, y], i) => (
            <g key={i} stroke="#C2622D" strokeWidth="2" fill="none" opacity=".85">
              <circle cx={x} cy={y} r="11" />
              <line x1={x - 22} y1={y} x2={x + 22} y2={y} />
              <line x1={x} y1={y - 22} x2={x} y2={y + 22} />
            </g>
          ))}
        </svg>

        {/* halftone accent plate, printed slightly out of register */}
        <div
          ref={plate}
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            ...maskStyle,
            backgroundColor: 'rgba(194,98,45,.22)',
            backgroundImage: 'radial-gradient(#C2622D 1.7px, transparent 2.3px)',
            backgroundSize: '7px 7px',
          }}
        />

        {/* die-cut photo */}
        <div ref={photo} className="absolute inset-0">
          <svg ref={photoSvg} viewBox={PORTRAIT_VIEWBOX} role="img" aria-label="Yashwanth Varma Racharla" className="block w-full h-full overflow-visible">
            <defs>
              <filter id="yr-diecut" x="-8%" y="-8%" width="116%" height="112%" colorInterpolationFilters="sRGB">
                <feMorphology in="SourceAlpha" operator="dilate" radius="8" result="dil" />
                <feGaussianBlur in="dil" stdDeviation="1" result="dilSoft" />
                <feFlood floodColor="#FFFFFF" result="paper" />
                <feComposite in="paper" in2="dilSoft" operator="in" result="border" />
                <feMerge result="stack">
                  <feMergeNode in="border" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
                <feDropShadow in="stack" dx="0" dy="8" stdDeviation="12" floodColor="#1E1B18" floodOpacity="0.26" />
              </filter>
            </defs>
            <image href="/yashwanth-bust.png" width={PORTRAIT_W} height={PORTRAIT_H} preserveAspectRatio="none" filter="url(#yr-diecut)" />
            <g ref={contour} fill="none" strokeLinejoin="round" strokeLinecap="round">
              {PORTRAIT_OUTLINES.map((d, i) => <path key={i} d={d} pathLength="1" stroke="#C2622D" strokeWidth="3" />)}
            </g>
            <g ref={orbit} fill="none" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px #FF9A5C)' }}>
              {PORTRAIT_OUTLINES.map((d, i) => (
                <path key={i} className="yr-orbit" d={d} pathLength="1" stroke="#FFD2B0" strokeWidth="4.5" strokeDasharray="0.06 0.94" />
              ))}
            </g>
          </svg>
        </div>

        {/* blueprint callouts (desktop) */}
        <svg ref={lines} aria-hidden="true" viewBox={PORTRAIT_VIEWBOX} className="hidden lg:block absolute inset-0 w-full h-full overflow-visible">
          {callouts.map((c, i) => (
            <g key={i}>
              <path
                className="cl-line"
                d={`M${c.ax} ${c.ay} L${c.ex} ${c.ey} L890 ${c.ey}`}
                pathLength="1" fill="none" stroke="#C2622D" strokeWidth="1.6" strokeLinejoin="round"
              />
              <circle className="cl-dot" cx={c.ax} cy={c.ay} r="6" fill="#C2622D" stroke="#FFFFFF" strokeWidth="2" />
            </g>
          ))}
        </svg>
        <div ref={labels} className="hidden lg:block absolute inset-0">
          {callouts.map((c, i) => (
            <div
              key={i}
              className="absolute -translate-y-1/2 pl-3 w-[210px]"
              style={{ left: `${(890 / PORTRAIT_W) * 100}%`, top: `${(c.ey / PORTRAIT_H) * 100}%` }}
            >
              <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-900 dark:text-paper-100 leading-tight">{c.title}</span>
              <span className="block font-mono text-[10px] tracking-wide text-ink-500 dark:text-ink-400 mt-0.5 leading-tight">{c.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
