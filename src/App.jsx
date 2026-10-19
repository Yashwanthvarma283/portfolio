import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence } from 'motion/react';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Credentials from './components/Credentials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Snapshot from './components/Snapshot';
import Capstones from './components/Capstones';
import ProfileGate from './components/ProfileGate';
import SectionDivider from './components/SectionDivider';
import SectionFrame from './components/SectionFrame';
import VoiceAssistant from './components/VoiceAssistant';
import { SECTION_LABELS } from './data/personas';
import OwnerSignIn from './components/OwnerSignIn';
import { ProfileProvider, useProfile } from './context/ProfileContext';

const SECTIONS = {
  snapshot: Snapshot,
  about: About,
  experience: Experience,
  projects: Projects,
  capstones: Capstones,
  credentials: Credentials,
  contact: Contact,
};

function Shell() {
  const { persona, pick, ownerModalOpen, closeOwnerModal, ownerSignedIn } = useProfile();
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flightStarted, setFlightStarted] = useState(false);
  const [introTarget, setIntroTarget] = useState(persona ? 'hero' : 'tile');
  const pointerRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const everPicked = useRef(Boolean(persona));
  if (persona) everPicked.current = true;

  // Remember where the user last touched so transitions can open and close from there.
  useEffect(() => {
    const track = (e) => { pointerRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('pointerdown', track, true);
    return () => window.removeEventListener('pointerdown', track, true);
  }, []);

  const handlePick = (id, point) => {
    pointerRef.current = point;
    pick(id);
  };

  // Read persisted theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('yr_theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Enable custom cursor class
    document.documentElement.classList.add('custom-cursor-active');
  }, []);

  const applyTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('yr_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('yr_theme', 'light');
      }
      return next;
    });
  };

  // Theme switch: a circle of the new theme grows out of the button you pressed.
  const toggleTheme = (e) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce) { applyTheme(); return; }
    const x = e?.clientX ?? window.innerWidth - 40;
    const y = e?.clientY ?? 30;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(() => { flushSync(applyTheme); });
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 800, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  };

  const replayLoader = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIntroTarget(persona ? 'hero' : 'tile');
    setFlightStarted(false);
    setIsLoading(true);
  };

  return (
    <div className="min-h-screen bg-paper-100 dark:bg-ink-900 text-ink-800 dark:text-paper-200 transition-colors duration-400 font-sans antialiased">
      {isLoading && (
        <Preloader
          isDark={isDark}
          target={introTarget}
          onFlightStart={() => setFlightStarted(true)}
          onComplete={() => setIsLoading(false)}
        />
      )}
      <CustomCursor />
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <main>
        <Hero ready={!isLoading && Boolean(persona)} />
        {persona && persona.sections.map((id, i) => {
          const Section = SECTIONS[id];
          if (!Section) return null;
          return (
            <React.Fragment key={id}>
              <SectionDivider label={SECTION_LABELS[id] || id} index={i} total={persona.sections.length} />
              <SectionFrame><Section /></SectionFrame>
            </React.Fragment>
          );
        })}
      </main>
      <Footer onReplayLoader={replayLoader} />
      {persona && !isLoading && <VoiceAssistant key={persona.id} personaId={persona.id} />}
      <AnimatePresence custom={{ origin: pointerRef.current, first: !everPicked.current }}>
        {!persona && (
          <ProfileGate
            key="gate"
            onPick={handlePick}
            reveal={flightStarted || !isLoading}
            landed={!isLoading}
            origin={pointerRef.current}
            first={!everPicked.current}
          />
        )}
      </AnimatePresence>
      {ownerModalOpen && <OwnerSignIn onClose={closeOwnerModal} onSuccess={ownerSignedIn} />}
    </div>
  );
}

export default function App() {
  return (
    <ProfileProvider>
      <Shell />
    </ProfileProvider>
  );
}
