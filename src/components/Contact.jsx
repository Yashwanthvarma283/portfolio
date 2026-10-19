import { useState } from 'react';
import { motion } from 'motion/react';
import { EnvelopeSimple, Phone, LinkedinLogo, GithubLogo, ArrowUpRight, CopySimple, Check } from '@phosphor-icons/react';
import { portfolioData } from '../data/portfolioData';

const REVEAL = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section
      id="contact"
      className="py-24 px-5 md:px-8 bg-paper-200 dark:bg-ink-950 border-t border-paper-300 dark:border-ink-800"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section label */}
        <motion.div
          variants={REVEAL} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mb-14"
        >
          <span className="label-mono">Transmission</span>
        </motion.div>

        {/* Large heading */}
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display italic font-light text-display text-ink-900 dark:text-paper-50 leading-tight mb-6"
        >
          Let's discuss<br />
          backend engineering<span className="font-sans not-italic text-accent">.</span>
        </motion.h2>

        <motion.p
          variants={REVEAL} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="font-sans text-base md:text-lg text-ink-500 dark:text-ink-400 leading-relaxed max-w-2xl mb-10"
        >
          Available for full-time software engineering roles and technical discussions around Java, Spring Boot, distributed backend architectures, and database performance optimisation.
        </motion.p>

        {/* Email CTA — large mailto link */}
        <motion.div
          variants={REVEAL} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="flex flex-wrap items-center gap-3 mb-12"
        >
          <a
            href={`mailto:${portfolioData.email}`}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-ink-900 dark:bg-paper-100 text-paper-100 dark:text-ink-900 font-mono text-xs md:text-sm uppercase tracking-widest hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-all duration-240 btn-press shadow-md"
          >
            <EnvelopeSimple size={16} weight="bold" />
            Send Email
          </a>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-paper-400 dark:border-ink-600 text-ink-700 dark:text-paper-300 font-mono text-xs uppercase tracking-widest hover:border-accent hover:text-accent dark:hover:text-accent transition-all duration-240 btn-press"
            aria-label="Copy email address"
          >
            {copied ? (
              <>
                <Check size={14} weight="bold" className="text-green-600" />
                Copied
              </>
            ) : (
              <>
                <CopySimple size={14} weight="bold" />
                {portfolioData.email}
              </>
            )}
          </button>
        </motion.div>

        {/* Channel links */}
        <motion.div
          variants={REVEAL} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="border-t border-paper-300 dark:border-ink-800 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { icon: LinkedinLogo, label: 'LinkedIn', sub: portfolioData.linkedinHandle, href: portfolioData.linkedin },
            { icon: GithubLogo,   label: 'GitHub',   sub: portfolioData.githubHandle,   href: portfolioData.github },
            { icon: Phone,        label: 'Phone',    sub: portfolioData.phone,           href: `tel:${portfolioData.phone}` },
          ].map(({ icon: Icon, label, sub, href }, i) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              variants={REVEAL} custom={i * 0.3 + 3.5} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="group flex items-center gap-3 p-4 rounded-lg border border-paper-300 dark:border-ink-700 bg-paper-50 dark:bg-ink-900 hover:border-accent transition-all duration-200 btn-press"
            >
              <Icon size={18} weight="regular" className="text-accent shrink-0" />
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-widest text-ink-500 dark:text-ink-500">{label}</p>
                <p className="font-sans text-sm text-ink-700 dark:text-paper-300 truncate group-hover:text-accent transition-colors duration-200">
                  {sub}
                </p>
              </div>
              <ArrowUpRight size={14} className="ml-auto opacity-40 group-hover:opacity-100 group-hover:text-accent transition-all" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
