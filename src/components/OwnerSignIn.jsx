import { useState } from 'react';
import { motion } from 'motion/react';
import { X } from '@phosphor-icons/react';
import { isOwnerAuthConfigured, signInOwner } from '../lib/ownerAuth';

const MESSAGES = {
  invalid: 'Email or password is incorrect.',
  rate_limited: 'Too many attempts. Please wait a while and try again.',
  request_failed: 'Something went wrong. Please try again.',
};

const field =
  'w-full rounded-lg bg-ink-800 border border-ink-600 focus:border-accent focus:outline-none px-4 py-3 font-sans text-sm text-paper-100 placeholder:text-ink-500';

export default function OwnerSignIn({ onClose, onSuccess }) {
  const configured = isOwnerAuthConfigured();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [trust, setTrust] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (ev) => {
    ev.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signInOwner(email, password, trust);
      onSuccess();
    } catch (e) {
      setError(MESSAGES[e.code] || MESSAGES.request_failed);
    }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-ink-950/80 backdrop-blur-sm px-5" role="dialog" aria-modal="true" aria-label="Owner sign-in">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm rounded-2xl bg-ink-900 border border-ink-700 p-7 text-paper-100"
      >
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-ink-400 hover:text-paper-100 btn-press">
          <X size={18} />
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400 mb-2">Owner sign-in</p>

        {!configured ? (
          <>
            <h2 className="font-display italic text-3xl font-light mb-3">Not connected yet</h2>
            <p className="font-sans text-sm text-ink-300 leading-relaxed">
              Owner sign-in needs the backend connection, which has not been set up on this site.
            </p>
          </>
        ) : (
          <form onSubmit={submit}>
            <h2 className="font-display italic text-3xl font-light mb-5">Welcome back</h2>
            <div className="space-y-3 mb-4">
              <input
                type="email" autoComplete="username" required autoFocus
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email" aria-label="Email" className={field}
              />
              <input
                type="password" autoComplete="current-password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" aria-label="Password" className={field}
              />
            </div>
            <label className="flex items-center gap-2 font-sans text-sm text-ink-300 mb-5 cursor-pointer">
              <input type="checkbox" checked={trust} onChange={(e) => setTrust(e.target.checked)} className="accent-[#C2622D]" />
              Trust this device
            </label>
            <button disabled={busy || !email || !password} className="w-full rounded-full bg-accent hover:bg-accent-hover text-white font-mono text-xs uppercase tracking-widest py-3 btn-press disabled:opacity-50 transition-colors">
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        {error && <p role="alert" className="font-sans text-sm text-red-400 mt-4">{error}</p>}
      </motion.div>
    </div>
  );
}
