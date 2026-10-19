// Owner sign-in: email + password through Supabase Auth.
// Only one account exists (created by hand in the dashboard, public sign-ups
// disabled) and the database only accepts writes from it (see schema.sql).
import { supabase, isSupabaseConfigured } from './supabase';

const TRUST_KEY = 'yr_trust'; // localStorage: "trust this device" was ticked
const TAB_KEY = 'yr_tab';     // sessionStorage: signed in during this tab

export const isOwnerAuthConfigured = () => isSupabaseConfigured;

const fail = (code, extra = {}) => Object.assign(new Error(code), { code, ...extra });

async function confirmOwner() {
  const { data, error } = await supabase.rpc('is_owner');
  return !error && data === true;
}

export async function signInOwner(email, password, trust) {
  if (!supabase) throw fail('not_configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw fail(error.status === 429 ? 'rate_limited' : 'invalid');
  // Same generic error for a valid account that is not the owner.
  if (!(await confirmOwner())) {
    await supabase.auth.signOut();
    throw fail('invalid');
  }
  try {
    if (trust) localStorage.setItem(TRUST_KEY, '1'); else localStorage.removeItem(TRUST_KEY);
    sessionStorage.setItem(TAB_KEY, '1');
  } catch { /* storage blocked */ }
  return data.session;
}

// Returns the owner session if this browser is still signed in and trusted.
export async function restoreOwnerSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  let trusted = false;
  let sameTab = false;
  try {
    trusted = localStorage.getItem(TRUST_KEY) === '1';
    sameTab = sessionStorage.getItem(TAB_KEY) === '1';
  } catch { /* storage blocked */ }
  if (!trusted && !sameTab) {
    await supabase.auth.signOut();
    return null;
  }
  if (!(await confirmOwner())) {
    await supabase.auth.signOut();
    return null;
  }
  return data.session;
}

export async function signOutOwner() {
  if (supabase) await supabase.auth.signOut();
  try {
    localStorage.removeItem(TRUST_KEY);
    sessionStorage.removeItem(TAB_KEY);
  } catch { /* storage blocked */ }
}
