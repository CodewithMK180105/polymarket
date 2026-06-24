/**
 * Typed API client for the Polymarket backend (Express on port 3000).
 * Auth: pass Supabase access_token as bare Authorization header.
 */
import type {
  Market,
  Position,
  OrderHistory,
  CreateMarketRequest,
  CreateOrderRequest,
  SplitMergeRequest,
  OnrampOfframpRequest,
} from '@/types';


const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...init } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = token;

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch { /* ignore */ }
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

// ─── Public endpoints ─────────────────────────────────────────────

export async function getMarkets(): Promise<{ markets: Market[] }> {
  return request('/markets');
}

export async function getMarket(marketId: string): Promise<{ market: Market | null }> {
  return request(`/market?marketId=${encodeURIComponent(marketId)}`);
}

export async function createMarket(
  token: string,
  body: CreateMarketRequest,
): Promise<{ market: Market }> {
  return request('/market/create', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}



// ─── Authenticated endpoints ──────────────────────────────────────

export async function getBalance(token: string): Promise<{ balance: number }> {
  return request('/balance', { token });
}

export async function getPositions(token: string): Promise<{ positions: Position[] }> {
  return request('/positions', { token });
}

export async function getHistory(token: string): Promise<{ history: OrderHistory[] }> {
  return request('/history', { method: 'POST', token });
}

export async function createOrder(
  token: string,
  body: CreateOrderRequest,
): Promise<{ message: string }> {
  return request('/order', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}

export async function splitTokens(
  token: string,
  body: SplitMergeRequest,
): Promise<{ message: string }> {
  return request('/split', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}

export async function mergeTokens(
  token: string,
  body: SplitMergeRequest,
): Promise<{ message: string }> {
  return request('/merge', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}

export async function onramp(
  token: string,
  body: OnrampOfframpRequest,
): Promise<{ message: string; amount: number }> {
  return request('/onramp', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}

export async function offramp(
  token: string,
  body: OnrampOfframpRequest,
): Promise<{ message: string; amount: number }> {
  return request('/offramp', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}

export { ApiError };
