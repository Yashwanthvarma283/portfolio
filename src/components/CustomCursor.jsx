import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

/**
 * Custom cursor — 12px filled dot + 40px ring.
 * Follows mouse with smooth lag (GSAP ticker, NOT React state).
 * Grows on interactive elements.
 * Hidden on touch devices via media query.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100, dx: -100, dy: -100 });
  const isHovering = useRef(false);

  useEffect(() => {
    // Only show on devices with fine pointer (not touch)
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;

    const onMouseMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const onMouseEnterInteractive = () => {
      isHovering.current = true;
      gsap.to(ring, { scale: 1.8, opacity: 0.5, duration: 0.3, ease: 'power2.out' });
      gsap.to(dot, { scale: 0.5, duration: 0.2, ease: 'power2.out' });
    };

    const onMouseLeaveInteractive = () => {
      isHovering.current = false;
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(dot, { scale: 1, duration: 0.2, ease: 'power2.out' });
    };

    // Attach hover listeners to interactive elements
    const interactiveSelector = 'a, button, [role="button"], input, textarea, label';
    const addListeners = () => {
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterInteractive);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };

    addListeners();

    window.addEventListener('mousemove', onMouseMove);

    // GSAP ticker loop — no React state updates on every frame
    const lerp = 0.15;
    const tickerFn = () => {
      const p = pos.current;
      p.dx += (p.x - p.dx) * lerp;
      p.dy += (p.y - p.dy) * lerp;

      gsap.set(dot, { x: p.x, y: p.y, xPercent: -50, yPercent: -50 });
      gsap.set(ring, { x: p.dx, y: p.dy, xPercent: -50, yPercent: -50 });
    };

    gsap.ticker.add(tickerFn);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(tickerFn);
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] w-3 h-3 rounded-full bg-accent pointer-events-none mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9998] w-10 h-10 rounded-full border border-ink-800 dark:border-paper-200 pointer-events-none"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
