import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabase';
import { getProfile, Profile } from '@/src/models/profiles.model';
import { getMyCurrentTenancy, MyTenancy } from '@/src/models/tenancies.model';

type SessionState = {
  status: 'loading' | 'signedOut' | 'signedIn';
  session: Session | null;
  profile: Profile | null;
  myTenancy: MyTenancy | null;
  refresh: () => Promise<void>;
};

const SessionContext = createContext<SessionState | null>(null);

/** Loads the profile (and, for tenants, their current house) whenever the auth session changes. */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [myTenancy, setMyTenancy] = useState<MyTenancy | null>(null);
  const [status, setStatus] = useState<SessionState['status']>('loading');

  const loadForSession = useCallback(async (s: Session | null) => {
    if (!s) {
      setProfile(null);
      setMyTenancy(null);
      setStatus('signedOut');
      return;
    }
    const p = await getProfile(s.user.id);
    setProfile(p);
    if (p?.role === 'tenant') {
      setMyTenancy(await getMyCurrentTenancy());
    } else {
      setMyTenancy(null);
    }
    setStatus('signedIn');
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadForSession(data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      loadForSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadForSession]);

  const refresh = useCallback(async () => {
    await loadForSession(session);
  }, [session, loadForSession]);

  const value = useMemo(
    () => ({ status, session, profile, myTenancy, refresh }),
    [status, session, profile, myTenancy, refresh]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a SessionProvider');
  return ctx;
}
