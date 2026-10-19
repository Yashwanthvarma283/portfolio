import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './lib/gsap';
import App from './App';
import './index.css';

// ── Lenis smooth scroll + GSAP ScrollTrigger integration ─────
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

window.lenis = lenis;

lenis.on('scroll', ScrollTrigger.update);

const tickerCallback = (time) => lenis.raf(time * 1000);
gsap.ticker.add(tickerCallback);
gsap.ticker.lagSmoothing(0);

// ── Mount ──────────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App lenis={lenis} />
  </React.StrictMode>
);
