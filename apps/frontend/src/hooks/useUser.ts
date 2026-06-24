import { useEffect, useState, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useSupabaseContext } from '@/context/SupabaseContext';

// Extend Window type for Solflare
declare global {
  interface Window {
    solflare?: {
      signMessage: (msg: Uint8Array) => Promise<{ signature: Uint8Array }>;
      publicKey?: { toString: () => string };
      connect: () => Promise<void>;
      isConnected?: boolean;
    };
  }
}

export interface AuthState {
  session: Session | null;
  address: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSolflareInstalled: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Extract wallet address from a Supabase session.
 * The backend middleware reads: user?.user_metadata.custom_claims.address
 * We use the same path here as the primary source, with fallbacks.
 */
function extractAddress(session: Session | null): string | null {
  if (!session?.user) return null;
  const meta = session.user.user_metadata as Record<string, any> | undefined;
  // Primary: custom_claims.address (matches backend middleware)
  const fromClaims = meta?.custom_claims?.address as string | undefined;
  if (fromClaims) return fromClaims;
  // Fallback: some Supabase Web3 adapters store address at top level
  const fromMeta = meta?.address as string | undefined;
  if (fromMeta) return fromMeta;
  return null;
}

export function useUser(): AuthState {
  const supabase = useSupabaseContext();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSolflareInstalled, setIsSolflareInstalled] = useState(
    typeof window !== 'undefined' && !!window.solflare,
  );

  // Poll briefly for Solflare extension to load (it injects asynchronously)
  useEffect(() => {
    if (isSolflareInstalled) return;
    let attempts = 0;
    const interval = setInterval(() => {
      if (window.solflare) {
        setIsSolflareInstalled(true);
        clearInterval(interval);
      }
      if (++attempts > 10) clearInterval(interval); // stop after ~2s
    }, 200);
    return () => clearInterval(interval);
  }, [isSolflareInstalled]);

  useEffect(() => {
    // Get initial session synchronously
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // isLoading should be false after the first getSession resolves;
      // guard here in case onAuthStateChange fires first.
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signIn = useCallback(async () => {
    if (!window.solflare) {
      window.open('https://solflare.com', '_blank');
      return;
    }
    await supabase.auth.signInWithWeb3({
      chain: 'solana',
      statement: 'I confirm I want to sign in into the prediction market',
      wallet: window.solflare,
    } as any);
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, [supabase]);

  const address = extractAddress(session);
  const token = session?.access_token ?? null;

  return {
    session,
    address,
    token,
    isAuthenticated: !!session && !!address,
    isLoading,
    isSolflareInstalled,
    signIn,
    signOut,
  };
}