import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Market, Orderbook } from '@/types';

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format cent-integer balance to "$X.XX" */
export function formatBalance(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Truncate a Solana wallet address for display */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/** Parse an orderbook from JSON string or object */
export function parseOrderbook(raw: unknown): Orderbook {
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  if (raw && typeof raw === 'object') return raw as Orderbook;
  return {};
}

/** 
 * Get best YES price from a market's orderbook.
 * Returns the lowest ask price in the yes orderbook (0–100 scale).
 */
export function getYesBestPrice(market: Market): number | null {
  const ob = parseOrderbook(market.yesOrderbook);
  const prices = Object.keys(ob)
    .map(Number)
    .filter(p => (ob[String(p)]?.availableQty ?? 0) > 0)
    .sort((a, b) => a - b);
  return prices.length > 0 ? prices[0]! : null;
}

export function getNoBestPrice(market: Market): number | null {
  const ob = parseOrderbook(market.noOrderbook);
  const prices = Object.keys(ob)
    .map(Number)
    .filter(p => (ob[String(p)]?.availableQty ?? 0) > 0)
    .sort((a, b) => a - b);
  return prices.length > 0 ? prices[0]! : null;
}

/** 
 * Derive display percentages from orderbook.
 * If no orders, fall back to 50/50.
 */
export function getMarketPercents(market: Market): { yes: number; no: number } {
  const yesBest = getYesBestPrice(market);
  const noBest = getNoBestPrice(market);

  if (yesBest !== null && noBest !== null) {
    const total = yesBest + noBest;
    if (total > 0) {
      return { yes: Math.round((yesBest / total) * 100), no: Math.round((noBest / total) * 100) };
    }
  }
  if (yesBest !== null) return { yes: yesBest, no: 100 - yesBest };
  if (noBest !== null) return { yes: 100 - noBest, no: noBest };

  return { yes: 50, no: 50 };
}

/** Format a price integer to display "60¢" */
export function formatPrice(price: number): string {
  return `${price}¢`;
}

/** Format timestamp to relative time */
export function relativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = Date.now();
  const diff = now - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/** Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
