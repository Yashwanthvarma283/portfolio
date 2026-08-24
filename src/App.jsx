import React, { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Credentials from './components/Credentials';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [isDark, setIsDark] = useState(false);

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

  const toggleTheme = () => {
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

  return (
    <div className="min-h-screen bg-paper-100 dark:bg-ink-900 text-ink-800 dark:text-paper-200 transition-colors duration-400 font-sans antialiased">
      <CustomCursor />
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
