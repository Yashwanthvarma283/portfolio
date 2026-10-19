import { useMotionValue, useSpring } from 'motion/react';
import { useRef } from 'react';

/**
 * Magnetic button hook — Emil Kowalski style.
 * Returns spring-physics x/y offsets and event handlers.
 * Uses Motion's useMotionValue + useSpring (never useState).
 */
export function useMagneticButton(strength = 0.3) {
  const ref = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const onMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    rawX.set((e.clientX - centerX) * strength);
    rawY.set((e.clientY - centerY) * strength);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { ref, x, y, onMouseMove, onMouseLeave };
}
