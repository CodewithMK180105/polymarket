import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createContext, useContext, useState, type ReactNode } from 'react';

const SUPABASE_URL = 'https://oljprmqrtevlseoushbu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__t45A4rZiR53nLv8ifYGbA_1_Lo9GVY';

interface SupabaseContextValue {
  supabase: SupabaseClient;
}

const SupabaseContext = createContext<SupabaseContextValue | null>(null);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabaseContext(): SupabaseClient {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error('useSupabaseContext must be used within SupabaseProvider');
  return ctx.supabase;
}
