import { motion } from 'motion/react';
import { Download, ArrowUpRight } from '@phosphor-icons/react';
import { portfolioData } from '../data/portfolioData';
import { useProfile } from '../context/ProfileContext';

const FACTS = (d) => [
  { label: 'Degree', value: d.education.degree },
  { label: 'University', value: `${d.education.institution}, ${d.education.location}` },
  { label: 'CGPA', value: `${d.education.cgpa} / 10` },
  { label: 'Graduating', value: d.education.period.split('–')[1] },
];

export default function Snapshot() {
  const { personaId, persona } = useProfile();
  const showSkills = personaId !== 'hr';
  const liveProjects = portfolioData.projects.filter((p) => p.live);

  return (
    <section
      id="snapshot"
      className="scroll-mt-16 py-20 px-5 md:px-8 bg-paper-100 dark:bg-ink-900 border-t border-paper-300 dark:border-ink-800 transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <span className="label-mono">{persona?.welcome || 'Snapshot'}</span>
          <h2 className="font-display italic text-display text-ink-900 dark:text-paper-50 mt-1.5">
            At a glance
          </h2>
          <p className="font-sans text-sm md:text-base text-ink-500 dark:text-ink-400 mt-2 max-w-xl leading-relaxed">
            {portfolioData.summary}
          </p>
        </motion.div>

        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-paper-300 dark:bg-ink-700 border border-paper-300 dark:border-ink-700 rounded-xl overflow-hidden mb-10">
          {FACTS(portfolioData).map((f) => (
            <div key={f.label} className="bg-paper-50 dark:bg-ink-800 p-5">
              <dt className="label-mono mb-1.5">{f.label}</dt>
              <dd className="font-sans text-sm md:text-base font-semibold text-ink-900 dark:text-paper-100 leading-snug">{f.value}</dd>
            </div>
          ))}
        </dl>

        {showSkills && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-10">
            {portfolioData.skills.map((g) => (
              <div key={g.category}>
                <p className="label-mono mb-2.5">{g.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((it) => (
                    <span key={it} className="font-mono text-[11px] px-2.5 py-1 rounded-md border border-paper-300 dark:border-ink-700 text-ink-700 dark:text-ink-300 bg-paper-50 dark:bg-ink-800">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {personaId === 'recruiter' && (
          <div className="mb-10">
            <p className="label-mono mb-3">Live projects</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {liveProjects.map((p) => (
                <li key={p.id}>
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-xl border border-paper-300 dark:border-ink-700 bg-paper-50 dark:bg-ink-800 px-4 py-3 hover:border-accent transition-colors duration-200 btn-press"
                  >
                    <span>
                      <span className="block font-sans text-sm font-semibold text-ink-900 dark:text-paper-100">{p.name}</span>
                      <span className="block font-mono text-[11px] text-ink-500 dark:text-ink-400">{p.badge}</span>
                    </span>
                    <ArrowUpRight size={16} weight="bold" className="text-ink-400 group-hover:text-accent shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <a
            href={portfolioData.resumeUrl}
            download
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-paper-100 dark:text-ink-900 bg-ink-900 dark:bg-paper-100 px-5 py-2.5 rounded-full hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-all duration-240 btn-press"
          >
            <Download size={15} weight="bold" /> Download resume
          </a>
          <a
            href={`mailto:${portfolioData.email}`}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-800 dark:text-paper-200 border border-paper-400 dark:border-ink-600 px-5 py-2.5 rounded-full hover:border-accent hover:text-accent transition-all duration-240 btn-press"
          >
            Email me
          </a>
        </div>
      </div>
    </section>
  );
}
