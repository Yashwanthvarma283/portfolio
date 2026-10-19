import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';

/**
 * Count-up animation hook.
 * Uses GSAP + IntersectionObserver — not React state on every frame.
 */
export function useCountUp(target, { decimals = 0, duration = 1.8, delay = 0 } = {}) {
  const [value, setValue] = useState(0);
  const triggerRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration,
            delay,
            ease: 'power2.out',
            onUpdate: () => {
              setValue(parseFloat(obj.val.toFixed(decimals)));
            },
          });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, decimals, duration, delay]);

  return { value, triggerRef };
}
