import { useEffect, useRef } from 'react';

// The Siri orb: a dark glass sphere with four colour blooms that swirl and swell with sound.
// `getLevel()` returns 0..1 and is polled every frame (no React re-renders).
export default function SiriOrb({ size = 56, getLevel, speed = 1 }) {
  const root = useRef(null);

  useEffect(() => {
    let raf;
    let cur = 0;
    const loop = () => {
      const target = getLevel ? getLevel() : 0.1;
      cur += (target - cur) * 0.16;
      if (root.current) root.current.style.setProperty('--l', cur.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [getLevel]);

  return (
    <div ref={root} className="siri-orb" style={{ width: size, height: size, '--spd': 1 / speed }} aria-hidden="true">
      <div className="siri-inner">
        <span className="siri-blob siri-b1" />
        <span className="siri-blob siri-b2" />
        <span className="siri-blob siri-b3" />
        <span className="siri-blob siri-b4" />
      </div>
      <span className="siri-core" />
      <span className="siri-gloss" />
    </div>
  );
}
