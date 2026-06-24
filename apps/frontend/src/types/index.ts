// Types mirroring the Prisma schema (packages/db/prisma/schema.prisma)

export interface User {
  id: string;
  address: string;
  usdBalance: number; // stored in cents: $100.50 => 10050
}

export interface Market {
  id: string;
  title: string;
  description: string;
  resolutionDescription: string;
  category?: string | null;
  endDate?: string | null;  // ISO string from DB
  yesOrderbook: Orderbook | string;
  noOrderbook: Orderbook | string;
  totalQty: number;
  resolution: PositionType | null;
}

export type PositionType = 'Yes' | 'No';
export type OrderType = 'Buy' | 'Sell' | 'Split' | 'Merge';

export interface Position {
  id: string;
  userId: string;
  marketId: string;
  type: PositionType;
  qty: number;
}

export interface OrderHistory {
  id: string;
  orderType: OrderType;
  qty: number;
  price: number; // in cents (e.g. 60 = $0.60)
  userId: string;
  marketId: string;
}

// Orderbook structure (stored as JSON in DB)
export interface OrderbookLevel {
  availableQty: number;
  orders: OrderbookEntry[];
}

export interface OrderbookEntry {
  userId: string;
  qty: number;
  filledQty: number;
  originalOrderId: string;
  reverseOrder: boolean;
}

export type Orderbook = Record<string, OrderbookLevel>;

// API request/response types
export interface CreateMarketRequest {
  title: string;
  description: string;
  resolutionDescription: string;
  category?: string;
  endDate?: string; // ISO date string
}

export interface CreateOrderRequest {
  marketId: string;
  side: 'yes' | 'no';
  type: 'buy' | 'sell';
  price: number; // integer, e.g. 60 = 60 cents
  qty: number;
}

export interface SplitMergeRequest {
  marketId: string;
  amount: number;
}

export interface OnrampOfframpRequest {
  amount: number; // USD, e.g. 100.50
}

// Computed helpers
export interface MarketWithPrices extends Market {
  yesBestPrice: number | null;  // best ask price in yes book (0–100)
  noBestPrice: number | null;
  yesPercent: number;           // 0–100 display percent
  noPercent: number;
}

export interface PositionWithMarket extends Position {
  market?: Market;
}
