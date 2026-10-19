import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

// Full-width chapter band between sections: outlined type slides with the scroll
// while an accent fill wipes through it, so each section change is a small event.
export default function SectionDivider({ label, index, total }) {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(fillRef.current, { clipPath: 'inset(0 0% 0 0)' });
      return;
    }
    const dir = index % 2 ? -1 : 1;
    gsap.fromTo(trackRef.current, { xPercent: 10 * dir }, {
      xPercent: -10 * dir, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.fromTo(fillRef.current, { clipPath: 'inset(0 100% 0 0)' }, {
      clipPath: 'inset(0 0% 0 0)', ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top 88%', end: 'center 42%', scrub: true },
    });
  }, { scope: ref });

  const num = String(index + 1).padStart(2, '0');
  const of = String(total).padStart(2, '0');

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative overflow-hidden py-8 md:py-12 bg-paper-100 dark:bg-ink-900 border-t border-paper-300 dark:border-ink-800 transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between mb-2">
        <span className="label-mono">{num} / {of}</span>
        <span className="label-mono">Next</span>
      </div>
      <div ref={trackRef} className="relative inline-block whitespace-nowrap pl-5 md:pl-8 will-change-transform">
        <span
          className="block font-display italic font-light leading-[0.95] text-[clamp(64px,15vw,210px)] text-transparent"
          style={{ WebkitTextStroke: '1.5px currentColor' }}
        >
          <span className="text-ink-300 dark:text-ink-600">{label}</span>
        </span>
        <span
          ref={fillRef}
          className="absolute left-5 md:left-8 top-0 block font-display italic font-light leading-[0.95] text-[clamp(64px,15vw,210px)] text-accent"
          style={{ clipPath: 'inset(0 100% 0 0)' }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
