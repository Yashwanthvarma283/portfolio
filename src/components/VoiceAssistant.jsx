import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Microphone, MicrophoneSlash, X } from '@phosphor-icons/react';
import SiriOrb from './SiriOrb';
import { getVapi, VAPI_ASSISTANT_ID } from '../lib/vapi';

const SPRING = { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 };
const LABEL = { idle: 'Tap to talk', connecting: 'Connecting', listening: 'Listening', speaking: 'Speaking', error: '' };
const SPEED = { idle: 0.6, connecting: 2.2, listening: 1, speaking: 1.5, error: 0.4 };

export default function VoiceAssistant({ personaId }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | connecting | listening | speaking | error
  const [lines, setLines] = useState({ user: '', assistant: '' });
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState('');
  const [hint, setHint] = useState(false);

  const statusRef = useRef('idle');
  const micRef = useRef(0);
  const volRef = useRef(0);
  const vapiRef = useRef(null);
  const wiredRef = useRef(false);
  const stopMicRef = useRef(null);
  const scrollRef = useRef(null);

  const setS = useCallback((s) => { statusRef.current = s; setStatus(s); }, []);

  // ── mic level (for the orb while you speak) ─────────────────
  const stopMic = useCallback(() => {
    if (stopMicRef.current) { stopMicRef.current(); stopMicRef.current = null; }
    micRef.current = 0;
  }, []);

  const startMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const an = ctx.createAnalyser();
      an.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(an);
      const buf = new Uint8Array(an.frequencyBinCount);
      let raf;
      const tick = () => {
        an.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i += 1) { const d = (buf[i] - 128) / 128; sum += d * d; }
        micRef.current = Math.min(1, Math.sqrt(sum / buf.length) * 4.5);
        raf = requestAnimationFrame(tick);
      };
      tick();
      stopMicRef.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((t) => t.stop());
        ctx.close();
      };
    } catch { /* the call itself reports permission problems */ }
  }, []);

  // ── Vapi wiring (once per mount) ────────────────────────────
  const wire = useCallback(async () => {
    const vapi = await getVapi();
    vapiRef.current = vapi;
    if (wiredRef.current) return vapi;
    wiredRef.current = true;
    vapi.on('call-start', () => { setS('listening'); startMic(); });
    vapi.on('call-end', () => { setS('idle'); stopMic(); volRef.current = 0; setMuted(false); });
    vapi.on('speech-start', () => setS('speaking'));
    vapi.on('speech-end', () => { if (statusRef.current === 'speaking') setS('listening'); });
    vapi.on('volume-level', (v) => { volRef.current = v; });
    vapi.on('message', (m) => {
      if (m?.type !== 'transcript' || !m.transcript) return;
      if (m.role === 'assistant') setLines((l) => ({ ...l, assistant: m.transcript }));
      else setLines({ user: m.transcript, assistant: '' });
    });
    vapi.on('error', (e) => {
      console.error('[vapi]', e);
      setError("I couldn't connect. Check your microphone permission and try again.");
      setS('error');
      stopMic();
    });
    return vapi;
  }, [setS, startMic, stopMic]);

  const start = useCallback(async () => {
    setError('');
    setLines({ user: '', assistant: '' });
    setMuted(false);
    setS('connecting');
    try {
      const vapi = await wire();
      await vapi.start(VAPI_ASSISTANT_ID, { variableValues: { profile: personaId || 'visitor' } });
    } catch (e) {
      console.error('[vapi]', e);
      setError("I couldn't connect. Check your microphone permission and try again.");
      setS('error');
    }
  }, [personaId, setS, wire]);

  const stop = useCallback(() => {
    try { vapiRef.current?.stop(); } catch { /* already stopped */ }
    stopMic();
    setS('idle');
  }, [setS, stopMic]);

  const openPanel = () => { setHint(false); setOpen(true); start(); };
  const closePanel = () => { setOpen(false); stop(); };
  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    try { vapiRef.current?.setMuted(next); } catch { /* not in a call */ }
  };

  // Siri-style hint pill after the page settles
  useEffect(() => {
    const a = setTimeout(() => setHint(true), 2200);
    const b = setTimeout(() => setHint(false), 9500);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') closePanel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Tear down when the profile changes / component unmounts
  useEffect(() => () => {
    try { vapiRef.current?.stop(); vapiRef.current?.removeAllListeners?.(); } catch { /* noop */ }
    stopMic();
    wiredRef.current = false;
  }, [stopMic]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const getLevel = useCallback(() => {
    const t = performance.now();
    switch (statusRef.current) {
      case 'speaking': return Math.max(0.3, Math.min(1, volRef.current * 1.7));
      case 'listening': return Math.max(0.15 + 0.05 * Math.sin(t / 500), micRef.current);
      case 'connecting': return 0.24 + 0.1 * Math.sin(t / 170);
      case 'error': return 0.05;
      default: return 0.1 + 0.06 * Math.sin(t / 800);
    }
  }, []);

  const active = status === 'listening' || status === 'speaking' || status === 'connecting';
  const placeholder = status === 'connecting' ? '' : "Hi, I'm Yashwanth's assistant. Ask me anything.";

  return (
    <>
      {/* corner glow, like Siri lighting the screen edge */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="glow"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="siri-glow fixed right-0 bottom-0 z-[69] pointer-events-none w-[min(95vw,780px)] h-[min(80vh,640px)]"
          />
        )}
      </AnimatePresence>

      <div
        className="fixed z-[70] right-4 bottom-4 sm:right-6 sm:bottom-6 flex flex-col items-end gap-3"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              key="panel"
              role="dialog"
              aria-label="Voice assistant"
              initial={{ opacity: 0, scale: 0.7, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 16 }}
              transition={SPRING}
              style={{ transformOrigin: 'bottom right' }}
              className="relative w-[min(92vw,372px)] rounded-[32px] bg-[rgba(12,10,22,0.9)] backdrop-blur-3xl backdrop-saturate-150 border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)] text-white overflow-hidden px-6 pt-7 pb-5"
            >
              <button
                onClick={closePanel}
                aria-label="Close assistant"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors btn-press"
              >
                <X size={14} weight="bold" />
              </button>

              <div className="flex flex-col items-center">
                <motion.button
                  layoutId="siri-orb"
                  transition={SPRING}
                  onClick={status === 'idle' || status === 'error' ? start : undefined}
                  aria-label={status === 'idle' || status === 'error' ? 'Talk again' : LABEL[status]}
                  className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <SiriOrb size={116} getLevel={getLevel} speed={SPEED[status]} />
                </motion.button>
                <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.2em] text-white/50 h-4">
                  {status === 'error' ? 'Unavailable' : LABEL[status]}
                </p>
              </div>

              <div
                ref={scrollRef}
                className="mt-3 min-h-[84px] max-h-[170px] overflow-y-auto text-center siri-fade"
                aria-live="polite"
              >
                {status === 'error' ? (
                  <p className="font-sans text-[15px] leading-snug text-white/70">{error}</p>
                ) : (
                  <>
                    {lines.user && <p className="font-sans text-[14px] leading-snug text-white/45 mb-2">{lines.user}</p>}
                    {lines.assistant
                      ? <p className="font-sans text-[19px] leading-snug font-medium text-white">{lines.assistant}</p>
                      : !lines.user && placeholder && <p className="font-sans text-[16px] leading-snug text-white/55">{placeholder}</p>}
                  </>
                )}
              </div>

              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={toggleMute}
                  disabled={!active}
                  aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:hover:bg-white/10 flex items-center justify-center transition-colors btn-press"
                >
                  {muted ? <MicrophoneSlash size={19} weight="fill" /> : <Microphone size={19} weight="fill" />}
                </button>
                <button
                  onClick={active ? stop : start}
                  className="h-11 px-5 rounded-full bg-white/15 hover:bg-white/25 font-sans text-[13px] font-medium transition-colors btn-press"
                >
                  {active ? 'End' : 'Talk'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!open && (
            <div key="launcher" className="flex items-center gap-3">
              <AnimatePresence>
                {hint && (
                  <motion.span
                    initial={{ opacity: 0, x: 12, scale: 0.92 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden sm:block rounded-full bg-[rgba(16,14,26,0.78)] backdrop-blur-xl border border-white/10 text-white font-sans text-[13px] px-4 py-2 shadow-lg"
                  >
                    Ask me anything
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.button
                layoutId="siri-orb"
                transition={SPRING}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={openPanel}
                aria-label="Talk to Yashwanth's voice assistant"
                className="rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <SiriOrb size={58} getLevel={getLevel} speed={SPEED.idle} />
              </motion.button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
