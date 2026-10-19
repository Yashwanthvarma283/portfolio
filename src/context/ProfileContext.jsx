import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { PERSONAS } from '../data/personas';
import { restoreOwnerSession, signOutOwner } from '../lib/ownerAuth';

const ProfileContext = createContext(null);
const STORE_KEY = 'yr_persona';
const PUBLIC_IDS = ['hr', 'recruiter', 'developer', 'visitor'];

function initialPersona() {
  try {
    const as = new URLSearchParams(window.location.search).get('as');
    if (PUBLIC_IDS.includes(as)) {
      localStorage.setItem(STORE_KEY, as);
      return as;
    }
    const saved = localStorage.getItem(STORE_KEY);
    if (PUBLIC_IDS.includes(saved)) return saved;
  } catch { /* storage blocked */ }
  return null;
}

export function ProfileProvider({ children }) {
  const [personaId, setPersonaId] = useState(initialPersona);
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);

  const pick = useCallback((id) => {
    if (id === 'owner') {
      restoreOwnerSession().then((session) => {
        if (session) { setPersonaId('owner'); window.scrollTo({ top: 0, behavior: 'instant' }); }
        else setOwnerModalOpen(true);
      });
      return;
    }
    try { localStorage.setItem(STORE_KEY, id); } catch { /* storage blocked */ }
    setPersonaId(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const ownerSignedIn = useCallback(() => {
    setOwnerModalOpen(false);
    setPersonaId('owner');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const switchProfile = useCallback(() => {
    try { localStorage.removeItem(STORE_KEY); } catch { /* storage blocked */ }
    setPersonaId(null);
  }, []);

  const signOut = useCallback(async () => {
    await signOutOwner();
    setPersonaId(null);
  }, []);

  // Returning owner on a trusted device goes straight to the owner view.
  useEffect(() => {
    let alive = true;
    restoreOwnerSession().then((session) => { if (alive && session) setPersonaId('owner'); });
    return () => { alive = false; };
  }, []);

  // Freeze smooth scroll while the picker is showing.
  useEffect(() => {
    if (!window.lenis) return;
    if (personaId) window.lenis.start(); else window.lenis.stop();
  }, [personaId]);

  const value = {
    personaId,
    persona: personaId ? PERSONAS[personaId] : null,
    isOwner: personaId === 'owner',
    pick,
    switchProfile,
    signOut,
    ownerSignedIn,
    ownerModalOpen,
    closeOwnerModal: () => setOwnerModalOpen(false),
  };
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export const useProfile = () => useContext(ProfileContext);
