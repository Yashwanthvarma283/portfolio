import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

// Each section unfolds from an inset, rounded card to full bleed as it scrolls into view.
export default function SectionFrame({ children }) {
  const ref = useRef(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(ref.current, {
      clipPath: 'inset(56px 18px 0px 18px round 40px)',
    }, {
      clipPath: 'inset(0px 0px 0px 0px round 0px)',
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top 96%', end: 'top 38%', scrub: true },
    });
  }, { scope: ref });

  return <div ref={ref}>{children}</div>;
}
