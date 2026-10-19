import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Download, List, X, UsersThree } from '@phosphor-icons/react';
import { portfolioData } from '../data/portfolioData';
import { SECTION_LABELS } from '../data/personas';
import { useProfile } from '../context/ProfileContext';

export default function Navbar({ isDark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { persona, switchProfile, isOwner, signOut } = useProfile();
  const sections = persona ? persona.sections : [];
  const NAV_ITEMS = sections.map((id) => ({ id, label: SECTION_LABELS[id] || id }));

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section detection via IntersectionObserver
  useEffect(() => {
    const sectionIds = ['hero', ...sections];
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections.join('|')]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      if (window.lenis) {
        window.lenis.scrollTo(el, { offset: -40, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? 'bg-paper-100/90 dark:bg-ink-900/90 backdrop-blur-md border-b border-paper-300 dark:border-ink-700 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">

          {/* Monogram / Brand */}
          <button
            onClick={() => scrollTo('hero')}
            className="group flex items-center gap-2.5 btn-press"
            aria-label="Back to top"
          >
            <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-mono text-[11px] font-bold text-white tracking-tight">
              YVR
            </span>
            <span className="hidden sm:block font-sans text-sm font-semibold text-ink-700 dark:text-paper-300 tracking-tight group-hover:text-accent dark:group-hover:text-accent transition-colors duration-200">
              {portfolioData.firstName}
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3.5 py-1.5 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-200 btn-press ${
                  activeSection === item.id
                    ? 'bg-ink-800 dark:bg-paper-200 text-paper-100 dark:text-ink-900'
                    : 'text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-paper-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={portfolioData.resumeUrl}
              download
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-paper-400 dark:border-ink-600 font-mono text-xs uppercase tracking-widest text-ink-700 dark:text-paper-300 hover:border-accent hover:text-accent dark:hover:text-accent transition-all duration-200 btn-press"
            >
              <Download size={13} weight="bold" />
              Resume
            </a>
            {persona && (
              <button
                onClick={switchProfile}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-paper-400 dark:border-ink-600 font-mono text-xs uppercase tracking-widest text-ink-700 dark:text-paper-300 hover:border-accent hover:text-accent dark:hover:text-accent transition-all duration-200 btn-press"
                aria-label="Switch profile"
              >
                <UsersThree size={14} weight="bold" />
                {persona.name}
              </button>
            )}
            {isOwner && (
              <button
                onClick={signOut}
                className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full border border-paper-400 dark:border-ink-600 font-mono text-xs uppercase tracking-widest text-ink-700 dark:text-paper-300 hover:border-accent hover:text-accent dark:hover:text-accent transition-all duration-200 btn-press"
              >
                Sign out
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-paper-400 dark:border-ink-600 text-ink-600 dark:text-paper-400 hover:border-accent hover:text-accent dark:hover:text-accent transition-all duration-200 btn-press"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={15} weight="bold" /> : <Moon size={15} weight="bold" />}
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-full border border-paper-400 dark:border-ink-600 text-ink-600 dark:text-paper-400 btn-press"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={15} weight="bold" /> : <List size={15} weight="bold" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-16 left-0 right-0 z-40 bg-paper-100/95 dark:bg-ink-900/95 backdrop-blur-md border-b border-paper-300 dark:border-ink-700 px-5 py-4 flex flex-col gap-2 md:hidden"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left font-mono text-xs uppercase tracking-widest py-2 text-ink-600 dark:text-ink-400 hover:text-accent dark:hover:text-accent transition-colors"
            >
              {item.label}
            </button>
          ))}
          {persona && (
            <button
              onClick={() => { setMobileOpen(false); switchProfile(); }}
              className="text-left font-mono text-xs uppercase tracking-widest py-2 text-ink-600 dark:text-ink-400 hover:text-accent transition-colors"
            >
              Switch profile ({persona.name})
            </button>
          )}
          <a
            href={portfolioData.resumeUrl}
            download
            className="inline-flex items-center gap-1.5 mt-1 font-mono text-xs uppercase tracking-widest text-ink-600 dark:text-ink-400 hover:text-accent transition-colors"
          >
            <Download size={13} weight="bold" />
            Download Resume
          </a>
        </motion.div>
      )}
    </>
  );
}
