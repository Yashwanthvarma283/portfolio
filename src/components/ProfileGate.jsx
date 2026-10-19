import { motion } from 'motion/react';
import { LockKey, IdentificationBadge, Briefcase, Code, Compass } from '@phosphor-icons/react';
import { PERSONAS, PICKER_ORDER } from '../data/personas';

const ICONS = { owner: LockKey, hr: IdentificationBadge, recruiter: Briefcase, developer: Code, visitor: Compass };

const reach = () => `${Math.ceil(Math.hypot(window.innerWidth, window.innerHeight))}px`;
const iris = (o, r) => `circle(${r} at ${Math.round(o.x)}px ${Math.round(o.y)}px)`;

// Iris transition: the picker opens from, and closes onto, the point you last touched.
const variants = {
  enter: ({ origin, first }) => (first ? { opacity: 0 } : { opacity: 1, clipPath: iris(origin, '0px') }),
  show: ({ origin, first }) => ({
    opacity: 1,
    clipPath: iris(origin, reach()),
    transition: { duration: first ? 0.4 : 0.85, ease: [0.76, 0, 0.24, 1] },
  }),
  leave: ({ origin }) => ({
    clipPath: iris(origin, '0px'),
    transition: { duration: 0.95, ease: [0.76, 0, 0.24, 1] },
  }),
};

export default function ProfileGate({ onPick, reveal, landed, origin, first }) {
  const handle = (id) => (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    onPick(id, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Choose a profile"
      custom={{ origin, first }}
      variants={variants}
      initial="enter"
      animate="show"
      exit="leave"
      className="fixed inset-0 z-[90] bg-ink-950 text-paper-100 overflow-y-auto"
    >
      <div className="min-h-full flex flex-col items-center justify-center px-5 py-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={reveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400 mb-4"
        >
          Yashwanth Varma Racharla
        </motion.p>
        <div className="overflow-hidden mb-12 md:mb-16 pb-2">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: reveal ? 0 : '110%' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display italic font-light text-display text-center"
          >
            Who&rsquo;s viewing?
          </motion.h1>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-7 w-full max-w-5xl">
          {PICKER_ORDER.map((id, i) => {
            const p = PERSONAS[id];
            const Icon = ICONS[id];
            const owner = id === 'owner';
            return (
              <motion.li
                key={id}
                initial={owner ? { opacity: 0 } : { opacity: 0, y: 28 }}
                animate={reveal ? { opacity: 1, y: 0 } : owner ? { opacity: 0 } : { opacity: 0, y: 28 }}
                transition={{ duration: 0.6, delay: owner ? 0 : 0.35 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={owner ? 'col-span-2 sm:col-span-1' : ''}
              >
                <button onClick={handle(id)} className="group w-full flex flex-col items-center gap-3 btn-press focus:outline-none">
                  <span
                    id={owner ? 'owner-avatar' : undefined}
                    className="relative w-full aspect-square max-w-[190px] rounded-xl bg-ink-800 border border-ink-700 flex items-center justify-center overflow-hidden transition-[border-color,transform] duration-240 group-hover:border-accent group-focus-visible:border-accent group-hover:scale-[1.04] group-focus-visible:ring-2 group-focus-visible:ring-accent"
                  >
                    {owner ? (
                      <img
                        src="/yashwanth-bust.png"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        style={{ opacity: landed ? 1 : 0 }}
                      />
                    ) : (
                      <Icon size={56} weight="light" className="text-paper-300 group-hover:text-accent transition-colors duration-240" />
                    )}
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-accent scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 origin-left transition-transform duration-400" />
                  </span>
                  <span className="text-center">
                    <span className="block font-sans text-base font-semibold text-paper-200 group-hover:text-paper-50 transition-colors">{p.name}</span>
                    <span className="block font-mono text-[11px] text-ink-400 mt-1 leading-snug">{p.blurb}</span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}
