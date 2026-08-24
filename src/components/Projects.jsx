import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  ArrowRight,
  GithubLogo,
  Database,
  LockKey,
  CloudSun,
  CheckCircle,
  Code,
  Cpu,
  Sparkle,
  Stack,
  CaretRight
} from '@phosphor-icons/react';
import BounceCards from './BounceCards';
import { portfolioData } from '../data/portfolioData';

// Extended project list with rich architecture metadata
const PROJECTS = [
  {
    id: 'blood-donation',
    index: '01',
    name: 'Blood Donation Management System',
    badge: 'Spring Boot · PostgreSQL',
    pitch: 'Platform connecting blood donors with recipients and streamlining emergency blood requests with secure token-based authentication.',
    tech: ['Java', 'Spring Boot', 'PostgreSQL', 'Spring Data JPA', 'JWT Auth'],
    solved: 'Engineered a PostgreSQL database for donor records with a layered Spring Boot backend and JWT-based authentication with role-based authorization for sensitive operations.',
    github: 'https://github.com/Yashwanthvarma283',
    highlights: [
      { title: 'PostgreSQL Schema', desc: 'Foreign key constraints, indexing & JPA repositories.', icon: Database },
      { title: 'JWT & RBAC Security', desc: 'Role-based authorization filters & stateless session tokens.', icon: LockKey }
    ],
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'weather-forecast',
    index: '02',
    name: 'Weather Forecast Application',
    badge: 'Python · REST APIs',
    pitch: 'Real-time weather forecasting using Python and public REST APIs with robust response validation and error containment.',
    tech: ['Python', 'REST APIs', 'JSON Parsing', 'Requests', 'Data Validation'],
    solved: 'Engineered structured JSON parsing for meteorological data with robust error handling for API failures and response validation across locations.',
    github: 'https://github.com/Yashwanthvarma283',
    highlights: [
      { title: 'REST API Ingestion', desc: 'Resilient HTTP client with retry strategies and timeout bounds.', icon: CloudSun },
      { title: 'JSON Validation Engine', desc: 'Structured meteorological schema normalization.', icon: CheckCircle }
    ],
    image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'backend-lab',
    index: '03',
    name: 'Backend Architecture & Algorithms Lab',
    badge: 'Java 17 · Algorithms · Open Source',
    pitch: 'Open-source repository of backend algorithms, modular OOP design patterns, and relational query benchmarking.',
    tech: ['Java 17', 'Data Structures', 'OOP Principles', 'PostgreSQL', 'Git'],
    solved: 'Engineered modular Java implementations of core data structures, relational query optimizations, and RESTful service design patterns maintained publicly on GitHub.',
    github: portfolioData.github,
    highlights: [
      { title: 'Modular OOP Architecture', desc: 'Layered design patterns and decoupled interface boundaries.', icon: Code },
      { title: 'Algorithmic Optimization', desc: 'Memory & compute benchmarking for graph and tree traversals.', icon: Cpu }
    ],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'database-engine',
    index: '04',
    name: 'Relational Query & Schema Design',
    badge: 'Oracle SQL · Database Design',
    pitch: 'Enterprise relational database schemas, complex join queries, transaction management, and indexing optimizations.',
    tech: ['Oracle SQL', 'PostgreSQL', 'Relational Normalization', 'Indexing', 'Transactions'],
    solved: 'Designed normalized 3NF database schemas, structured views, and optimized query execution plans for high-throughput relational data.',
    github: portfolioData.github,
    highlights: [
      { title: '3NF Schema Architecture', desc: 'ACID transactional integrity and constraint validation.', icon: Database },
      { title: 'Query Optimization', desc: 'B-tree index tuning and explain plan analysis.', icon: Stack }
    ],
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'microservices-security',
    index: '05',
    name: 'Auth & Microservices Architecture',
    badge: 'Spring Security · REST APIs',
    pitch: 'Modular microservice endpoint design with layered security filters, request interceptors, and CORS configuration.',
    tech: ['Spring Security', 'REST APIs', 'JWT', 'Maven', 'Layered Architecture'],
    solved: 'Architected decoupled service layers with strict dependency inversion, input sanitization, and interceptor-based request tracing.',
    github: portfolioData.github,
    highlights: [
      { title: 'Spring Security Stack', desc: 'Filter chains, token validation, and password hashing.', icon: LockKey },
      { title: 'Layered Boundaries', desc: 'Controller-Service-Repository isolation with DTOs.', icon: Code }
    ],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop'
  }
];

const CARD_IMAGES = PROJECTS.map((p) => p.image);

const TRANSFORM_STYLES = [
  'rotate(8deg) translate(-170px)',
  'rotate(4deg) translate(-85px)',
  'rotate(-2deg)',
  'rotate(-6deg) translate(85px)',
  'rotate(6deg) translate(170px)'
];

export default function Projects() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeProject = PROJECTS[activeIdx];

  const handleCardClick = (idx) => {
    setActiveIdx(idx % PROJECTS.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % PROJECTS.length);
  };

  return (
    <section
      id="projects"
      className="scroll-mt-16 py-24 px-5 md:px-8 bg-paper-200 dark:bg-ink-950 border-t border-paper-300 dark:border-ink-800 transition-colors duration-400 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="label-mono">03 / Engineering</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </div>
            <h2 className="font-display italic text-display text-ink-900 dark:text-paper-50 leading-tight">
              Featured Projects
            </h2>
            <p className="font-sans text-sm md:text-base text-ink-500 dark:text-ink-400 mt-2 max-w-lg">
              Explore layered Spring Boot backends, relational schema designs, and API ingestions.
            </p>
          </div>

          {/* Project Controls & Index Pills */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-paper-100 dark:bg-ink-900 p-1.5 rounded-full border border-paper-300 dark:border-ink-700 shadow-sm">
              {PROJECTS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIdx(i)}
                  className={`px-3 py-1 rounded-full font-mono text-xs transition-all duration-300 btn-press ${
                    activeIdx === i
                      ? 'bg-accent text-white font-bold shadow-sm'
                      : 'text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-paper-200'
                  }`}
                  aria-label={`Show project ${p.index}`}
                >
                  {p.index}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-paper-400 dark:border-ink-600 bg-paper-50 dark:bg-ink-900 text-ink-800 dark:text-paper-200 hover:border-accent hover:text-accent dark:hover:border-accent dark:hover:text-accent font-mono text-xs uppercase tracking-wider transition-all duration-200 btn-press shadow-sm"
              aria-label="Next project"
            >
              <span>Next</span>
              <ArrowRight size={13} weight="bold" />
            </button>
          </div>
        </div>

        {/* ── Interactive BounceCards Fan-Out Showcase ─────────── */}
        <div className="w-full flex flex-col items-center justify-center py-6 mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center"
          >
            <BounceCards
              className="custom-bounceCards"
              images={CARD_IMAGES}
              containerWidth={540}
              containerHeight={300}
              animationDelay={0.3}
              animationStagger={0.08}
              easeType="elastic.out(1, 0.6)"
              transformStyles={TRANSFORM_STYLES}
              enableHover={true}
              onCardClick={handleCardClick}
              onCardHover={handleCardClick}
            />

            <p className="font-mono text-xs text-ink-400 dark:text-ink-500 mt-6 flex items-center gap-2">
              <Sparkle size={13} className="text-accent shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Hover cards to fan out &middot; Click any card to inspect architecture</span>
            </p>
          </motion.div>
        </div>

        {/* ── Active Project Engineering Spotlight ─────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full rounded-2xl border border-paper-300 dark:border-ink-700 bg-paper-50 dark:bg-ink-900 shadow-xl overflow-hidden p-7 md:p-10 transition-colors duration-300"
          >
            {/* Decorative Corner Accent */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-accent/5 dark:bg-accent/10 rounded-bl-[120px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">

              {/* LEFT COLUMN: Metadata, Pitch, Stack & GitHub Link (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display italic text-5xl md:text-6xl leading-none text-accent font-light select-none">
                      {activeProject.index}
                    </span>
                    <span className="label-mono border border-paper-400 dark:border-ink-600 px-3 py-1 rounded-sm bg-paper-100 dark:bg-ink-800 text-ink-700 dark:text-paper-300 font-semibold">
                      {activeProject.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl text-ink-900 dark:text-paper-100 font-medium leading-tight mb-3">
                    {activeProject.name}
                  </h3>
                  <p className="font-sans text-sm md:text-base text-ink-500 dark:text-ink-400 leading-relaxed">
                    {activeProject.pitch}
                  </p>
                </div>

                {/* Tech Stack Pills */}
                <div className="space-y-3">
                  <p className="label-mono">Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.tech.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[11px] px-2.5 py-1 rounded-md border border-paper-300 dark:border-ink-700 text-ink-700 dark:text-ink-300 bg-paper-100 dark:bg-ink-800 tracking-wide"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3">
                    <a
                      href={activeProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-paper-100 dark:text-ink-900 bg-ink-900 dark:bg-paper-100 px-5 py-2.5 rounded-full hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-all duration-240 btn-press shadow-md"
                    >
                      <GithubLogo size={15} weight="bold" />
                      <span>View Codebase</span>
                      <ArrowUpRight size={14} weight="bold" />
                    </a>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Engineering Deep Dive & Highlight Tiles (7 cols) */}
              <div className="lg:col-span-7 lg:border-l lg:border-paper-300 dark:lg:border-ink-700 lg:pl-8 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <p className="label-mono text-accent">Engineering Breakdown</p>
                  </div>
                  <p className="font-sans text-sm md:text-base text-ink-700 dark:text-paper-200 leading-relaxed">
                    {activeProject.solved}
                  </p>
                </div>

                {/* Architecture Highlight Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-paper-300 dark:border-ink-800">
                  {activeProject.highlights.map((h, i) => {
                    const Icon = h.icon;
                    return (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-paper-100/90 dark:bg-ink-800/70 border border-paper-300/80 dark:border-ink-700/80 flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-paper-50 dark:bg-ink-900 border border-paper-300 dark:border-ink-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon size={17} weight="bold" className="text-accent" />
                        </div>
                        <div>
                          <p className="font-sans text-xs font-bold text-ink-900 dark:text-paper-100">{h.title}</p>
                          <p className="font-mono text-[11px] text-ink-500 dark:text-ink-400 mt-0.5 leading-snug">
                            {h.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Status strip */}
                <div className="flex items-center justify-between pt-4 border-t border-paper-300 dark:border-ink-800 text-xs font-mono">
                  <span className="text-ink-400 dark:text-ink-500 flex items-center gap-1.5">
                    <CaretRight size={13} className="text-accent" />
                    <span>Project {activeProject.index} of 05</span>
                  </span>
                  <span className="text-accent font-semibold">
                    {activeProject.badge.split('·')[0].trim()}
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
